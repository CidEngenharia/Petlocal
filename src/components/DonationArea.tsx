import React from 'react';
import { motion } from 'motion/react';
import { Heart, PawPrint, MessageCircle } from 'lucide-react';

const DonationArea: React.FC = () => {
    const donationItems = [
        { id: 1, title: 'Ração para Abrigo Esperança', goal: 500, current: 320, description: 'Ajude-nos a comprar 50kg de ração para os cães do abrigo.' },
        { id: 2, title: 'Cirurgia do Gatinho Fred', goal: 1200, current: 850, description: 'O Fred precisa de uma cirurgia urgente na pata.' },
        { id: 3, title: 'Vacinas para Filhotes', goal: 300, current: 150, description: 'Ajuda para vacinar 10 filhotes recém-resgatados.' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <div className="text-center mb-16">
                <Heart className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-4xl font-serif mb-4">Área de Doações</h2>
                <p className="text-stone-500 max-w-2xl mx-auto">
                    Sua pequena ajuda faz uma grande diferença na vida de muitos animais.
                    Contribua para causas verificadas e acompanhe o progresso.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {donationItems.map(item => (
                    <div key={item.id} className="card p-8 hover:border-red-200 transition-all group">
                        <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                        <p className="text-stone-500 text-sm mb-6 h-12 overflow-hidden">{item.description}</p>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                <span className="text-stone-400">Progresso</span>
                                <span className="text-red-500">{Math.round((item.current / item.goal) * 100)}%</span>
                            </div>
                            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.current / item.goal) * 100}%` }}
                                    className="bg-red-500 h-full"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-stone-400">
                                <span>R$ {item.current}</span>
                                <span>Alvo: R$ {item.goal}</span>
                            </div>
                        </div>

                        <button className="btn-primary w-full bg-red-500 hover:bg-red-600 border-red-500">Doar Agora</button>
                    </div>
                ))}
            </div>

            <div className="mt-24 bg-brand-bg rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <h3 className="text-3xl font-serif mb-4">É uma ONG ou Protetor?</h3>
                    <p className="text-stone-600 mb-8">
                        Cadastre sua causa em nossa plataforma e receba doações da nossa comunidade.
                        Todas as causas passam por um processo de verificação.
                    </p>
                    <button className="btn-secondary flex items-center gap-2">
                        <PawPrint className="w-5 h-5" /> Cadastrar Causa
                    </button>
                </div>
                <div className="w-full md:w-1/3 aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3">
                    <img src="https://picsum.photos/seed/donation/600/600" className="w-full h-full object-cover" />
                </div>
            </div>
        </motion.div>
    );
};

export default DonationArea;
