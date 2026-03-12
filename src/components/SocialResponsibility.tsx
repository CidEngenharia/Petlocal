import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Users, TreePine, Award, ArrowRight } from 'lucide-react';

const SocialResponsibility: React.FC = () => {
    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1.5 bg-[#004010]/10 text-[#004010] rounded-full text-sm font-medium mb-6 tracking-wide">
                        NOSSO PROPÓSITO
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-8 tracking-tight">
                        Transformando o mundo,<br />
                        <span className="text-[#004010]">um pet de cada vez.</span>
                    </h1>
                    <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                        Acreditamos que a tecnologia deve servir a uma causa maior. Na PetLocal, nossa missão vai além da identificação: lutamos pela dignidade animal, preservação ambiental e consciência comunitária.
                    </p>
                </motion.div>
            </section>

            {/* Core Values / Stats */}
            <section className="max-w-7xl mx-auto px-4 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Heart, label: "Vidas Salvas", value: "2.500+", desc: "Pets reencontrados através da nossa tecnologia de rastreio e QR Code." },
                        { icon: TreePine, label: "Impacto Verde", value: "100%", desc: "Utilizamos materiais biodegradáveis em nossas tags e reduzimos o desperdício de papel." },
                        { icon: Users, label: "Apoio a ONGs", value: "15+", desc: "Parcerias ativas com abrigos locais, facilitando o processo de adoção responsável." }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-10 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 text-center hover:shadow-2xl hover:shadow-[#004010]/5 transition-all"
                        >
                            <div className="w-16 h-16 bg-[#004010]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <stat.icon className="w-8 h-8 text-[#004010]" />
                            </div>
                            <h3 className="text-4xl font-bold text-stone-900 mb-2">{stat.value}</h3>
                            <p className="text-[#004010] font-semibold mb-4 uppercase tracking-widest text-xs">{stat.label}</p>
                            <p className="text-stone-500 text-sm leading-relaxed">{stat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Detailed Initiatives */}
            <section className="bg-white py-32 border-y border-stone-100 mb-32">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-20 items-center">
                        <div className="flex-1">
                            <h2 className="text-4xl font-bold text-stone-900 mb-8 tracking-tight">Nossos Compromissos</h2>
                            <div className="space-y-10">
                                {[
                                    { title: "Sustentabilidade em Primeiro Lugar", text: "Nossas tags são produzidas com polímeros reciclados e processos de baixo impacto de carbono. Menos plástico, mais vida.", icon: TreePine },
                                    { title: "Segurança de Dados Ética", text: "Privacidade é um direito. Seus dados e os do seu pet são protegidos com criptografia de ponta a ponta, sem venda de informações para terceiros.", icon: ShieldCheck },
                                    { title: "Educação em Empatia", text: "Promovemos campanhas de conscientização sobre abandono e maus-tratos, educando a próxima geração de tutores.", icon: Award }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#004010] rounded-full flex items-center justify-center">
                                            <item.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-stone-900 mb-2">{item.title}</h4>
                                            <p className="text-stone-600 leading-relaxed">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#004010]/20 to-transparent rounded-[4rem] -rotate-3"></div>
                            <img
                                src="/qr_code_info.jpg"
                                alt="QR Code de identificação pet"
                                className="relative rounded-[4rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* NGO Partnership CTA */}
            <section className="max-w-5xl mx-auto px-4">
                <div className="bg-[#004010] rounded-[3rem] p-12 md:p-20 text-center text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                    
                    <h2 className="text-4xl font-bold mb-6 relative z-10">É líder de uma ONG ou Abrigo?</h2>
                    <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto relative z-10">
                        Oferecemos acesso gratuito às nossas ferramentas de gestão e identificação para organizações sem fins lucrativos que cuidam de animais. Vamos somar forças?
                    </p>
                    <a
                        href="https://wa.me/5571984184782"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-[#004010] px-10 py-5 rounded-full font-bold hover:bg-stone-100 hover:scale-105 transition-all shadow-xl relative z-10"
                    >
                        Solicitar Parceria Gratuita
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default SocialResponsibility;
