import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PawPrint, MapPin, Camera, Tag, Heart, ShieldCheck, Search, X, Lock, Plus } from 'lucide-react';
import { Pet, User } from '../types';

interface Top10ViewProps {
    user: User | null;
    setView: (view: any) => void;
}

const Top10View: React.FC<Top10ViewProps> = ({ user, setView }) => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    useEffect(() => {
        fetchTop10();
    }, []);

    const fetchTop10 = async () => {
        try {
            const res = await fetch('/api/public/top10');
            const data = await res.json();
            setPets(data);
        } catch (err) {
            console.error('Error fetching top 10:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (intent: string) => {
        switch (intent) {
            case 'registrado': return { label: 'Registrado', icon: ShieldCheck, color: 'text-green-500 bg-green-50' };
            case 'lost': return { label: 'Perdido', icon: Search, color: 'text-red-500 bg-red-50' };
            case 'adoption': return { label: 'Doação', icon: Heart, color: 'text-blue-500 bg-blue-50' };
            case 'sale': return { label: 'Venda', icon: Tag, color: 'text-blue-500 bg-blue-50' };
            case 'deceased': return { label: 'Falecido', icon: Plus, color: 'text-red-600 bg-red-50 border-red-100' };
            default: return { label: 'Registro', icon: PawPrint, color: 'text-stone-400 bg-stone-50' };
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block bg-brand-primary/10 p-3 rounded-2xl text-brand-primary mb-4"
                >
                    <PawPrint className="w-8 h-8" />
                </motion.div>
                <h1 className="text-5xl font-serif mb-4">Top 10 PetLocal</h1>
                <p className="text-stone-500 max-w-2xl mx-auto font-medium">
                    Conheça os últimos amigos que se juntaram à nossa comunidade.
                    {!user && <span className="block mt-2 text-brand-primary/60 italic">* Faça login para ver mais detalhes sobre cada pet.</span>}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {pets.map((pet, index) => {
                        const status = getStatusInfo(pet.intent);
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                key={pet.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={user ? { y: -8 } : {}}
                                onClick={() => user && setSelectedPet(pet)}
                                className={`bg-white rounded-[32px] overflow-hidden shadow-sm border border-stone-100 group transition-all ${user ? 'cursor-pointer hover:shadow-xl' : 'opacity-90'}`}
                            >
                                <div className="relative aspect-square overflow-hidden bg-stone-50">
                                    {pet.photoUrl ? (
                                        <img
                                            src={pet.photoUrl}
                                            alt={pet.name}
                                            className={`w-full h-full object-cover transition-transform duration-700 ${user ? 'group-hover:scale-110' : ''}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-200">
                                            <Camera className="w-12 h-12" />
                                        </div>
                                    )}

                                    {/* Privacy Overlay for Non-Logged Users */}
                                    {!user && (
                                        <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[1px] flex items-center justify-center">
                                            <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg">
                                                <Lock className="w-5 h-5 text-brand-primary" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Tutor Photo */}
                                    {pet.ownerPhotoUrl && (
                                        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-stone-100 z-10">
                                            <img src={pet.ownerPhotoUrl} alt="Tutor" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-brand-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            #{index + 1}
                                        </span>
                                    </div>

                                    {user && (
                                        <div className={`absolute top-4 right-4 ${status.color} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </div>
                                    )}
                                </div>

                                {user ? (
                                    <div className="p-5 text-center">
                                        <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-primary transition-colors mb-1 truncate">{pet.name}</h3>
                                        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-3 truncate">
                                            {pet.breed || pet.species}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 text-[9px] font-black text-stone-500 uppercase tracking-tighter">
                                            <MapPin className="w-3 h-3 text-brand-primary" />
                                            {pet.city || 'PetLocal'}, {pet.state || 'BR'}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-5 text-center bg-stone-50/50">
                                        <div className="h-4 bg-stone-100 rounded-full w-2/3 mx-auto mb-2 animate-pulse" />
                                        <div className="h-3 bg-stone-100 rounded-full w-1/2 mx-auto animate-pulse" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Simple Details Modal */}
            <AnimatePresence>
                {selectedPet && (
                    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                        >
                            <div className="md:w-1/2 aspect-square md:aspect-auto relative bg-stone-100">
                                <img src={selectedPet.photoUrl || ''} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setSelectedPet(null)}
                                    className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-2xl text-white md:hidden"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-3xl font-serif text-stone-900 mb-1">{selectedPet.name}</h2>
                                        <p className="text-brand-primary font-bold uppercase text-xs tracking-widest">
                                            {selectedPet.breed || selectedPet.species}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPet(null)}
                                        className="hidden md:block bg-stone-50 p-2 rounded-2xl text-stone-400 hover:text-stone-900 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6 flex-grow">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-stone-50 p-4 rounded-3xl">
                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 text-center">Sexo</p>
                                            <p className="text-sm font-bold text-stone-900 text-center">{selectedPet.gender === 'M' ? 'Macho' : 'Fêmea'}</p>
                                        </div>
                                        <div className="bg-stone-50 p-4 rounded-3xl">
                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 text-center">Peso</p>
                                            <p className="text-sm font-bold text-stone-900 text-center">{selectedPet.weight || '--'} kg</p>
                                        </div>
                                    </div>

                                    <div className="bg-brand-bg/50 p-6 rounded-[32px] border border-brand-primary/10">
                                        <div className="flex items-center gap-3 mb-4 text-brand-primary">
                                            <MapPin className="w-5 h-5" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Localização</p>
                                                <p className="text-sm font-bold">{selectedPet.city}, {selectedPet.state}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-brand-primary/10">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60 mb-1">Contato do Tutor</p>
                                            <p className="text-sm font-bold text-stone-900">{selectedPet.contact || 'E-mail cadastrado'}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedPet(null)}
                                    className="btn-primary w-full mt-8 py-4 rounded-2xl"
                                >
                                    Fechar Detalhes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="mt-20 text-center bg-brand-bg rounded-[40px] p-12 border border-brand-primary/10">
                <h3 className="text-2xl font-serif mb-4">Também quer registrar seu Pet?</h3>
                <p className="text-stone-500 mb-8 max-w-lg mx-auto font-medium">
                    Garanta o RG Digital, Certidão e Carteira de Vacinas personalizada para o seu melhor amigo agora mesmo!
                </p>
                <button
                    onClick={() => setView('profile')}
                    className="btn-primary px-10 py-4 shadow-xl shadow-brand-primary/20"
                >
                    Registrar Meu Pet Agora
                </button>
            </div>
        </div>
    );
};

export default Top10View;
