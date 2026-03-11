import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    PawPrint,
    FileText,
    ShieldCheck,
    ShoppingBag,
    Users,
    Stethoscope,
    Dog,
    Navigation,
    Search,
    Heart,
    X
} from 'lucide-react';

import { User as UserType } from '../types';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    setView: (view: any) => void;
    currentView: string;
    user: UserType | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, setView, currentView, user }) => {
    const menuItems = [
        { id: 'presentation', label: 'Apresentação', icon: FileText },
        ...(user?.role === 'global_admin' ? [{ id: 'admin', label: 'Painel Admin', icon: ShieldCheck }] : []),
        { id: 'dashboard', label: 'Documentação Digital', icon: FileText },
        { id: 'marketplace', label: 'Mercado Pet', icon: ShoppingBag },
        { id: 'donations', label: 'Doação e Adoção', icon: Heart },
        { id: 'lost-found', label: 'Achados e Perdidos', icon: Search },
        { id: 'tracker', label: 'Rastreador', icon: Navigation },
        { id: 'top10', label: 'Top 10 Pets', icon: ShieldCheck },
        { id: 'dogmix', label: 'DogMix IA', icon: Dog },
        { id: 'profile', label: 'Meu Perfil', icon: Users },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 w-72 bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); onClose(); }}>
                                <img src="/Petlocal_logo.png" alt="PetLocal" className="h-12 w-auto object-contain" />
                            </div>
                            <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-4">
                            <div className="space-y-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setView(item.id as any);
                                            onClose();
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentView === item.id
                                            ? 'bg-brand-primary/10 text-brand-primary'
                                            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-brand-primary' : 'text-stone-400'}`} />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-stone-100">
                            <p className="text-xs text-stone-400 text-center">© 2024 PetLocal - Todos os direitos reservados</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
