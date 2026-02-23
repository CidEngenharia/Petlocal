import React from 'react';
import { motion } from 'motion/react';
import { FileText, Calendar, Search, ShieldCheck } from 'lucide-react';

interface HomeViewProps {
    onGetStarted: () => void;
}

const ServiceFeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="card p-8 hover:border-brand-primary/30 transition-all group">
        <div className="bg-brand-bg w-16 h-16 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
    </div>
);

const HomeView: React.FC<HomeViewProps> = ({ onGetStarted }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 py-16 lg:py-24"
        >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h1 className="text-6xl lg:text-8xl font-serif font-medium leading-[0.9] tracking-tight text-stone-900 mb-8">
                        Tudo que seu <span className="italic text-brand-primary">pet</span> precisa em um só lugar.
                    </h1>
                    <p className="text-xl text-stone-600 mb-10 max-w-lg">
                        RG Online, Certidão de Nascimento, controle de vacinas e os melhores profissionais para cuidar do seu companheiro.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={onGetStarted} className="btn-primary text-lg px-10 py-4">Começar Agora</button>
                        <button className="btn-secondary text-lg px-10 py-4">Ver Serviços</button>
                    </div>

                    <div className="mt-16 grid grid-cols-3 gap-8 border-t border-stone-200 pt-8">
                        <div>
                            <div className="text-3xl font-serif font-bold text-brand-primary">10k+</div>
                            <div className="text-xs uppercase tracking-wider text-stone-400">Pets Registrados</div>
                        </div>
                        <div>
                            <div className="text-3xl font-serif font-bold text-brand-primary">500+</div>
                            <div className="text-xs uppercase tracking-wider text-stone-400">Profissionais</div>
                        </div>
                        <div>
                            <div className="text-3xl font-serif font-bold text-brand-primary">4.9/5</div>
                            <div className="text-xs uppercase tracking-wider text-stone-400">Avaliação Média</div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl rotate-2">
                        <img
                            src="https://picsum.photos/seed/pet1/800/1000"
                            alt="Happy dog"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-64 aspect-square rounded-[32px] overflow-hidden shadow-xl -rotate-6 border-8 border-white">
                        <img
                            src="https://picsum.photos/seed/pet2/400/400"
                            alt="Happy cat"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <div className="absolute top-10 -right-5 bg-white p-6 rounded-3xl shadow-lg max-w-xs animate-bounce-slow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-full">
                                <ShieldCheck className="text-green-600 w-5 h-5" />
                            </div>
                            <span className="font-bold text-stone-800">RG Emitido!</span>
                        </div>
                        <p className="text-xs text-stone-500">O documento do Max já está disponível na sua carteira digital.</p>
                    </div>
                </div>
            </div>

            <section className="mt-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif mb-4">Nossos Serviços</h2>
                    <p className="text-stone-500">Soluções completas para proprietários e profissionais.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <ServiceFeatureCard
                        icon={<FileText className="w-8 h-8" />}
                        title="Documentação Digital"
                        description="Emissão instantânea de RG e Certidão de Nascimento com QR Code de verificação."
                    />
                    <ServiceFeatureCard
                        icon={<Calendar className="w-8 h-8" />}
                        title="Controle de Vacinas"
                        description="Histórico completo e lembretes inteligentes para nunca perder uma dose."
                    />
                    <ServiceFeatureCard
                        icon={<Search className="w-8 h-8" />}
                        title="Marketplace Pet"
                        description="Encontre adestradores, hotéis e veterinários avaliados pela comunidade."
                    />
                </div>
            </section>
        </motion.div>
    );
};

export default HomeView;
