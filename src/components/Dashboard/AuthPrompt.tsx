import React from 'react';
import { motion } from 'motion/react';
import { Lock, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

interface AuthPromptProps {
    setView: (view: any) => void;
}

const AuthPrompt: React.FC<AuthPromptProps> = ({ setView }) => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 relative overflow-hidden bg-brand-bg/30">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col md:flex-row relative z-10"
            >
                <div className="md:w-1/3 bg-brand-primary p-12 flex flex-col items-center justify-center text-white">
                    <motion.div
                        initial={{ rotate: -20, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center mb-6"
                    >
                        <Lock className="w-10 h-10" />
                    </motion.div>
                    <div className="flex gap-2 text-white/50">
                        <div className="w-2 h-2 rounded-full bg-white/40" />
                        <div className="w-2 h-2 rounded-full bg-white/40" />
                        <div className="w-2 h-2 rounded-full bg-white/100" />
                    </div>
                </div>

                <div className="md:w-2/3 p-10 md:p-12 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-primary font-bold text-sm uppercase tracking-widest bg-brand-primary/5 w-fit px-4 py-1 rounded-full">
                            <ShieldAlert className="w-4 h-4" />
                            Acesso Restrito
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900 leading-tight">
                            Você está offline ou não está cadastrado.
                        </h2>
                        <p className="text-stone-500 text-lg leading-relaxed">
                            Para ter acesso aos dados digitais de seus Pets, é necessário que você esteja logado no nosso Sistema.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => setView('profile')}
                            className="w-full bg-brand-primary text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-stone-900 transition-all shadow-lg hover:shadow-brand-primary/20 flex items-center justify-center gap-3 group"
                        >
                            <UserCheck className="w-5 h-5" />
                            Entrar na Minha Conta
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-center text-sm text-stone-400">
                            Ainda não tem conta? Clique acima para se cadastrar rapidamente.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPrompt;
