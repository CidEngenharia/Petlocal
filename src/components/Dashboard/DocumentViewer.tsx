import React from 'react';
import { PawPrint, Plus } from 'lucide-react';
import { Pet } from '../../types';

interface DocumentViewerProps {
    pet: Pet;
    type: 'RG' | 'BirthCert';
    onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ pet, type, onClose }) => {
    return (
        <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-md z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-4xl w-full">
                <div className="flex justify-end mb-4">
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all">
                        <Plus className="w-8 h-8 rotate-45" />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-12 py-8">
                    {type === 'RG' ? (
                        <div className="flex flex-col gap-12 items-center">
                            {/* RG FRENTE */}
                            <div className="w-[500px] h-[320px] bg-[#e0e7e1] rounded-lg border-[12px] border-[#1a4d2e] p-0 relative shadow-2xl overflow-hidden font-sans">
                                {/* Header */}
                                <div className="bg-[#1a4d2e] text-white text-center py-1 text-[10px] font-bold tracking-widest uppercase">
                                    Carteira de Identificação Animal
                                </div>

                                <div className="p-4 flex flex-col h-full">
                                    <div className="flex justify-center items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1">
                                            <PawPrint className="w-5 h-5 text-[#1a4d2e]" />
                                            <span className="text-xl font-black text-[#1a4d2e] tracking-tighter">Rq Animal</span>
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
                                            <div className="text-[5px] font-bold uppercase text-[#1a4d2e] mt-1">QRCode</div>
                                        </div>
                                    </div>

                                    <div className="mt-auto border-t border-[#1a4d2e] pt-1 text-center">
                                        <div className="text-[7px] font-bold uppercase text-[#1a4d2e]">Assinatura do Titular</div>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 w-full bg-[#1a4d2e] text-white text-[6px] font-bold uppercase py-0.5 text-center">
                                    Orgão Emissor - Sistema de Cadastramento RG Animal
                                </div>
                            </div>

                            {/* RG VERSO */}
                            <div className="w-[500px] h-[320px] bg-[#e0e7e1] rounded-lg border-[12px] border-[#1a4d2e] p-0 relative shadow-2xl overflow-hidden font-sans text-[#1a4d2e]">
                                <div className="bg-[#1a4d2e] text-white text-center py-1 text-[10px] font-bold tracking-widest uppercase">
                                    Carteira de Identificação Animal
                                </div>

                                <div className="p-4 h-full relative">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                        <PawPrint className="w-48 h-48" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">RGA Nº</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">000.{pet.id}.{pet.ownerId}-X</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Data de Expedição</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">{new Date().toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="col-span-1 flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Nome:</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30 truncate">{pet.name}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Série-A</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">PET-LOCAL-2024</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Naturalidade</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">{pet.city || 'Brasil'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Origem</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">Nacional</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Cor</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">Característica</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Raça</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">{pet.breed}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Micro Chip</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">Não Consta</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Porte</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">Médio</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Data de Nascimento</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">{pet.birthDate}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Castrado</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">Sim</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Email</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30 truncate">contato@petlocal.com</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Telefone</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">{pet.contact || '(11) 99999-9999'}</span>
                                        </div>
                                        <div className="col-span-2 flex flex-col">
                                            <span className="text-[7px] font-black uppercase">Proprietário</span>
                                            <span className="text-[10px] font-bold border-b border-[#1a4d2e]/30">Guardião PetLocal</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 w-full bg-[#1a4d2e] text-white text-[6px] font-bold uppercase py-0.5 text-center">
                                    Orgão Emissor - Sistema de Cadastramento RG Animal
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* CERTIDÃO DE NASCIMENTO */
                        <div className="w-[640px] h-[900px] bg-[#a5b4fc] p-8 relative shadow-2xl font-sans overflow-hidden">
                            <div className="absolute inset-0 opacity-40 pointer-events-none grid grid-cols-12 grid-rows-[repeat(20,1fr)] gap-2 p-2">
                                {Array.from({ length: 240 }).map((_, i) => (
                                    <PawPrint key={i} className="w-4 h-4 text-white" />
                                ))}
                            </div>

                            <div className="relative z-10 bg-white w-full h-full border-2 border-indigo-600 p-10 flex flex-col">
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Coat_of_arms_of_Brazil.svg/500px-Coat_of_arms_of_Brazil.svg.png" className="w-full h-full object-contain" alt="Brasão do Brasil" />
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-900">República Federativa do Brasil</div>
                                    <div className="text-[8px] font-bold uppercase tracking-tighter mb-2 text-indigo-800">Registro Digital dos Animais do Brasil</div>
                                    <h2 className="text-4xl font-serif font-bold text-indigo-950 border-b-2 border-indigo-200 pb-2 inline-block px-8">Certidão de Nascimento</h2>
                                </div>

                                <div className="grid grid-cols-[120px_1fr_1fr] gap-4 mb-6">
                                    <div className="w-[120px] h-[150px] border-2 border-indigo-200 rounded-sm overflow-hidden bg-stone-50">
                                        <img src={pet.photoUrl || `https://picsum.photos/seed/${pet.id}/200/250`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-4 col-span-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border-2 border-indigo-100 rounded-lg p-2">
                                                <label className="text-[8px] font-bold uppercase block text-indigo-400">Espécie:</label>
                                                <div className="text-sm font-bold text-indigo-900">{pet.species.toUpperCase()}</div>
                                            </div>
                                            <div className="border-2 border-indigo-100 rounded-lg p-2">
                                                <label className="text-[8px] font-bold uppercase block text-indigo-400">Raça:</label>
                                                <div className="text-sm font-bold text-indigo-900">{pet.breed || 'SRD'}</div>
                                            </div>
                                        </div>
                                        <div className="border-2 border-indigo-100 rounded-lg p-2">
                                            <label className="text-[8px] font-bold uppercase block text-indigo-400">Nome:</label>
                                            <div className="text-xl font-serif font-bold text-indigo-950">{pet.name}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="border-2 border-indigo-100 rounded-lg p-2">
                                        <label className="text-[8px] font-bold uppercase block text-indigo-400">Data de Nascimento:</label>
                                        <div className="text-sm font-bold text-indigo-900">{pet.birthDate}</div>
                                    </div>
                                    <div className="border-2 border-indigo-100 rounded-lg p-2">
                                        <label className="text-[8px] font-bold uppercase block text-indigo-400">Naturalidade:</label>
                                        <div className="text-sm font-bold text-indigo-900">{pet.city} - {pet.state}</div>
                                    </div>
                                </div>

                                <div className="border-2 border-indigo-100 rounded-lg p-4 mb-6 bg-stone-50">
                                    <label className="text-[10px] font-bold uppercase block text-indigo-400 mb-2">Dados do Guardião:</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-[8px] font-bold text-indigo-300">NOME DO TUTOR</span>
                                            <div className="text-sm font-bold text-indigo-900">GUARDIÃO PETLOCAL</div>
                                        </div>
                                        <div>
                                            <span className="text-[8px] font-bold text-indigo-300">CONTATO</span>
                                            <div className="text-sm font-bold text-indigo-900">{pet.contact}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto border-t-2 border-indigo-100 pt-6 flex justify-between items-end">
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-stone-100 border-2 border-indigo-100 mb-2 flex items-center justify-center text-[10px] text-indigo-300 uppercase font-black">QR CODE</div>
                                        <div className="text-[8px] font-bold text-indigo-400">VERIFICAÇÃO DIGITAL</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-serif italic text-indigo-400 mb-2">Assinado Digitalmente por PetLocal Hub</div>
                                        <div className="text-[12px] font-bold text-indigo-950 uppercase tracking-widest">SISTEMA NACIONAL PET</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;
