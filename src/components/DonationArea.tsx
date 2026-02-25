import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, PawPrint, MessageCircle, Info, Lock, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { Pet, User } from '../types';

interface DonationAreaProps {
    user: User | null;
}

const DonationArea: React.FC<DonationAreaProps> = ({ user }) => {
    const [pets, setPets] = useState<(Pet & { owner: { email: string } })[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState<(Pet & { owner: { email: string } }) | null>(null);

    useEffect(() => {
        fetchPublicPets();
    }, []);

    const fetchPublicPets = async () => {
        try {
            const res = await fetch('/api/public/pets');
            const data = await res.json();
            // Mostrar apenas animais para adoção
            const adoptionPets = data.filter((p: any) => p.intent === 'adoption');
            setPets(adoptionPets);
        } catch (err) {
            console.error('Error fetching public pets:', err);
        } finally {
            setLoading(false);
        }
    };

    const getIntentLabel = (intent: string) => {
        switch (intent) {
            case 'adoption': return 'Adoção';
            case 'sale': return 'Venda';
            case 'breeding': return 'Cruza';
            default: return '';
        }
    };

    const getIntentColor = (intent: string) => {
        switch (intent) {
            case 'adoption': return 'bg-green-500';
            case 'sale': return 'bg-brand-primary';
            case 'breeding': return 'bg-purple-500';
            default: return 'bg-stone-500';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <div className="text-center mb-16">
                <div className="inline-flex p-4 bg-brand-bg rounded-3xl mb-6">
                    <PawPrint className="w-12 h-12 text-brand-primary" />
                </div>
                <h2 className="text-4xl font-black mb-4">Adoção e Busca</h2>
                <p className="text-stone-500 max-w-2xl mx-auto font-medium">
                    Encontre o novo membro da sua família ou parceiros para cruza.
                    Nossa comunidade está aqui para conectar tutores de forma responsável.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
                </div>
            ) : pets.length === 0 ? (
                <div className="text-center py-20 bg-stone-50 rounded-[40px]">
                    <p className="text-stone-400 font-bold">Nenhum pet disponível no momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {pets.map(pet => (
                        <motion.div
                            key={pet.id}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group"
                        >
                            <div className="relative aspect-square overflow-hidden bg-stone-50">
                                <img
                                    src={pet.photoUrl || `https://picsum.photos/seed/${pet.id}/600/400`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {pet.photoUrl && (
                                    <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-stone-900/0 transition-colors" />
                                )}
                                {pet.ownerPhotoUrl && (
                                    <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-stone-100 z-10">
                                        <img src={pet.ownerPhotoUrl} alt="Tutor" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className={`absolute top-4 right-4 ${getIntentColor(pet.intent)} text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg`}>
                                    {getIntentLabel(pet.intent)}
                                </div>
                            </div>

                            <div className="p-5 text-center">
                                <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-primary transition-colors truncate">{pet.name}</h3>
                                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-3 truncate">{pet.breed || pet.species}</p>

                                <div className="flex items-center justify-center gap-1 text-[10px] font-black text-stone-500 uppercase tracking-tighter mb-4">
                                    <MapPin className="w-3 h-3 text-brand-primary" />
                                    {pet.city}, {pet.state}
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setSelectedPet(pet)}
                                        className="w-full py-2.5 bg-brand-bg hover:bg-brand-primary text-brand-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        {user ? 'Detalhes' : 'Entrar'}
                                        {!user && <Lock className="w-3 h-3" />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!user) {
                                                setSelectedPet(pet);
                                                return;
                                            }
                                            const phone = pet.contact?.replace(/\D/g, '');
                                            if (phone) window.open(`https://wa.me/${phone}`, '_blank');
                                            else alert('Contato não informado pelo tutor.');
                                        }}
                                        className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-0.5 shadow-sm px-1"
                                    >
                                        <div className="flex items-center gap-1">
                                            WhatsApp
                                            <MessageCircle className="w-3 h-3" />
                                        </div>
                                        {user && pet.contact && (
                                            <span className="text-[8px] opacity-90">{pet.contact}</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal de Detalhes com Restrição */}
            <AnimatePresence>
                {selectedPet && (
                    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            {user ? (
                                <div className="flex flex-col md:flex-row h-[500px]">
                                    <div className="w-full md:w-1/2 h-64 md:h-full relative">
                                        <img
                                            src={selectedPet.photoUrl || `https://picsum.photos/seed/${selectedPet.id}/600/400`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className={`absolute top-6 left-6 ${getIntentColor(selectedPet.intent)} text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest`}>
                                            {getIntentLabel(selectedPet.intent)}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2 p-10 flex flex-col">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h2 className="text-4xl font-black text-stone-900 leading-none">{selectedPet.name}</h2>
                                                <p className="text-stone-400 font-bold mt-2">{selectedPet.breed}</p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedPet(null)}
                                                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                                            >
                                                <PawPrint className="w-6 h-6 rotate-45 text-stone-300" />
                                            </button>
                                        </div>

                                        <div className="space-y-6 flex-grow">
                                            <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-3xl">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200 border-2 border-white shadow-sm">
                                                    {selectedPet.ownerPhotoUrl ? (
                                                        <img src={selectedPet.ownerPhotoUrl} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                                                            <PawPrint className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Tutor Responsável</p>
                                                    <p className="text-sm font-bold text-stone-900">Interessado em Contato</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                                    <p className="text-[10px] font-black uppercase text-stone-400 mb-1">Idade</p>
                                                    <p className="font-bold text-stone-700">{selectedPet.birthDate || 'Não informada'}</p>
                                                </div>
                                                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                                    <p className="text-[10px] font-black uppercase text-stone-400 mb-1">Gênero</p>
                                                    <p className="font-bold text-stone-700">{selectedPet.gender === 'M' ? 'Macho' : 'Fêmea'}</p>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-brand-bg rounded-3xl border border-brand-primary/10">
                                                <div className="flex items-center gap-3 mb-4 text-brand-primary font-black uppercase text-xs tracking-widest">
                                                    <UserIcon className="w-4 h-4" />
                                                    Dados do Tutor
                                                </div>
                                                <div className="space-y-3">
                                                    <p className="flex items-center gap-3 text-stone-600 font-bold">
                                                        <MessageCircle className="w-4 h-4 text-brand-primary/40" />
                                                        {selectedPet.owner.email}
                                                    </p>
                                                    <p className="flex items-center gap-3 text-stone-600 font-bold">
                                                        <Phone className="w-4 h-4 text-brand-primary/40" />
                                                        {selectedPet.contact || 'Não informado'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <a
                                            href={`https://wa.me/${selectedPet.contact?.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-center shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            Entrar em Contato
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 bg-brand-bg rounded-[30px] flex items-center justify-center mx-auto mb-8">
                                        <Lock className="w-10 h-10 text-brand-primary" />
                                    </div>
                                    <h2 className="text-3xl font-black mb-4">Acesso Restrito</h2>
                                    <p className="text-stone-500 font-medium mb-8 leading-relaxed">
                                        Para proteger a segurança dos nossos pets e tutores,
                                        é necessário estar logado para ver detalhes e entrar em contato.
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setSelectedPet(null)}
                                            className="flex-1 py-4 bg-stone-100 text-stone-500 rounded-2xl font-black"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            onClick={() => window.location.href = '/'} // Redireciona para home onde está o login
                                            className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/20"
                                        >
                                            Fazer Login
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="mt-24 bg-brand-primary rounded-[50px] p-16 flex flex-col md:flex-row items-center gap-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                <div className="flex-1 relative z-10">
                    <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">Nossa Missão</span>
                    <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Encontre um amigo, mude seu propósito.</h3>
                    <p className="text-white/70 text-lg mb-8 font-medium leading-relaxed">
                        A PetLocal conecta animais abandonados com lares amorosos.
                        Milhares de pets aguardam por uma chance de receber carinho e segurança.
                        Faça parte desta transformação.
                    </p>
                    <button className="bg-white text-brand-primary px-8 py-5 rounded-[20px] font-black text-lg hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-3">
                        Ver Todos os Pets <PawPrint className="w-6 h-6" />
                    </button>
                </div>
                <div className="w-full md:w-[400px] aspect-square rounded-[40px] overflow-hidden shadow-2xl rotate-3 relative z-10 border-8 border-white/10 group">
                    <img
                        src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=600&auto=format&fit=crop"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default DonationArea;
