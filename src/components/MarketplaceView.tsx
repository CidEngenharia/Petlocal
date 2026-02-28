import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Award, Home as HomeIcon, Stethoscope, MapPin, MessageCircle, Instagram, Plus, User as UserIcon, Pencil, Trash2 } from 'lucide-react';
import { Service, User } from '../types';
import AddServiceModal from './Dashboard/AddServiceModal';

interface MarketplaceViewProps {
    services: Service[];
    user: User | null;
    onRefresh: () => void;
}

const FilterButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-300'}`}
    >
        {icon}
        {label}
    </button>
);

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ services, user, onRefresh }) => {
    const [filter, setFilter] = useState<'all' | 'trainer' | 'hotel' | 'vet' | 'petsitter'>('all');
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const handleDeleteService = async (serviceId: number) => {
        if (!confirm('Deseja realmente excluir este serviço?')) return;
        try {
            const res = await fetch(`/api/services/${serviceId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) onRefresh();
            else alert('Erro ao excluir serviço.');
        } catch (err) {
            console.error('Error deleting service:', err);
            alert('Erro ao excluir serviço.');
        }
    };

    const filtered = filter === 'all' ? services : services.filter(s => s.type === filter);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-serif mb-2">Marketplace Pet</h2>
                    <p className="text-stone-500">Encontre os melhores profissionais para o seu pet.</p>
                </div>

                {user?.role === 'provider' && (
                    <button
                        onClick={() => { setEditingService(null); setShowServiceModal(true); }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Divulgar Serviço
                    </button>
                )}
            </div>

            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} icon={<Search className="w-4 h-4" />} label="Todos" />
                <FilterButton active={filter === 'trainer'} onClick={() => setFilter('trainer')} icon={<Award className="w-4 h-4" />} label="Adestradores" />
                <FilterButton active={filter === 'petsitter'} onClick={() => setFilter('petsitter')} icon={<Award className="w-4 h-4" />} label="PetSitter" />
                <FilterButton active={filter === 'hotel'} onClick={() => setFilter('hotel')} icon={<HomeIcon className="w-4 h-4" />} label="Hotéis" />
                <FilterButton active={filter === 'vet'} onClick={() => setFilter('vet')} icon={<Stethoscope className="w-4 h-4" />} label="Veterinários" />
            </div>

            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 mb-12 text-center">
                <p className="text-stone-500 text-xs font-medium leading-relaxed max-w-4xl mx-auto">
                    Não nos responsabilizamos pelos serviços cadastrados na plataforma prestados pelos prestadores de serviços.
                    A plataforma tem apenas o intuito de realizar a ponte entre os clientes e os prestadores de serviços.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {filtered.map(service => (
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
                                {(service as any).provider?.photoUrl ? (
                                    <img src={(service as any).provider.photoUrl} alt="Provider" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-4 h-4 text-brand-primary" />
                                )}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-stone-900 line-clamp-1">{service.name}</h3>
                                <span className="text-brand-primary font-bold text-sm">R${service.price.toFixed(0)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                                <MapPin className="w-3 h-3" />
                                {service.location}
                            </div>
                            <p className="text-stone-500 text-[11px] mb-5 line-clamp-2 leading-relaxed">{service.description}</p>

                            <div className="flex items-center gap-3">
                                {service.whatsapp && (
                                    <a
                                        href={`https://wa.me/${service.whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-50 text-green-600 p-2.5 rounded-xl hover:bg-green-100 transition-colors"
                                        title="Chamar no WhatsApp"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </a>
                                )}
                                {service.instagram && (
                                    <a
                                        href={`https://instagram.com/${service.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-stone-50 text-stone-600 p-2.5 rounded-xl hover:bg-stone-100 transition-colors"
                                        title="Ver Instagram"
                                    >
                                        <Instagram className="w-4 h-4" />
                                    </a>
                                )}

                                {user?.id === service.providerId ? (
                                    <div className="flex gap-2 ml-auto">
                                        <button
                                            onClick={() => { setEditingService(service); setShowServiceModal(true); }}
                                            className="bg-brand-primary/10 text-brand-primary p-2.5 rounded-xl hover:bg-brand-primary/20 transition-colors border border-brand-primary/10 flex items-center justify-center"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(service.id)}
                                            className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    service.whatsapp && (
                                        <a
                                            href={`https://wa.me/${service.whatsapp.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-brand-primary/10 text-brand-primary p-2.5 rounded-xl hover:bg-brand-primary/20 transition-colors ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4"
                                            title="Contratar via WhatsApp"
                                        >
                                            Contratar
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-24 text-center">
                        <p className="text-stone-400">Nenhum serviço encontrado nesta categoria.</p>
                    </div>
                )}
            </div>

            {showServiceModal && user && (
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
        </motion.div>
    );
};

export default MarketplaceView;
