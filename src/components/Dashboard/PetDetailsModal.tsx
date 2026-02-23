import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, ShieldCheck, FileText } from 'lucide-react';
import { Pet, Vaccine, PetDocument } from '../../types';

interface PetDetailsModalProps {
    pet: Pet;
    onClose: () => void;
    onViewDocument: (type: 'RG' | 'BirthCert') => void;
    onEdit: () => void;
}

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({ pet, onClose, onViewDocument, onEdit }) => {
    const [activeTab, setActiveTab] = useState<'docs' | 'vaccines'>('docs');
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [documents, setDocuments] = useState<PetDocument[]>([]);

    useEffect(() => {
        fetchData();
    }, [pet]);

    const fetchData = async () => {
        const [vRes, dRes] = await Promise.all([
            fetch(`/api/vaccines/${pet.id}`),
            fetch(`/api/documents/${pet.id}`)
        ]);
        setVaccines(await vRes.json());
        setDocuments(await dRes.json());
    };

    const orderDoc = async (type: 'RG' | 'BirthCert') => {
        const res = await fetch('/api/documents/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ pet_id: pet.id, type })
        });
        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
        }
    };

    return (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-brand-bg rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
                <div className="bg-white p-8 border-b border-stone-200">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-6 items-center">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg">
                                <img src={pet.photoUrl || `https://picsum.photos/seed/${pet.id}/200/200`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-serif">{pet.name}</h2>
                                <div className="flex items-center gap-4">
                                    <p className="text-stone-400">{pet.breed} • {pet.species === 'dog' ? 'Cachorro' : 'Gato'}</p>
                                    <button
                                        onClick={onEdit}
                                        className="text-brand-primary text-xs font-bold uppercase tracking-widest hover:underline"
                                    >
                                        Editar Dados
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                            <Plus className="w-6 h-6 rotate-45 text-stone-400" />
                        </button>
                    </div>

                    <div className="flex gap-8 mt-8">
                        <button
                            onClick={() => setActiveTab('docs')}
                            className={`pb-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'docs' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-stone-400'}`}
                        >
                            Documentos
                        </button>
                        <button
                            onClick={() => setActiveTab('vaccines')}
                            className={`pb-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'vaccines' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-stone-400'}`}
                        >
                            Vacinas
                        </button>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto flex-grow">
                    {activeTab === 'docs' && (
                        <div className="space-y-8">
                            {/* Marketing Banner */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShieldCheck className="w-8 h-8 text-yellow-400" />
                                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Nós podemos te ajudar</span>
                                    </div>
                                    <h3 className="text-3xl font-black mb-4 tracking-tight leading-none">Seu Pet não é Registrado?</h3>
                                    <p className="text-xl text-indigo-100 font-bold mb-6">
                                        RG Pet e Certidão <span className="text-yellow-400 underline underline-offset-4 decoration-2">INCLUSOS NO REGISTRO</span> por apenas R$ 29,90
                                    </p>
                                    <p className="text-stone-200 text-sm leading-relaxed max-w-2xl font-medium">
                                        Utilizam em banhos e tosas, agilizam cadastros no veterinário, guardam os dados do seu pet de forma segura e personalizada com a fotinha dele. Tudo pronto para impressão!
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <DocumentCard
                                    title="RG Pet Digital"
                                    description="Utilize em banhos e tosas, agilize cadastros no veterinário e guarde os dados de forma segura e personalizada com a foto do seu pet."
                                    price="R$ 29,90"
                                    status={documents.find(d => d.type === 'RG')?.status}
                                    onOrder={() => orderDoc('RG')}
                                    onView={() => onViewDocument('RG')}
                                />
                                <DocumentCard
                                    title="Certidão de Nascimento"
                                    description="Dados sobre o seu pet junto ao nascimento dele, foto e QR code profissional para identificação única."
                                    price="Incluso"
                                    status={documents.find(d => d.type === 'BirthCert')?.status}
                                    onOrder={() => orderDoc('BirthCert')}
                                    onView={() => onViewDocument('BirthCert')}
                                />
                                <DocumentCard
                                    title="Tag de Identificação"
                                    description="Segurança imprevistos: QR Code para o perfil digital do pet caso ele se perca, permitindo contato imediato com o dono."
                                    price="Incluso"
                                    status={documents.find(d => d.type === 'RG')?.status} // Assuming linked to RG for now
                                    onOrder={() => orderDoc('RG')}
                                    onView={() => onViewDocument('RG')}
                                />
                                <DocumentCard
                                    title="Carteirinha de Vacinação"
                                    description="Controle de vacinas completo e personalizado com foto. Formato A4 dobrável pronto para imprimir e usar."
                                    price="Incluso"
                                    status={documents.find(d => d.type === 'RG')?.status} // Assuming linked to RG for now
                                    onOrder={() => orderDoc('RG')}
                                    onView={() => onViewDocument('RG')}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'vaccines' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Histórico de Vacinação</h3>
                                <button className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Registrar Dose
                                </button>
                            </div>

                            {vaccines.length > 0 ? (
                                <div className="space-y-3">
                                    {vaccines.map(v => (
                                        <div key={v.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-stone-200">
                                            <div>
                                                <div className="font-bold">{v.name}</div>
                                                <div className="text-xs text-stone-400">Aplicada em: {v.date}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-bold uppercase tracking-widest text-brand-primary">Próxima Dose</div>
                                                <div className="text-sm font-medium">{v.nextDue}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-3xl border border-stone-200">
                                    <ShieldCheck className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                                    <p className="text-stone-400">Nenhuma vacina registrada.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

function DocumentCard({ title, description, price, status, onOrder, onView }: { title: string, description: string, price: string, status?: string, onOrder: () => void, onView: () => void }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-brand-bg p-3 rounded-2xl text-brand-primary">
                    <FileText className="w-6 h-6" />
                </div>
                {status === 'paid' ? (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Emitido</span>
                ) : (
                    <span className="text-brand-primary font-serif text-xl">{price}</span>
                )}
            </div>
            <h4 className="text-xl font-bold mb-2">{title}</h4>
            <p className="text-stone-500 text-sm mb-6 flex-grow">{description}</p>

            {status === 'paid' ? (
                <button onClick={onView} className="btn-secondary w-full py-2">Visualizar Documento</button>
            ) : (
                <button onClick={onOrder} className="btn-primary w-full py-2">Solicitar Agora</button>
            )}
        </div>
    );
}

export default PetDetailsModal;
