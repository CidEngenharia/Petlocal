import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, ShieldCheck, FileText } from 'lucide-react';
import { Pet, Vaccine, PetDocument } from '../../types';

interface PetDetailsModalProps {
    pet: Pet;
    onClose: () => void;
    onViewDocument: (type: 'RG' | 'BirthCert' | 'Vaccination') => void;
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
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [vRes, dRes] = await Promise.all([
            fetch(`/api/vaccines/${pet.id}`, { headers }),
            fetch(`/api/documents/${pet.id}`, { headers })
        ]);
        setVaccines(await vRes.json());
        setDocuments(await dRes.json());
    };

    const STRIPE_LINKS: Record<string, string> = {
        'COMBO': 'https://buy.stripe.com/00w4gs3yvc3y0j8fWOf3a0c',
        'TAG_KEYCHAIN': 'https://buy.stripe.com/00wcMYfhd0kQ0j8bGyf3a07',
        'RG': 'https://buy.stripe.com/8x29AM2ur0kQgi6dOGf3a0b',
        'BIRTH_CERT': 'https://buy.stripe.com/aFacMY0mj8Rmd5U9yqf3a0a',
        'VACCINE_CARD': 'https://buy.stripe.com/eVq14gfhdebG8PE25Yf3a09',
        'QR_CODE': 'https://buy.stripe.com/dRm28kd952sYgi69yqf3a08'
    };

    const orderDoc = async (type: string) => {
        const url = STRIPE_LINKS[type];
        if (url) {
            window.open(url, '_blank');
        }
    };

    const [isAddingVaccine, setIsAddingVaccine] = useState(false);
    const [newVaccine, setNewVaccine] = useState({ name: '', date: '', nextDue: '' });

    const handleSaveVaccine = async () => {
        if (!newVaccine.name || !newVaccine.date) return;
        const token = localStorage.getItem('token');
        const res = await fetch('/api/vaccines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                pet_id: pet.id,
                name: newVaccine.name,
                date: newVaccine.date,
                next_due: newVaccine.nextDue
            })
        });

        if (res.ok) {
            setIsAddingVaccine(false);
            setNewVaccine({ name: '', date: '', nextDue: '' });
            fetchData();
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
                            {/* Marketing Banner - COMBO */}
                            <div className="bg-gradient-to-br from-brand-primary/95 to-brand-primary/80 backdrop-blur-sm rounded-3xl p-8 text-white shadow-xl overflow-hidden relative border border-white/10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-grow">
                                        <h3 className="text-3xl font-black mb-2 tracking-tight leading-none">Combo PetLocal Premium</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <ShieldCheck className="w-5 h-5 text-yellow-400" />
                                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">O Plano mais Completo</span>
                                        </div>
                                        <p className="text-stone-200 text-sm leading-relaxed max-w-xl font-medium mb-6">
                                            Adquira o <span className="text-white font-bold italic">RG Pet Digital + Certidão de Nascimento + Carteirinha de Vacinação</span> personalizada em um único pacote e economize!
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-yellow-400 text-brand-primary px-4 py-2 rounded-2xl font-black text-2xl shadow-lg">R$ 29,90</div>
                                            <span className="text-xs text-white/60 font-medium italic">Tudo pronto para impressão A4</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => orderDoc('COMBO')}
                                        className="btn-primary bg-white text-brand-primary hover:bg-stone-100 border-0 px-8 py-4 text-lg shadow-xl shadow-black/20"
                                    >
                                        Solicitar Combo
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DocumentCard
                                    title="RG Pet Digital"
                                    description="Identidade digital com foto. Ideal para banho e tosa e consultas veterinárias."
                                    price="R$ 15,90"
                                    status={documents.find(d => d.type === 'RG')?.status}
                                    onOrder={() => orderDoc('RG')}
                                    onView={() => onViewDocument('RG')}
                                />
                                <DocumentCard
                                    title="Certidão de Nascimento"
                                    description="Documento oficial com dados de origem, linhagem e foto personalizada."
                                    price="R$ 15,90"
                                    status={documents.find(d => d.type === 'BirthCert')?.status}
                                    onOrder={() => orderDoc('BIRTH_CERT')}
                                    onView={() => onViewDocument('BirthCert')}
                                />
                                <DocumentCard
                                    title="Carteira de Vacinação"
                                    description="Controle completo e visual das vacinas. Versão oficial PetLocal."
                                    price="R$ 15,90"
                                    status={documents.find(d => d.type === 'VACCINE_CARD')?.status}
                                    onOrder={() => orderDoc('VACCINE_CARD')}
                                    onView={() => onViewDocument('Vaccination')}
                                />
                                <DocumentCard
                                    title="QR Code Identificação"
                                    description="Código digital para acesso rápido ao perfil completo do pet."
                                    price="R$ 15,90"
                                    status={documents.find(d => d.type === 'QR_CODE')?.status}
                                    onOrder={() => orderDoc('QR_CODE')}
                                    onView={() => onViewDocument('RG')}
                                />
                                <DocumentCard
                                    title="Chaveiro Tag (Físico)"
                                    description="Tag metálica com QR Code gravado para coleira do pet. Segurança total."
                                    price="R$ 29,90"
                                    status={documents.find(d => d.type === 'TAG_KEYCHAIN')?.status}
                                    onOrder={() => orderDoc('TAG_KEYCHAIN')}
                                    onView={() => alert('Este é um produto físico. Verifique seu e-mail para detalhes do envio.')}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'vaccines' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Histórico de Vacinação</h3>
                                {!isAddingVaccine && (
                                    <button
                                        onClick={() => setIsAddingVaccine(true)}
                                        className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Registrar Dose
                                    </button>
                                )}
                            </div>

                            {isAddingVaccine && (
                                <div className="bg-white p-6 rounded-3xl border border-brand-primary/20 shadow-lg mb-8 animate-in fade-in zoom-in duration-300">
                                    <h4 className="font-bold mb-4">Nova Dose</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Nome da Vacina</label>
                                            <input
                                                type="text"
                                                className="input-field py-2"
                                                placeholder="Ex: V10, Raiva..."
                                                value={newVaccine.name}
                                                onChange={e => setNewVaccine({ ...newVaccine, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Data da Dose</label>
                                            <input
                                                type="date"
                                                className="input-field py-2"
                                                value={newVaccine.date}
                                                onChange={e => setNewVaccine({ ...newVaccine, date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Próxima Dose</label>
                                            <input
                                                type="date"
                                                className="input-field py-2"
                                                value={newVaccine.nextDue}
                                                onChange={e => setNewVaccine({ ...newVaccine, nextDue: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            onClick={() => setIsAddingVaccine(false)}
                                            className="px-4 py-2 text-sm font-bold text-stone-400 hover:text-stone-600 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveVaccine}
                                            disabled={!newVaccine.name || !newVaccine.date}
                                            className="btn-primary py-2 px-6 text-sm"
                                        >
                                            Salvar Dose
                                        </button>
                                    </div>
                                </div>
                            )}

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
