import React from 'react';
import { PawPrint, Menu, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
    user: User | null;
    currentView: string;
    setView: (view: any) => void;
    onOpenSidebar: () => void;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, currentView, setView, onOpenSidebar, onLogout }) => {
    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-bottom border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onOpenSidebar}
                            className="p-2 text-stone-500 hover:text-brand-primary transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setView('home')}
                        >
                            <div className="bg-brand-primary p-2 rounded-xl">
                                <PawPrint className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-brand-primary">PetLocal</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => setView('home')} className={`text-sm font-medium ${currentView === 'home' ? 'text-brand-primary' : 'text-stone-500'}`}>Início</button>
                        <button onClick={() => setView('marketplace')} className={`text-sm font-medium ${currentView === 'marketplace' ? 'text-brand-primary' : 'text-stone-500'}`}>Serviços</button>
                        {user && (
                            <button onClick={() => setView('dashboard')} className={`text-sm font-medium ${currentView === 'dashboard' ? 'text-brand-primary' : 'text-stone-500'}`}>Meus Pets</button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setView('profile')}
                                    className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-brand-primary transition-colors"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <span className="hidden sm:inline">{user.email}</span>
                                </button>
                                <button onClick={onLogout} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setView('profile')}
                                className="btn-primary"
                            >
                                Entrar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
