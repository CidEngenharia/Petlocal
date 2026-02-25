import React from 'react';
import { motion } from 'motion/react';
import { Map, MapPin, Navigation, Tag, ShieldCheck, Search } from 'lucide-react';
import { User } from '../types';

interface TrackerViewProps {
    user: User | null;
}

const TrackerView: React.FC<TrackerViewProps> = ({ user }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <div className="text-center mb-16">
                <div className="inline-flex p-4 bg-blue-50 rounded-3xl mb-6">
                    <Navigation className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-4xl font-black mb-4">Rastreador Pet</h2>
                <p className="text-stone-500 max-w-2xl mx-auto font-medium">
                    Segurança total para o seu melhor amigo através da nossa tecnologia de ponta.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
                        <h3 className="text-2xl font-black mb-4 text-stone-900">Como funciona?</h3>
                        <p className="text-stone-500 leading-relaxed mb-6 font-medium">
                            Nossa plataforma comercializa as exclusivas <strong>Tags NFC</strong> e <strong>Tags QRCOD</strong> personalizadas para Pets.
                            Com elas, você pode facilitar a localização do seu animal e permitir que quem o encontre acesse seus dados de contato instantaneamente e envie uma mensagem diretamente para o whatsApp cadastrado no nosso sistema.
                            Uma forma fácil, barata de proteger seu amigo e que funciona.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-2 text-blue-600 font-bold uppercase text-[10px] tracking-widest">
                                    <Tag className="w-4 h-4" />
                                    Tag NFC
                                </div>
                                <p className="text-xs text-blue-900/60 font-medium">Identificação digital rápida com apenas um toque no celular.</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <div className="flex items-center gap-3 mb-2 text-amber-600 font-bold uppercase text-[10px] tracking-widest">
                                    <Search className="w-4 h-4" />
                                    Tag QRCOD
                                </div>
                                <p className="text-xs text-amber-900/60 font-medium">Acesso instantâneo aos dados do pet através da leitura do código.</p>
                            </div>
                        </div>
                    </div>

                    {!user ? (
                        <div className="bg-brand-primary p-8 rounded-[40px] text-white shadow-xl shadow-brand-primary/20">
                            <h4 className="text-xl font-black mb-2">Já possui uma Tag?</h4>
                            <p className="text-white/80 mb-6 font-medium">Faça login para vincular o hardware ao seu pet e ativar o rastreamento em tempo real.</p>
                            <button
                                onClick={() => window.location.href = '#profile'}
                                className="bg-white text-brand-primary px-8 py-4 rounded-2xl font-black w-full"
                            >
                                Entrar no Painel de Controle
                            </button>
                        </div>
                    ) : (
                        <div className="bg-stone-900 p-8 rounded-[40px] text-white shadow-xl">
                            <h4 className="text-xl font-black mb-4">Painel de Rastreamento</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-sm font-medium">Status do Sistema</span>
                                    <span className="text-xs bg-green-500 px-2 py-1 rounded-full text-white font-black uppercase tracking-widest">Ativo</span>
                                </div>
                                <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-2">
                                    <Search className="w-5 h-5" /> Localizar Meus Pets
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl border-8 border-white/10 bg-stone-100">
                    <img
                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                <MapPin className="text-brand-primary w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white text-xs font-black uppercase tracking-widest">Cristal está em</p>
                                <p className="text-white text-lg font-bold">Bairro Costa Azul, Salvador</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TrackerView;
