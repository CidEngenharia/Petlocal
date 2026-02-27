import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Smartphone, Globe, MessageCircle, MapPin, QrCode } from 'lucide-react';

interface PresentationViewProps {
    setView: (view: any) => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ setView }) => {
    const differentials = [
        { icon: Lock, title: 'Confiabilidade / Privacidade', desc: 'Seus dados e os de seu pet protegidos.' },
        { icon: Shield, title: 'Segurança', desc: 'Identificação única e intransferível.' },
        { icon: Globe, title: 'Plataforma Independente', desc: 'Sem vínculos governamentais ou políticos.' },
        { icon: Smartphone, title: 'Mobilidade', desc: 'Acesse o histórico e documentos em qualquer lugar.' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl mx-auto px-4 py-12 md:py-20"
        >
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
                    Apresentação <span className="text-brand-primary">PetLocal</span>
                </h1>
                <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full" />
            </div>

            <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-bold text-stone-800">O que é o RG Pet?</h2>
                    <p className="text-stone-600 leading-relaxed text-lg">
                        O **RG Pet** é um sistema gratuito de cadastramento de animais de estimação que tem como objetivo identificar seu PET com segurança e confiabilidade através de um número único, intransferível e insubstituível.
                    </p>
                    <p className="text-stone-600 leading-relaxed text-lg">
                        Vincule diversas informações cadastrais do animal e de seu dono, concentrando todo o histórico e atividades principais em um único local.
                    </p>
                </div>
                <div className="bg-brand-bg rounded-[2rem] p-8 shadow-inner border border-stone-100">
                    <img src="/rg_propagandapet.jpg" alt="Exemplo de RG Pet" className="rounded-xl shadow-2xl w-full h-auto object-cover transform rotate-2 hover:rotate-0 transition-transform duration-500" />
                </div>
            </section>

            <section className="bg-stone-50 rounded-[3rem] p-8 md:p-16 mb-24">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl font-serif font-bold text-stone-800">Finalidade do Programa</h2>
                    <p className="text-stone-600 leading-relaxed text-lg">
                        O programa **PetLocal** realiza o registro de seus Pets (cães, gatos, pássaros, etc.) para facilitar a identificação em Petshops e clínicas particulares.
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl text-left">
                        <p className="text-yellow-800 font-medium">
                            <strong>Nota Importante:</strong> Nossos serviços não têm nenhum vínculo nem auxílio Político, Municipal, Estadual nem Federal. Somos uma iniciativa privada focada no bem-estar animal.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="order-2 md:order-1 bg-brand-bg rounded-[2rem] p-8 shadow-inner border border-stone-100">
                    <img src="/certidao_propagandapet.jpg" alt="Exemplo de Certidão Pet" className="rounded-xl shadow-2xl w-full h-auto object-cover transform -rotate-2 hover:rotate-0 transition-transform duration-500" />
                </div>
                <div className="order-1 md:order-2 space-y-6">
                    <h2 className="text-3xl font-serif font-bold text-stone-800">Certidão de Nascimento</h2>
                    <p className="text-stone-600 leading-relaxed text-lg">
                        Gere uma Certidão de Nascimento personalizada para o seu pet, contendo todos os dados essenciais e foto, pronta para impressão em alta qualidade.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex gap-4 items-start">
                            <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary mt-1">
                                <QrCode className="w-5 h-5" />
                            </div>
                            <p className="text-stone-600"><span className="font-bold text-stone-800">Cadastro Simples:</span> Realize o cadastro de seus dados e do seu animal. É muito fácil!</p>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary mt-1">
                                <QrCode className="w-5 h-5" />
                            </div>
                            <p className="text-stone-600"><span className="font-bold text-stone-800">RG com QR Code:</span> Após o cadastro, um número único é atribuído e um RG digital é gerado.</p>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-bold text-stone-800">Localização Inteligente</h2>
                    <p className="text-stone-600 leading-relaxed text-lg">
                        Ao se cadastrar, você também pode solicitar um brasão com **QR CODE**.
                    </p>
                    <p className="text-stone-600 leading-relaxed text-lg font-medium text-brand-primary">
                        Caso seu pet se perca e alguém escanear o QR CODE:
                    </p>
                    <ul className="space-y-4">
                        <li className="flex gap-4 items-start">
                            <div className="bg-green-100 p-2 rounded-lg text-green-600 mt-1">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <p className="text-stone-600"><span className="font-bold text-stone-800">Contato Imediato:</span> Quem o achou consegue entrar em contato pelo seu WhatsApp em tempo real.</p>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <p className="text-stone-600"><span className="font-bold text-stone-800">Rastreamento:</span> Você recebe a localização aproximada do seu pet instantaneamente.</p>
                        </li>
                    </ul>
                </div>
                <div className="bg-brand-bg rounded-[2rem] p-8 shadow-inner border border-stone-100">
                    <img src="/pet_564A.jpg" alt="Localização Inteligente Pet" className="rounded-xl shadow-2xl w-full h-auto object-cover transform rotate-1 hover:rotate-0 transition-transform duration-500" />
                </div>
            </section>

            <section className="mb-24">
                <h2 className="text-3xl font-serif font-bold text-stone-800 text-center mb-12">Diferenciais do RG Pet</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {differentials.map((diff, i) => (
                        <div key={i} className="card p-8 text-center hover:border-brand-primary/30 transition-all group">
                            <div className="bg-brand-bg w-16 h-16 rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                <diff.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold mb-3">{diff.title}</h3>
                            <p className="text-stone-500 text-sm leading-relaxed">{diff.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="text-center bg-brand-primary text-white rounded-[2rem] p-12 md:p-16 shadow-xl">
                <h2 className="text-3xl font-serif font-bold mb-6">Pronto para começar?</h2>
                <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
                    Faça parte deste grupo e garanta a segurança e identificação do seu melhor amigo hoje mesmo.
                </p>
                <button
                    onClick={() => setView('profile')}
                    className="bg-white text-brand-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-stone-100 transition-all shadow-lg hover:scale-105"
                >
                    Cadastrar Meu Pet Agora
                </button>
            </div>
        </motion.div>
    );
};

export default PresentationView;
