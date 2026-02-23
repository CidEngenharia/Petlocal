import React, { useState } from 'react';
import { motion } from 'motion/react';

interface AuthViewProps {
    onLogin: (email: string, password: string, role: 'owner' | 'provider', isRegister: boolean) => void;
    loading: boolean;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'owner' | 'provider'>('owner');
    const [isRegister, setIsRegister] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto px-4 py-24"
        >
            <div className="card p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif mb-2">{isRegister ? 'Criar Conta' : 'Bem-vindo de volta'}</h2>
                    <p className="text-stone-500 text-sm">
                        {isRegister ? 'Cadastre-se para gerenciar seus pets.' : 'Entre para gerenciar seus pets ou serviços.'}
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Tipo de Conta</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setRole('owner')}
                                className={`py-3 rounded-xl text-sm font-medium border transition-all ${role === 'owner' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-stone-500 border-stone-200'}`}
                            >
                                Dono de Pet
                            </button>
                            <button
                                onClick={() => setRole('provider')}
                                className={`py-3 rounded-xl text-sm font-medium border transition-all ${role === 'provider' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-stone-500 border-stone-200'}`}
                            >
                                Prestador
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">E-mail</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Senha</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => onLogin(email, password, role, isRegister)}
                        disabled={!email || !password || loading}
                        className="btn-primary w-full py-4"
                    >
                        {loading ? 'Processando...' : (isRegister ? 'Cadastrar' : 'Entrar')}
                    </button>

                    <div className="text-center">
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-sm text-stone-500 hover:text-brand-primary transition-colors"
                        >
                            {isRegister ? 'Já tenho conta? Entrar' : 'Não tem conta? Cadastrar'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AuthView;
