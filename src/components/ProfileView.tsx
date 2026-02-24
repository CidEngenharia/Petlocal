import React from 'react';
import { motion } from 'motion/react';
import { User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface ProfileViewProps {
    user: User;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto px-4 py-24"
        >
            <div className="card p-12 text-center">
                <div className="w-32 h-32 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-8 text-brand-primary">
                    <UserIcon className="w-16 h-16" />
                </div>
                <h2 className="text-4xl font-serif mb-2">{user.email}</h2>
                <p className="text-stone-400 mb-12 uppercase tracking-widest text-xs font-bold">
                    {user.role === 'owner' ? 'Dono de Pet' : 'Prestador de Serviços'}
                </p>

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

                <button className="btn-secondary w-full mt-8">Editar Perfil</button>
            </div>
        </motion.div>
    );
};

export default ProfileView;
