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
    Heart,
    X
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    setView: (view: any) => void;
    currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, setView, currentView }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Documentação Digital', icon: FileText },
        { id: 'marketplace', label: 'Marketplace PET', icon: ShoppingBag },
        { id: 'shop', label: 'Pets à Venda', icon: Dog },
        { id: 'donations', label: 'Doações', icon: Heart },
        { id: 'top10', label: 'Top 10 Pets', icon: ShieldCheck },
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
                            <div className="flex items-center gap-2">
                                <div className="bg-brand-primary p-1.5 rounded-lg">
                                    <PawPrint className="text-white w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-brand-primary">PetLocal</span>
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
