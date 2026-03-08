import React, { useState, useEffect } from 'react';
import { PawPrint, Plus, CheckCircle, ChevronDown, ChevronUp, ExternalLink, Printer, Shield, Tag } from 'lucide-react';
import { Pet } from '../../types';

interface DocumentViewerProps {
    pet: Pet;
    type: 'RG' | 'BirthCert' | 'Vaccination' | 'Observations';
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

    // Disable saving images and printing
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, []);

    const preventCopy = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
    };

    return (
        <div className="fixed inset-0 bg-stone-900/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 overflow-y-auto no-print">
            <style>
                {`
                    @media print {
                        body * { visibility: hidden !important; display: none !important; }
                    }
                    .no-select { user-select: none; -webkit-user-select: none; }
                `}
            </style>
            <div className="max-w-5xl w-full my-8 pt-8">
                <div className="flex justify-end mb-4 sticky top-4 z-[210]">
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all backdrop-blur-md border border-white/20">
                        <Plus className="w-8 h-8 rotate-45" />
                    </button>
                </div>

                {/* --- MARKETING HEADER --- */}
                <div className="bg-gradient-to-br from-[#004010]/95 to-[#004010]/80 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full -ml-32 -mb-32 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                                Seu Pet não é Registrado?
                            </h1>
                            <span className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-8 inline-block">Nós podemos te ajudar</span>
                            <p className="text-xl text-indigo-100 font-bold mb-8">
                                <span className="text-yellow-400 font-black">RG PET e CERTIDÃO</span>
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
                                src="/pet_docs_mockup.jpg"
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
                <div
                    className="bg-white/5 border border-white/10 rounded-[3rem] p-4 md:p-12 mb-12 flex flex-col items-center no-select"
                    onContextMenu={preventCopy}
                >
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-12 flex items-center gap-3">
                        <PawPrint className="w-8 h-8 text-indigo-400" />
                        Visualização de Exemplo
                    </h2>

                    <div className="flex flex-col items-center gap-12 w-full mx-auto max-w-full">

                        {type === 'RG' && (
                            <div className="relative shadow-2xl origin-top inline-block border-[1px] border-stone-300 bg-white w-full max-w-[600px]">
                                <img src="/bg_rg.jpg" className="w-full h-auto block pointer-events-none" alt="RG Base" draggable="false" />

                                {/* --- FRENTE --- */}
                                <div className="absolute flex items-center justify-center overflow-hidden" style={{ top: '25%', left: '8%', width: '23%', aspectRatio: '3/4', borderRadius: '4%' }}>
                                    {pet.photoUrl ? (
                                        <img src={pet.photoUrl} className="w-full h-full object-cover pointer-events-none" draggable="false" />
                                    ) : (
                                        <div className="w-full h-full bg-stone-100 flex items-center justify-center"><PawPrint className="w-8 h-8 text-stone-300" /></div>
                                    )}
                                </div>
                                <div className="absolute text-center" style={{ top: '45.5%', left: '0', width: '100%' }}>
                                    <span className="font-serif italic text-xl md:text-4xl text-stone-800/90 truncate px-4 block signature-font">{pet.name}</span>
                                </div>

                                {/* --- VERSO --- */}
                                <div className="absolute text-[8px] md:text-[13px] font-black text-stone-700 uppercase tracking-wide" style={{ top: '56.5%', left: '8%' }}>
                                    PL-{String(pet.id).padStart(6, '0')}
                                </div>
                                <div className="absolute text-[8px] md:text-[13px] font-black text-stone-700 uppercase tracking-wide" style={{ top: '56.5%', right: '7%' }}>
                                    {new Date().toLocaleDateString('pt-BR')}
                                </div>
                                <div className="absolute text-[10px] md:text-[16px] font-black text-stone-800 uppercase" style={{ top: '62.0%', left: '16%', width: '80%' }}>
                                    {pet.name}
                                </div>
                                <div className="absolute text-[8px] md:text-[13px] font-black text-stone-700 uppercase" style={{ top: '67.0%', left: '26%', width: '25%' }}>
                                    {pet.city || 'N/A'}
                                </div>
                                <div className="absolute text-[8px] md:text-[13px] font-black text-stone-700 uppercase" style={{ top: '67.0%', left: '68%', width: '25%' }}>
                                    BRASIL
                                </div>
                                <div className="absolute text-[8px] md:text-[13px] font-black text-stone-700 uppercase pr-2 truncate" style={{ top: '72.3%', left: '15%', width: '38%' }}>
                                    {pet.breed || 'SRD'}
                                </div>
                                <div className="absolute text-[8px] md:text-[13px] font-black text-stone-700 uppercase" style={{ top: '72.3%', left: '74%', width: '25%' }}>
                                    CARACT.
                                </div>
                                <div className="absolute text-[8px] md:text-[13px] font-black text-stone-700 uppercase" style={{ top: '77.7%', left: '35%', width: '15%' }}>
                                    {pet.birthDate || '--/--/----'}
                                </div>
                                <div className="absolute text-[8px] md:text-[13px] font-black text-stone-700 uppercase" style={{ top: '77.7%', left: '77%', width: '15%' }}>
                                    {pet.gender === 'male' ? 'MACHO' : 'FÊMEA'}
                                </div>
                                <div className="absolute text-[8px] md:text-[13px] font-black text-stone-700 uppercase" style={{ top: '83.3%', left: '26%', width: '60%' }}>
                                    GUARDIÃO REGISTRADO HUB - {pet.contact || 'S/N'}
                                </div>
                            </div>
                        )}

                        {type === 'BirthCert' && (
                            <div className="relative shadow-2xl origin-top inline-block border-[1px] border-stone-300 bg-white w-full max-w-[700px]">
                                <img src="/bg_birthcert.jpg" className="w-full h-auto block pointer-events-none" alt="Certidão Base" draggable="false" />

                                <div className="absolute flex items-center justify-center overflow-hidden bg-white p-1 rounded-sm shadow-sm" style={{ top: '24.5%', left: '7.5%', width: '18%', aspectRatio: '3/4' }}>
                                    {pet.photoUrl ? (
                                        <img src={pet.photoUrl} className="w-full h-full object-cover pointer-events-none rounded-sm" draggable="false" />
                                    ) : (
                                        <PawPrint className="w-8 h-8 text-stone-200" />
                                    )}
                                </div>

                                <div className="absolute text-[9px] md:text-sm font-bold text-stone-800 uppercase" style={{ top: '24%', left: '33%' }}>{pet.species || 'CÃO'}</div>
                                <div className="absolute text-[9px] md:text-sm font-bold text-stone-800 uppercase" style={{ top: '24%', left: '60%' }}>{pet.gender === 'male' ? 'MACHO' : 'FÊMEA'}</div>
                                <div className="absolute text-[9px] md:text-sm font-bold text-stone-800 uppercase" style={{ top: '30%', left: '33%', width: '60%', whiteSpace: 'nowrap', overflow: 'hidden' }}>{pet.breed || 'VIRA-LATA (SRD)'}</div>
                                <div className="absolute text-[9px] md:text-sm font-bold text-stone-800 uppercase" style={{ top: '36%', left: '33%' }}>PELAGEM ATUAL</div>
                                <div className="absolute text-[9px] md:text-sm font-bold text-stone-800 uppercase" style={{ top: '36%', left: '60%' }}>N/A</div>
                                <div className="absolute text-[9px] md:text-sm font-bold text-stone-800 uppercase" style={{ top: '42.5%', left: '33%' }}>{pet.city || 'N. CONSTA'}</div>
                                <div className="absolute text-[9px] md:text-sm font-bold text-stone-800 uppercase" style={{ top: '42.5%', left: '60%' }}>{pet.state || 'BR'}</div>

                                <div className="absolute text-xs md:text-[17px] font-bold text-stone-800 uppercase" style={{ top: '51.5%', left: '16%' }}>{pet.name}</div>
                                <div className="absolute text-xs md:text-[17px] font-bold text-stone-800 uppercase" style={{ top: '58%', left: '20%' }}>GUARDIÃO HUB</div>
                                <div className="absolute text-xs md:text-[17px] font-bold text-stone-800 uppercase" style={{ top: '64.2%', left: '24%' }}>SRD - S/ RAÇA DEFINIDA</div>
                                <div className="absolute text-xs md:text-[17px] font-bold text-stone-800 uppercase" style={{ top: '70.8%', left: '24%' }}>{pet.weight ? `${pet.weight}KG` : 'MÉDIO'} | {pet.species?.toUpperCase() || 'CÃO'}</div>

                                <div className="absolute text-center" style={{ top: '88.5%', left: '25%', width: '50%' }}>
                                    <span className="font-serif italic text-2xl md:text-4xl text-stone-800/90 truncate block signature-font">{pet.name}</span>
                                </div>
                            </div>
                        )}

                        {type === 'Vaccination' && (
                            <div className="relative shadow-2xl origin-top inline-block border-[1px] border-stone-300 bg-white w-full max-w-[700px]">
                                <img src="/bg_vaccination.jpg" className="w-full h-auto block pointer-events-none" alt="Vacinação Base" draggable="false" />

                                <div className="absolute flex items-center justify-center overflow-hidden bg-white p-1 shadow-sm" style={{ top: '24.5%', right: '23.8%', width: '13.5%', aspectRatio: '3/4' }}>
                                    {pet.photoUrl ? (
                                        <img src={pet.photoUrl} className="w-full h-full object-cover pointer-events-none" draggable="false" />
                                    ) : (
                                        <PawPrint className="w-8 h-8 text-stone-200" />
                                    )}
                                </div>

                                <div className="absolute text-[9px] md:text-sm font-bold text-stone-800 uppercase" style={{ top: '48%', left: '59%' }}>{pet.name}</div>

                                <div className="absolute text-[8px] md:text-[11px] font-bold text-stone-800 uppercase" style={{ top: '56%', left: '59%', width: '22%', whiteSpace: 'nowrap', overflow: 'hidden' }}>{pet.breed || 'SRD'}</div>
                                <div className="absolute text-[8px] md:text-[11px] font-bold text-stone-800 uppercase" style={{ top: '56%', left: '80%' }}>{pet.birthDate || '--/--/----'}</div>

                                <div className="absolute text-[8px] md:text-[11px] font-bold text-stone-800 uppercase" style={{ top: '64%', left: '59%' }}>CARAC.</div>
                                <div className="absolute text-[8px] md:text-[11px] font-bold text-stone-800 uppercase" style={{ top: '64%', left: '80%' }}>{pet.gender === 'male' ? 'MACHO' : 'FÊMEA'}</div>

                                <div className="absolute text-[8px] md:text-[11px] font-bold text-stone-800 uppercase" style={{ top: '72%', left: '60%' }}>GUARDIÃO VIA PETLOCAL HUB</div>

                                <div className="absolute text-[8px] md:text-[11px] font-bold text-stone-800 uppercase" style={{ top: '80%', left: '60%' }}>{pet.contact || 'S/N'}</div>
                            </div>
                        )}

                        {type === 'Observations' && (
                            <div className="relative shadow-2xl origin-top inline-block border-[1px] border-stone-300 bg-white w-full max-w-[700px]">
                                <img src="/bg_observations.jpg" className="w-full h-auto block pointer-events-none" alt="Observações Base" draggable="false" />

                                <div className="absolute font-handwriting text-blue-900/80 leading-relaxed text-center" style={{ top: '14.5%', left: '5%', width: '90%', fontSize: 'clamp(1rem, 3vw, 2rem)' }}>
                                    {pet.name} registrado c/ sucesso no sistema.
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
                            answer="Ao finalizar o registro do seu pet você será redirecionado a área 'Meus Pets' onde poderá ver os documentos, e adicionar outros pets conhecidos à família do seu pet, ir para o perfil do seu pet e outras opções."
                        />
                        <FAQItem
                            question="Como imprimir os documentos do meu pet?"
                            answer="Você poderá vizualisar os documentos , porém nós nos encarregamos de gerar em qualidade premium e enviar os documentos ao seus tutores. Os documentos já são emitidos em tamanho real de documento de identidade, certidão de nascimento e carteira de vacinação. Os documentos serão gerados em papel fotográfico fosco."
                        />
                        <FAQItem
                            question="Porque não posso imprimir os documentos gerados pelo sistema?"
                            answer="Desabilitamos essa função para mantermos um padrão de qualidade PetLocal, pois nossa impressão seguirá uma linha de qualidade com papeis especiais e padrão premium. Removemos a função de impressão autonoma, pois os usuários estavam imprimindo em papíes convecionais e com baixa qualidade de impressão. Deixamos essa funconalidade apenas para uso interno. Com isso garantimos uma melhor qualidade nas impressões."
                        />
                        <FAQItem
                            question="Caso eu queira adiquirir o Chaveiro Tag (Físico) de Identificação como faço?"
                            answer="Caso deseje confecionar o Chaveiro Tag de Identificação que será confeccionado em formato de brasão com o nome do Pet e o QRcod , é simples, basta no cadastro selecionar o link de pagamento para quais serviços deseja. Os documentos e o Chaveiro Tag pode ser solictados sepadamente. No caso dos documemtos pode ser solicitado o combo com os 3 documentos ( RG, Certidão de Nascimento e Carteira de Vacinação.) Porém o chaveiro é solictado separamente."
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
