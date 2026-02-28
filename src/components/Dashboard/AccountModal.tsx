import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Loader2, Save } from 'lucide-react';
import { User } from '../../types';

interface AccountModalProps {
    user: User;
    onClose: () => void;
    onSuccess: (updatedUser: User) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ user, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '');

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            alert('A imagem deve ter no máximo 1MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId: user.id, photoUrl })
            });

            if (res.ok) {
                const data = await res.json();
                const updatedUser = { ...user, photoUrl: data.user.photoUrl };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                onSuccess(updatedUser);
            } else {
                alert('Erro ao atualizar perfil.');
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao atualizar perfil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-serif">Configurações da Conta</h2>
                            <p className="text-stone-400 text-sm">Personalize seu perfil no PetLocal</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-stone-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-stone-100 border-4 border-white shadow-xl">
                                    {photoUrl ? (
                                        <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                            <Camera className="w-10 h-10" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-1 right-1 bg-brand-primary text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all group-hover:bg-brand-primary/90">
                                    <Camera className="w-4 h-4" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                </label>
                            </div>
                            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Máximo 1MB</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2 px-1">E-mail</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-400 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <><Save className="w-5 h-5" /> Salvar Alterações</>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AccountModal;
