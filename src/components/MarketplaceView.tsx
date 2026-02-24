import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Award, Home as HomeIcon, Stethoscope, MapPin, MessageCircle, Instagram, Plus } from 'lucide-react';
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
    const [showAddService, setShowAddService] = useState(false);

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
                        onClick={() => setShowAddService(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Divulgar Serviço
                    </button>
                )}
            </div>

            <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
                <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} icon={<Search className="w-4 h-4" />} label="Todos" />
                <FilterButton active={filter === 'trainer'} onClick={() => setFilter('trainer')} icon={<Award className="w-4 h-4" />} label="Adestradores" />
                <FilterButton active={filter === 'petsitter'} onClick={() => setFilter('petsitter')} icon={<Award className="w-4 h-4" />} label="PetSitter" />
                <FilterButton active={filter === 'hotel'} onClick={() => setFilter('hotel')} icon={<HomeIcon className="w-4 h-4" />} label="Hotéis" />
                <FilterButton active={filter === 'vet'} onClick={() => setFilter('vet')} icon={<Stethoscope className="w-4 h-4" />} label="Veterinários" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                            <div className="flex gap-2 mb-4">
                                {service.whatsapp && (
                                    <a
                                        href={`https://wa.me/${service.whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-green-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-green-600 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" /> WhatsApp
                                    </a>
                                )}
                                {service.instagram && (
                                    <a
                                        href={`https://instagram.com/${service.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-stone-100 text-stone-600 p-2 rounded-xl hover:bg-stone-200 transition-colors"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                            </div>

                            <button className="btn-primary w-full py-2 text-sm">Contratar Serviço</button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-24 text-center">
                        <p className="text-stone-400">Nenhum serviço encontrado nesta categoria.</p>
                    </div>
                )}
            </div>

            {showAddService && user && (
                <AddServiceModal
                    providerId={user.id}
                    onClose={() => setShowAddService(false)}
                    onSuccess={() => {
                        setShowAddService(false);
                        onRefresh();
                    }}
                />
            )}
        </motion.div>
    );
};

export default MarketplaceView;
