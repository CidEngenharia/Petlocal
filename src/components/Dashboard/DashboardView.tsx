import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Maximize2, FileText, ShieldCheck, Award, Home as HomeIcon, Stethoscope, MapPin, MessageCircle, Instagram, User as UserIcon, Pencil, Trash2 } from 'lucide-react';
import { User, Pet, Service } from '../../types';
import PetModal from './PetModal';
import AddServiceModal from './AddServiceModal';
import PetDetailsModal from './PetDetailsModal';

interface DashboardViewProps {
    user: User;
    pets: Pet[];
    services: Service[];
    onRefresh: () => void;
    onViewDocument: (pet: Pet, type: 'RG' | 'BirthCert') => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ user, pets, services, onRefresh, onViewDocument }) => {
    const [showPetModal, setShowPetModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isOwner = user.role === 'owner';

    const handleDeletePet = async (petId: number) => {
        if (!confirm('Deseja realmente excluir este pet e todos os seus documentos?')) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/pets/${petId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) onRefresh();
        } catch (err) {
            alert('Erro ao excluir pet.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteService = async (serviceId: number) => {
        if (!confirm('Deseja realmente excluir este serviço?')) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/services/${serviceId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) onRefresh();
        } catch (err) {
            alert('Erro ao excluir serviço.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-serif mb-2">{isOwner ? 'Meus Pets' : 'Meus Serviços'}</h2>
                    <p className="text-stone-500">
                        {isOwner
                            ? 'Gerencie os documentos e saúde dos seus companheiros.'
                            : 'Gerencie seus serviços e atendimentos na plataforma.'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (isOwner) {
                            setEditingPet(null);
                            setShowPetModal(true);
                        } else {
                            setEditingService(null);
                            setShowServiceModal(true);
                        }
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    {isOwner ? 'Novo Pet' : 'Novo Serviço'}
                </button>
            </div>

            {isOwner ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pets.map(pet => (
                        <div key={pet.id} className="card group cursor-pointer hover:border-brand-primary/30 transition-all" onClick={() => setSelectedPet(pet)}>
                            <div className="flex p-4 gap-6">
                                <div className="w-32 aspect-[3/4] relative overflow-hidden rounded-2xl shadow-md flex-shrink-0">
                                    <img
                                        src={pet.photoUrl || `https://picsum.photos/seed/${pet.id}/300/400`}
                                        alt={pet.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        referrerPolicy="no-referrer"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedImage(pet.photoUrl || `https://picsum.photos/seed/${pet.id}/600/800`);
                                        }}
                                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                    >
                                        <Maximize2 className="w-6 h-6" />
                                    </button>

                                    {/* Owner Avatar Overlay */}
                                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden bg-brand-primary/10 flex items-center justify-center">
                                        {user.photoUrl ? (
                                            <img src={user.photoUrl} alt="Owner" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="w-4 h-4 text-brand-primary" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between py-2 flex-grow">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-serif mb-1">{pet.name}</h3>
                                            <div className="bg-brand-bg px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-brand-primary">
                                                {pet.species === 'dog' ? 'Cão' : pet.species === 'cat' ? 'Gato' : pet.species === 'parrot' ? 'Papagaio' : 'Pássaro'}
                                            </div>
                                        </div>
                                        <p className="text-stone-400 text-sm">{pet.breed}</p>
                                        <p className="text-stone-500 text-[10px] mt-1">
                                            Dono: <span className="font-bold">{user.email.split('@')[0]}</span> • {pet.gender === 'M' ? 'Macho' : pet.gender === 'F' ? 'Fêmea' : 'N/I'}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <div className="bg-stone-100 p-2 rounded-lg cursor-pointer hover:bg-brand-primary/10 hover:text-brand-primary transition-colors" title="RG" onClick={(e) => { e.stopPropagation(); onViewDocument(pet, 'RG'); }}>
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="bg-stone-100 p-2 rounded-lg cursor-pointer hover:bg-brand-primary/10 hover:text-brand-primary transition-colors" title="Certidão" onClick={(e) => { e.stopPropagation(); onViewDocument(pet, 'BirthCert'); }}>
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <div className="bg-stone-100 p-2 rounded-lg" title="Vacinas">
                                            <Award className="w-4 h-4 text-stone-300" />
                                        </div>

                                        <div className="flex-grow text-right flex justify-end gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingPet(pet); setShowPetModal(true); }}
                                                className="p-2 hover:bg-brand-primary/10 rounded-xl transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4 text-stone-400 hover:text-brand-primary" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeletePet(pet.id); }}
                                                className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4 text-stone-400 hover:text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {pets.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-stone-200 rounded-[40px]">
                            <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Plus className="text-stone-400 w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Nenhum pet cadastrado</h3>
                            <p className="text-stone-500 mb-8">Comece cadastrando seu primeiro pet para emitir documentos.</p>
                            <button onClick={() => setShowPetModal(true)} className="btn-secondary">Cadastrar Pet</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map(service => (
                        <div key={service.id} className="card hover:border-brand-primary/30 transition-all">
                            <div className="aspect-video relative">
                                <img
                                    src={service.photoUrl || `https://picsum.photos/seed/service${service.id}/600/400`}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-primary flex items-center gap-2">
                                    {service.type === 'trainer' && <Award className="w-3 h-3" />}
                                    {service.type === 'petsitter' && <Award className="w-3 h-3" />}
                                    {service.type === 'hotel' && <HomeIcon className="w-3 h-3" />}
                                    {service.type === 'vet' && <Stethoscope className="w-3 h-3" />}
                                    {service.type === 'trainer' ? 'Adestrador' : service.type === 'petsitter' ? 'PetSitter' : service.type === 'hotel' ? 'Hotel' : 'Veterinário'}
                                </div>

                                {/* Provider Avatar Overlay */}
                                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden bg-brand-primary/10 flex items-center justify-center">
                                    {user.photoUrl ? (
                                        <img src={user.photoUrl} alt="Provider" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-4 h-4 text-brand-primary" />
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold">{service.name}</h3>
                                    <span className="text-brand-primary font-serif font-bold">R$ {service.price.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-stone-400 text-xs mb-4">
                                    <MapPin className="w-3 h-3" />
                                    {service.location}
                                </div>
                                <p className="text-stone-500 text-sm mb-6 line-clamp-2">{service.description}</p>

                                <div className="flex items-center gap-3">
                                    {service.whatsapp && (
                                        <a
                                            href={`https://wa.me/${service.whatsapp.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-green-50 text-green-600 p-3 rounded-xl hover:bg-green-100 transition-colors"
                                            title="WhatsApp"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                        </a>
                                    )}
                                    {service.instagram && (
                                        <a
                                            href={`https://instagram.com/${service.instagram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-stone-50 text-stone-600 p-3 rounded-xl hover:bg-stone-100 transition-colors"
                                            title="Instagram"
                                        >
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    )}

                                    <div className="flex items-center gap-2 pl-2 border-l border-stone-100 ml-auto">
                                        <button
                                            onClick={() => { setEditingService(service); setShowServiceModal(true); }}
                                            className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary/20 transition-colors border border-brand-primary/10 flex items-center justify-center font-black uppercase tracking-widest text-[9px]"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(service.id)}
                                            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center font-black uppercase tracking-widest text-[9px]"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {services.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-stone-200 rounded-[40px]">
                            <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Plus className="text-stone-400 w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Nenhum serviço cadastrado</h3>
                            <p className="text-stone-500 mb-8">Comece divulgando seu primeiro serviço para atrair clientes.</p>
                            <button onClick={() => setShowServiceModal(true)} className="btn-secondary">Divulgar Serviço</button>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            {showPetModal && (
                <PetModal
                    userId={user.id}
                    pet={editingPet || undefined}
                    onClose={() => setShowPetModal(false)}
                    onSuccess={() => {
                        setShowPetModal(false);
                        onRefresh();
                    }}
                />
            )}

            {showServiceModal && (
                <AddServiceModal
                    providerId={user.id}
                    service={editingService || undefined}
                    onClose={() => setShowServiceModal(false)}
                    onSuccess={() => {
                        setShowServiceModal(false);
                        onRefresh();
                    }}
                />
            )}

            {selectedPet && (
                <PetDetailsModal
                    pet={selectedPet}
                    onClose={() => setSelectedPet(null)}
                    onViewDocument={(type) => onViewDocument(selectedPet, type)}
                    onEdit={() => {
                        setEditingPet(selectedPet);
                        setSelectedPet(null);
                        setShowPetModal(true);
                    }}
                />
            )}

            <AnimatePresence>
                {expandedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpandedImage(null)}
                        className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-[300] flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            src={expandedImage}
                            className="max-w-full max-h-full rounded-3xl shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setExpandedImage(null)}
                            className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all"
                        >
                            <Plus className="w-8 h-8 rotate-45" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DashboardView;
