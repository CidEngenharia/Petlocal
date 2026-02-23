import React, { useState } from 'react';
import { PawPrint, Plus, CheckCircle, ChevronDown, ChevronUp, ExternalLink, Printer, Shield, Tag } from 'lucide-react';
import { Pet } from '../../types';

interface DocumentViewerProps {
    pet: Pet;
    type: 'RG' | 'BirthCert';
    onClose: () => void;
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex justify-between items-center text-left hover:text-indigo-400 transition-colors"
            >
                <span className="font-bold text-lg">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {isOpen && (
                <div className="pb-4 text-stone-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {answer}
                </div>
            )}
        </div>
    );
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ pet, type, onClose }) => {
    return (
        <div className="fixed inset-0 bg-stone-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-5xl w-full my-8">
                <div className="flex justify-end mb-4 sticky top-0 z-[210]">
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all backdrop-blur-md border border-white/20">
                        <Plus className="w-8 h-8 rotate-45" />
                    </button>
                </div>

                {/* --- MARKETING HEADER --- */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full -ml-32 -mb-32 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <span className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">Nós podemos te ajudar</span>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Seu Pet não é Registrado?
                            </h1>
                            <p className="text-xl text-indigo-100 font-bold mb-8">
                                RG Pet e Certidão <span className="text-yellow-400 underline underline-offset-4 decoration-2">INCLUSOS NO REGISTRO</span>
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl flex items-center gap-2">
                                    Registrar Agora <ExternalLink className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2 text-white/80 font-bold">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                    Apenas R$ 29,90
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-[350px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 group">
                            <img
                                src="/pet_docs_mockup.png"
                                alt="Documentos PetLocal"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>

                {/* --- BENEFITS BENTO GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { icon: Shield, title: "Identidade Pet", items: ["Utilize em banhos e tosas", "Agilize cadastros em veterinários", "Guarde os dados do seu pet"] },
                        { icon: PawPrint, title: "Certidão de Nascimento", items: ["Dados sobre o nascimento", "Foto e QR Code", "Registro oficial PetLocal"] },
                        { icon: Tag, title: "Tag de Identificação", items: ["QR Code para perfil do pet", "Seu pet sempre identificado", "Segurança em imprevistos"] },
                        { icon: Printer, title: "Carteirinha de Vacinação", items: ["Controle de vacinas", "Personalizada com foto", "Tamanho A4 dobrável"] }
                    ].map((benefit, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
                            <div className="bg-indigo-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <benefit.icon className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-white text-xl font-black mb-4">{benefit.title}</h3>
                            <ul className="space-y-2">
                                {benefit.items.map((item, j) => (
                                    <li key={j} className="text-stone-400 text-sm flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* --- DOCUMENT PREVIEW --- */}
                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 mb-12 flex flex-col items-center">
                    <h2 className="text-3xl font-black text-white mb-12 flex items-center gap-3">
                        <PawPrint className="w-8 h-8 text-indigo-400" />
                        Visualização de Exemplo
                    </h2>

                    <div className="flex flex-col items-center gap-12">
                        {type === 'RG' ? (
                            <div className="flex flex-col gap-12 items-center scale-90 md:scale-100 origin-center">
                                {/* RG FRENTE */}
                                <div className="w-[500px] h-[320px] bg-[#e0e7e1] rounded-lg border-[12px] border-[#1a4d2e] p-0 relative shadow-2xl overflow-hidden font-sans">
                                    <div className="bg-[#1a4d2e] text-white text-center py-1 text-[10px] font-bold tracking-widest uppercase">
                                        Carteira de Identificação Animal - PetLocal
                                    </div>
                                    <div className="p-4 flex flex-col h-full">
                                        <div className="flex justify-center items-center gap-2 mb-2">
                                            <div className="flex items-center gap-1">
                                                <PawPrint className="w-5 h-5 text-[#1a4d2e]" />
                                                <span className="text-xl font-black text-[#1a4d2e] tracking-tighter">PetLocal</span>
                                            </div>
                                        </div>
                                        <div className="text-center mb-4">
                                            <div className="text-[9px] font-black uppercase text-[#1a4d2e] leading-tight">Republica Federativa de Animais do Brasil</div>
                                            <div className="text-[8px] font-bold uppercase text-[#1a4d2e] leading-tight">Serviço de Cadastramento e Identificação Animal</div>
                                            <div className="text-[7px] font-bold uppercase text-[#1a4d2e] tracking-tighter">Válido em todo território nacional</div>
                                        </div>
                                        <div className="flex justify-between items-start flex-grow px-2">
                                            <div className="w-28 h-36 bg-white border border-[#1a4d2e] p-1 shadow-sm">
                                                <img src={pet.photoUrl || `https://picsum.photos/seed/${pet.id}/200/250`} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="relative w-32 h-32 flex items-center justify-center">
                                                <PawPrint className="w-24 h-24 text-[#1a4d2e]/10 absolute" />
                                                <div className="border border-[#1a4d2e] w-24 h-24 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                                                    <div className="text-[6px] uppercase text-[#1a4d2e] font-bold rotate-90 absolute -left-8">Pata do Animal</div>
                                                    <div className="grid grid-cols-2 gap-1 p-2 opacity-40">
                                                        <div className="w-4 h-4 bg-[#1a4d2e] rounded-full"></div>
                                                        <div className="w-4 h-4 bg-[#1a4d2e] rounded-full"></div>
                                                        <div className="w-4 h-4 bg-[#1a4d2e] rounded-full col-span-2 mx-auto"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-20 h-24 border border-[#1a4d2e] bg-white flex flex-col items-center justify-center p-1">
                                                <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                                    <div className="text-[6px] font-bold text-stone-400">QRCODE</div>
                                                </div>
                                                <div className="text-[5px] font-bold uppercase text-[#1a4d2e] mt-1">Perfil Digital</div>
                                            </div>
                                        </div>
                                        <div className="mt-auto border-t border-[#1a4d2e] pt-1 text-center">
                                            <div className="text-[7px] font-bold uppercase text-[#1a4d2e]">Assinatura do Tutor</div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-[#1a4d2e] text-white text-[6px] font-bold uppercase py-0.5 text-center">
                                        Exclusivo PetLocal - Sistema Nacional de Identificação
                                    </div>
                                </div>

                                {/* RG VERSO */}
                                <div className="w-[500px] h-[320px] bg-[#e0e7e1] rounded-lg border-[12px] border-[#1a4d2e] p-0 relative shadow-2xl overflow-hidden font-sans text-[#1a4d2e]">
                                    <div className="bg-[#1a4d2e] text-white text-center py-1 text-[10px] font-bold tracking-widest uppercase">
                                        Dados de Identificação - PetLocal
                                    </div>
                                    <div className="p-4 h-full relative">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                            <PawPrint className="w-48 h-48" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 relative z-10">
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black uppercase">Registro PetLocal Nº</span>
                                                <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">PL-{pet.ownerId}-{pet.id}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black uppercase">Data de Emissão</span>
                                                <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">{new Date().toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <div className="col-span-1 flex flex-col">
                                                <span className="text-[7px] font-black uppercase">Nome:</span>
                                                <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30 truncate">{pet.name}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black uppercase">Selo de Autenticidade</span>
                                                <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">AUTHENTIC-PL</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black uppercase">Naturalidade</span>
                                                <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">{pet.city || 'Brasil'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black uppercase">Sexo</span>
                                                <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">{pet.gender === 'male' ? 'MACHO' : 'FÊMEA'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black uppercase">Cor</span>
                                                <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">Característica</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] font-black uppercase">Raça</span>
                                                <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">{pet.breed}</span>
                                            </div>
                                            <div className="col-span-2 flex flex-col pt-2">
                                                <span className="text-[7px] font-black uppercase">Guardião Responsável</span>
                                                <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30 uppercase">Guardião PetLocal</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 w-full bg-[#1a4d2e] text-white text-[6px] font-bold uppercase py-0.5 text-center">
                                        Este documento é um registro privado de identificação PetLocal
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* CERTIDÃO DE NASCIMENTO */
                            <div className="w-[640px] h-[900px] bg-[#a5b4fc] p-8 relative shadow-2xl font-sans overflow-hidden scale-75 md:scale-90 origin-top">
                                <div className="absolute inset-0 opacity-40 pointer-events-none grid grid-cols-12 grid-rows-[repeat(20,1fr)] gap-2 p-2">
                                    {Array.from({ length: 240 }).map((_, i) => (
                                        <PawPrint key={i} className="w-4 h-4 text-white" />
                                    ))}
                                </div>
                                <div className="relative z-10 bg-white w-full h-full border-2 border-indigo-600 p-10 flex flex-col">
                                    <div className="text-center mb-6">
                                        <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                                            <PawPrint className="w-full h-full text-indigo-600" />
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-900 leading-tight">PetLocal - Hub Digital de Animais</div>
                                        <div className="text-[8px] font-bold uppercase tracking-tighter mb-2 text-indigo-800">Sistema Nacional de Registro Animal</div>
                                        <h2 className="text-4xl font-serif font-bold text-indigo-950 border-b-4 border-indigo-100 pb-2 inline-block px-8 italic">Certidão de Nascimento</h2>
                                    </div>
                                    <div className="grid grid-cols-[150px_1fr] gap-8 mb-8 mt-4">
                                        <div className="w-[150px] h-[190px] border-4 border-indigo-50 rounded-2xl overflow-hidden shadow-xl rotate-[-2deg]">
                                            <img src={pet.photoUrl || `https://picsum.photos/seed/${pet.id}/200/250`} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[9px] font-black uppercase block text-indigo-400 mb-1">Nome do Pet:</label>
                                                <div className="text-3xl font-serif font-bold text-indigo-950 underline decoration-indigo-200">{pet.name}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-[9px] font-black uppercase block text-indigo-400 mb-1">Espécie:</label>
                                                    <div className="text-lg font-bold text-indigo-900 border-b-2 border-indigo-50">{pet.species.toUpperCase()}</div>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black uppercase block text-indigo-400 mb-1">Raça:</label>
                                                    <div className="text-lg font-bold text-indigo-900 border-b-2 border-indigo-50">{pet.breed || 'SRD'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 mb-8">
                                        <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-50">
                                            <label className="text-[9px] font-black uppercase block text-indigo-400 mb-1">Data de Nascimento:</label>
                                            <div className="text-lg font-bold text-indigo-900">{pet.birthDate}</div>
                                        </div>
                                        <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-50">
                                            <label className="text-[9px] font-black uppercase block text-indigo-400 mb-1">Naturalidade:</label>
                                            <div className="text-lg font-bold text-indigo-900">{pet.city} - {pet.state}</div>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-950 rounded-[2rem] p-8 mb-8 text-white relative overflow-hidden shadow-xl">
                                        <PawPrint className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/10" />
                                        <label className="text-[10px] font-black uppercase block text-indigo-400 mb-4 tracking-widest leading-none">Dados do Guardião:</label>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <span className="text-[9px] font-bold text-indigo-300 uppercase block mb-1">Nome do Tutor Responsável</span>
                                                <div className="text-xl font-bold tracking-tight uppercase">Guardião PetLocal</div>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-bold text-indigo-300 uppercase block mb-1">Contato de Segurança</span>
                                                <div className="text-xl font-bold tracking-tight">{pet.contact}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-auto border-t-4 border-indigo-50 pt-8 flex justify-between items-end">
                                        <div className="text-center">
                                            <div className="w-28 h-28 bg-white border-4 border-indigo-50 rounded-2xl mb-2 flex items-center justify-center shadow-inner group">
                                                <Tag className="w-12 h-12 text-indigo-200 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                            <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Selo PetLocal</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-serif italic text-indigo-400 mb-2">Autenticado Digitalmente através de QR Code</div>
                                            <div className="text-2xl font-black text-indigo-950 uppercase tracking-tighter">PETLOCAL HUB</div>
                                            <div className="text-[9px] font-bold text-indigo-300">© 2024 Todos os Direitos Reservados</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- FAQ SECTION --- */}
                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
                    <h2 className="text-3xl font-black mb-12 relative z-10 flex items-center gap-4">
                        <div className="w-1.5 h-12 bg-indigo-600 rounded-full" />
                        Perguntas Frequentes
                    </h2>
                    <div className="space-y-2 relative z-10">
                        <FAQItem
                            question="Como os documentos do meu pet são enviados?"
                            answer="Ao finalizar o registro do seu pet você será redirecionado a área 'Meus Pets' onde poderá ver e imprimir os documentos, adicionar outros pets conhecidos à família do seu pet, ir para o perfil do seu pet e outras opções."
                        />
                        <FAQItem
                            question="Como imprimir os documentos do meu pet?"
                            answer="Você pode imprimir os documentos em folha A4 normal em qualquer tipo de impressora. Os documentos já são emitidos em tamanho real de documento de identidade, certidão de nascimento e tag de identificação."
                        />
                        <FAQItem
                            question="O que é a Tag de Identificação?"
                            answer="Ao registar o seu pet, o seu pet terá um perfil com sua foto e informações. A Tag de Identificação possui um QR Code que pode ser lido de qualquer celular por qualquer pessoa. Em caso de imprevistos e o pet se perca, após a leitura da Tag a pessoa irá para o perfil do seu pet podendo encontrar seus donos."
                        />
                        <FAQItem
                            question="Qual é o valor para emitir os documentos do meu pet?"
                            answer="Atualmente você pode registrar e emitir os documentos do seu pet por apenas R$ 29,90. Este valor inclui todos os documentos digitais prontos para impressão."
                        />
                    </div>
                </div>

                {/* --- ORDER FOOTER --- */}
                <div className="mt-12 text-center pb-20">
                    <p className="text-stone-500 text-sm mb-4">Seu pagamento é processado de forma segura via Stripe</p>
                    <div className="flex justify-center gap-4">
                        <div className="w-12 h-6 bg-white/5 rounded border border-white/10" />
                        <div className="w-12 h-6 bg-white/5 rounded border border-white/10" />
                        <div className="w-12 h-6 bg-white/5 rounded border border-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;
