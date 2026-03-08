import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Plus, MapPin, MessageCircle, Instagram, FileText, ShieldCheck, Award, Trash2, Camera, Pencil } from 'lucide-react';
import { User, Pet, Service } from '../types';
import AddServiceModal from './Dashboard/AddServiceModal';
import PetModal from './Dashboard/PetModal';
import AccountModal from './Dashboard/AccountModal';

interface ProfileViewProps {
    user: User;
    pets: Pet[];
    services: Service[];
    onRefresh: () => void;
    onViewDocument: (pet: Pet, type: 'RG' | 'BirthCert' | 'Vaccination') => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, pets, services, onRefresh, onViewDocument }) => {
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showPetModal, setShowPetModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [currentUser, setCurrentUser] = useState<User>(user);

    const isOwner = user.role === 'owner';

    const handleDelete = async (id: number, type: 'pet' | 'service') => {
        if (!confirm(`Deseja realmente excluir este ${type === 'pet' ? 'pet' : 'serviço'}?`)) return;
        try {
            const endpoint = type === 'pet' ? `/api/pets/${id}` : `/api/services/${id}`;
            const res = await fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                onRefresh();
            } else {
                const data = await res.json().catch(() => ({}));
                alert(`Erro ao excluir ${type}: ${data.error || 'Rejeitado pelo servidor.'}`);
                console.error(data);
            }
        } catch (err) {
            alert(`Falha na comunicação com o servidor ao excluir ${type}.`);
            console.error(err);
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-4 py-24"
        >
            <div className="card p-12 text-center">
                <div className="flex flex-col items-center mb-12">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 bg-brand-bg rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden ring-1 ring-stone-100">
                            {currentUser.photoUrl ? (
                                <img src={currentUser.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-16 h-16 text-brand-primary" />
                            )}
                        </div>
                        <button
                            onClick={() => setShowAccountModal(true)}
                            className="absolute bottom-1 right-1 bg-brand-primary text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all border-2 border-white"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <h2 className="text-3xl font-serif text-stone-900 mb-1">{currentUser.email.split('@')[0]}</h2>
                    <p className="text-stone-400 text-sm font-medium">{currentUser.email}</p>
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {currentUser.role === 'owner' ? 'Dono de Pet' : 'Prestador'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-stone-50 p-6 rounded-3xl">
                        <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Membro desde</div>
                        <div className="font-medium">Fevereiro, 2024</div>
                    </div>
                    <div className="bg-stone-50 p-6 rounded-3xl">
                        <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Status da Conta</div>
                        <div className="text-brand-primary font-medium">Ativa</div>
                    </div>
                </div>

                <div className="mt-16 text-left">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-serif">{isOwner ? 'Meus Companheiros' : 'Meus Serviços'}</h3>
                        <button
                            onClick={() => {
                                if (isOwner) { setEditingPet(null); setShowPetModal(true); }
                                else { setEditingService(null); setShowServiceModal(true); }
                            }}
                            className="text-brand-primary flex items-center gap-2 text-sm font-bold"
                        >
                            <Plus className="w-4 h-4" /> Adicionar {isOwner ? 'Pet' : 'Serviço'}
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {isOwner ? (
                            pets.map(pet => (
                                <div key={pet.id} className="bg-stone-50 p-6 rounded-3xl flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                                        <img src={pet.photoUrl || `https://picsum.photos/seed/${pet.id}/200`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-lg">{pet.name}</h4>
                                        <p className="text-stone-400 text-xs uppercase tracking-widest">{pet.breed}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onViewDocument(pet, 'RG')} className="p-2 hover:bg-brand-primary/10 rounded-xl transition-colors" title="Ver RG"><FileText className="w-4 h-4 text-stone-400 hover:text-brand-primary" /></button>
                                        <button onClick={() => { setEditingPet(pet); setShowPetModal(true); }} className="p-2 hover:bg-brand-primary/10 rounded-xl transition-colors" title="Editar"><Pencil className="w-4 h-4 text-stone-400 hover:text-brand-primary" /></button>
                                        <button onClick={() => handleDelete(pet.id, 'pet')} className="p-2 hover:bg-red-50 rounded-xl transition-colors" title="Excluir"><Trash2 className="w-4 h-4 text-stone-400 hover:text-red-500" /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            services.map(service => (
                                <div key={service.id} className="bg-stone-50 p-6 rounded-3xl flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                                        <img src={service.photoUrl || `https://picsum.photos/seed/s${service.id}/200`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-lg">{service.name}</h4>
                                            <span className="text-brand-primary font-bold">R${service.price.toFixed(0)}</span>
                                        </div>
                                        <p className="text-stone-400 text-xs flex items-center gap-1 uppercase tracking-widest"><MapPin className="w-3 h-3" /> {service.location}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingService(service); setShowServiceModal(true); }} className="p-2 hover:bg-brand-primary/10 rounded-xl transition-colors" title="Editar"><Pencil className="w-4 h-4 text-stone-400 hover:text-brand-primary" /></button>
                                        <button onClick={() => handleDelete(service.id, 'service')} className="p-2 hover:bg-red-50 rounded-xl transition-colors" title="Excluir"><Trash2 className="w-4 h-4 text-stone-400 hover:text-red-500" /></button>
                                    </div>
                                </div>
                            ))
                        )}

                        {((isOwner && pets.length === 0) || (!isOwner && services.length === 0)) && (
                            <div className="text-center py-12 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                                <p className="text-stone-400 text-sm">Nenhum registro encontrado.</p>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setShowAccountModal(true)}
                    className="btn-secondary w-full mt-12 bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                    Configurações da Conta
                </button>
            </div>

            <AnimatePresence>
                {showAccountModal && (
                    <AccountModal
                        user={currentUser}
                        onClose={() => setShowAccountModal(false)}
                        onSuccess={(updatedUser) => {
                            setCurrentUser(updatedUser);
                            setShowAccountModal(false);
                            onRefresh();
                        }}
                    />
                )}
            </AnimatePresence>

            {showPetModal && (
                <PetModal
                    userId={user.id}
                    pet={editingPet || undefined}
                    onClose={() => setShowPetModal(false)}
                    onSuccess={() => { setShowPetModal(false); onRefresh(); }}
                />
            )}

            {showServiceModal && (
                <AddServiceModal
                    providerId={user.id}
                    service={editingService || undefined}
                    onClose={() => setShowServiceModal(false)}
                    onSuccess={() => { setShowServiceModal(false); onRefresh(); }}
                />
            )}
        </motion.div>
    );
};

export default ProfileView;
