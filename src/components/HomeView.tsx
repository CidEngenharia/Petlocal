import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Calendar, Search, ShieldCheck, PawPrint, CheckCircle, ExternalLink, Printer, Shield, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface HomeViewProps {
    onGetStarted: () => void;
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-stone-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex justify-between items-center text-left hover:text-brand-primary transition-colors"
            >
                <span className="font-bold text-lg md:text-xl text-stone-800">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {isOpen && (
                <div className="pb-6 text-stone-500 leading-relaxed font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    {answer}
                </div>
            )}
        </div>
    );
};

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
            {/* HERO SECTION */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
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
                        {[
                            { label: "Pets Registrados", val: "10k+" },
                            { label: "Profissionais", val: "500+" },
                            { label: "Avaliação Média", val: "4.9/5" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl font-serif font-bold text-brand-primary">{stat.val}</div>
                                <div className="text-xs uppercase tracking-wider text-stone-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl rotate-2">
                        <img src="/hero-dog.png" alt="Happy dog" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-10 -right-5 bg-white p-6 rounded-3xl shadow-lg max-w-xs animate-bounce-slow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-full"><ShieldCheck className="text-green-600 w-5 h-5" /></div>
                            <span className="font-bold text-stone-800">RG Emitido!</span>
                        </div>
                        <p className="text-xs text-stone-500">O documento do Max já está disponível na sua carteira digital.</p>
                    </div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <section className="mb-40">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif mb-4">Nossos Serviços</h2>
                    <p className="text-stone-500">Soluções completas para proprietários e profissionais.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <ServiceFeatureCard icon={<FileText className="w-8 h-8" />} title="Documentação Digital" description="Emissão instantânea de RG e Certidão de Nascimento com QR Code de verificação." />
                    <ServiceFeatureCard icon={<Calendar className="w-8 h-8" />} title="Controle de Vacinas" description="Histórico completo e lembretes inteligentes para nunca perder uma dose." />
                    <ServiceFeatureCard icon={<Search className="w-8 h-8" />} title="Marketplace Pet" description="Encontre adestradores, hotéis e veterinários avaliados pela comunidade." />
                </div>
            </section>

            {/* --- DIGITAL DOCUMENTATION PREMIUM SECTION --- */}
            <section id="documentation" className="scroll-mt-24">
                <div className="bg-gradient-to-br from-[#004010]/95 to-[#004010]/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-16 text-white shadow-2xl overflow-hidden relative mb-24">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl -mr-48 -mt-48" />

                    <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
                        <div className="flex-1">
                            <h2 className="text-5xl md:text-7xl font-serif font-medium mb-4 leading-[0.9]">
                                Seu <span className="text-[#22c55e] italic">Pet</span> não é Registrado?
                            </h2>
                            <span className="bg-[#22c55e] text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-8 inline-block italic">Nós podemos te ajudar</span>
                            <p className="text-2xl text-stone-300 font-bold mb-10 leading-tight">
                                <span className="text-yellow-400 font-black">RG PET e CERTIDÃO</span>
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {[
                                    { icon: Shield, title: "Identidade Pet", desc: "Utilize em banhos e tosas, agilize cadastros no veterinário." },
                                    { icon: PawPrint, title: "Certidão de Nascimento", desc: "Dados profissionais e foto personalizada prontas para impressão." },
                                    { icon: Tag, title: "Tag de Identificação", desc: "Segurança total com QR Code vinculado ao perfil digital." },
                                    { icon: Printer, title: "Carteira de Vacinas", desc: "Histórico completo com layout oficial PetLocal." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                                            <item.icon className="w-6 h-6 text-[#22c55e]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                            <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-6 items-center">
                                <button onClick={onGetStarted} className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-10 py-5 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-xl flex items-center gap-3">
                                    Registrar Agora <ExternalLink className="w-6 h-6" />
                                </button>
                                <div className="text-stone-400 font-bold text-lg flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                    Apenas R$ 29,90
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-[450px] aspect-square rounded-[3rem] overflow-hidden border-[12px] border-white/5 shadow-2xl group">
                            <img src="/pet_docs_mockup.png" alt="PetLocal Documents" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                    </div>
                </div>

                {/* FAQ SECTION */}
                <div className="max-w-4xl mx-auto mb-32 px-4">
                    <div className="text-center mb-16">
                        <span className="text-brand-primary font-black uppercase tracking-widest text-sm mb-4 block">Dúvidas Comuns</span>
                        <h2 className="text-4xl md:text-5xl font-serif">Perguntas Frequentes</h2>
                    </div>
                    <div className="divide-y divide-stone-200 border-y border-stone-200">
                        <FAQItem
                            question="Como os documentos do meu pet são enviados?"
                            answer="Ao finalizar o registro do seu pet você será redirecionado à área 'Meus Pets' no seu Dashboard, onde poderá visualizar e imprimir os documentos instantaneamente."
                        />
                        <FAQItem
                            question="Posso imprimir em casa?"
                            answer="Sim! Os documentos são emitidos em formato A4 real, prontos para impressão em qualquer impressora doméstica ou gráfica rápida."
                        />
                        <FAQItem
                            question="Como funciona a Tag de Identificação?"
                            answer="É um QR Code exclusivo vinculado ao perfil digital do seu pet. Se ele se perder, quem encontrar pode escanear e ver seus contatos de segurança imediatamente."
                        />
                        <FAQItem
                            question="Qual o custo total?"
                            answer="O registro completo com todos os 4 documentos digitais custa apenas R$ 29,90 em pagamento único via Stripe."
                        />
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default HomeView;
