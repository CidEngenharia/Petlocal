import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Map, MapPin, Navigation, Tag, ShieldCheck, Search } from 'lucide-react';
import { User, Pet } from '../types';
import PetMap from './PetMap';

interface TrackerViewProps {
    user: User | null;
    setView: (view: any) => void;
}

const TrackerView: React.FC<TrackerViewProps> = ({ user, setView }) => {
    const [pets, setPets] = useState<Pet[]>([]);

    useEffect(() => {
        const fetchAllPublicPets = async () => {
            try {
                const res = await fetch('/api/public/pets');
                const data = await res.json();
                setPets(data);
            } catch (err) {
                console.error('Error fetching pets for tracker:', err);
            }
        };
        fetchAllPublicPets();
    }, []);

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
                            <h4 className="text-xl font-black mb-2">Já adquiriu o Brasão QRcode do seu Pet?</h4>
                            <p className="text-white/80 mb-6 font-medium">Faça login para vincular ou adquirir o brasão QRcode, ativar o rastreamento e proteger o seu amiguinho.</p>
                            <button
                                onClick={() => setView('profile')}
                                className="bg-white text-brand-primary px-8 py-4 rounded-2xl font-black w-full hover:bg-stone-50 transition-colors"
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
                                <button
                                    onClick={() => setView('dashboard')}
                                    className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-colors"
                                >
                                    Abrir Painel de Controle
                                </button>
                                <button className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-black flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10 transition-colors">
                                    <Search className="w-5 h-5" /> Localizar Meus Pets
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl border-8 border-white/10 bg-stone-100">
                    <PetMap pets={pets} />
                    <div className="absolute inset-x-8 bottom-8 pointer-events-none">
                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                <MapPin className="text-brand-primary w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white text-xs font-black uppercase tracking-widest">Rastreio Ativo</p>
                                <p className="text-white text-lg font-bold">{pets.length} Animais Localizados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW EXPLANATORY SECTION WITH IMAGE */}
            <div className="bg-stone-50 rounded-[3rem] p-8 md:p-16 border border-stone-200">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-3xl font-black mb-6 text-stone-900">Segurança em Tempo Real</h3>
                        <p className="text-stone-600 text-lg leading-relaxed mb-8">
                            Nossa tecnologia de <strong>Localização Inteligente</strong> permite que qualquer pessoa que encontre seu pet acesse instantaneamente seus dados de segurança.
                        </p>
                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900 mb-1">Proteção Garantida</h4>
                                    <p className="text-stone-500">Dados criptografados e acesso restrito para sua total privacidade.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900 mb-1">Rastreamento por WhatsApp</h4>
                                    <p className="text-stone-500">Envio de localização em tempo real.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-brand-primary/5 rounded-[3rem] blur-2xl group-hover:bg-brand-primary/10 transition-colors" />
                        <img
                            src="/rastreapet_5.jpg"
                            alt="Demonstração de Rastreamento"
                            className="relative w-full h-auto rounded-[3rem] shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TrackerView;
