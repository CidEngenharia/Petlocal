import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pet } from '../../types';

interface PetModalProps {
    userId: number;
    pet?: Pet;
    onClose: () => void;
    onSuccess: () => void;
}

const DOG_BREEDS = [
    'Labrador Retriever', 'Poodle', 'Pastor Alemão', 'Golden Retriever', 'Bulldog Francês',
    'Beagle', 'Pug', 'Shih Tzu', 'Rottweiler', 'Dachshund', 'Yorkshire Terrier', 'Boxer',
    'Salsicha', 'Husky Siberiano', 'Pitbull', 'Vira-lata (SRD)', 'Outra'
];

const CAT_BREEDS = [
    'Persa', 'Siamês', 'Maine Coon', 'Bengala', 'Ragdoll', 'Sphynx', 'Pelo Curto Inglês',
    'Vira-lata (SRD)', 'Outra'
];

const PARROT_BREEDS = ['Papagaio-verdadeiro', 'Arara-canindé', 'Calopsita', 'Agapornis', 'Outra'];
const BIRD_BREEDS = ['Canário', 'Periquito', 'Curió', 'Sabiá', 'Outra'];

const PetModal: React.FC<PetModalProps> = ({ userId, pet, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: pet?.name || '',
        species: pet?.species || 'dog',
        breed: pet?.breed || '',
        birthDate: pet?.birthDate || '',
        photoUrl: pet?.photoUrl || '',
        ownerPhotoUrl: pet?.ownerPhotoUrl || '',
        weight: pet?.weight || '',
        gender: pet?.gender || 'M',
        address: pet?.address || '',
        city: pet?.city || '',
        state: pet?.state || '',
        contact: pet?.contact || '',
        intent: pet?.intent || 'none',
        intentDescription: pet?.intentDescription || ''
    });

    const [uploadError, setUploadError] = useState('');
    const [tutorUploadError, setTutorUploadError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'ownerPhotoUrl') => {
        const file = e.target.files?.[0];
        if (field === 'photoUrl') setUploadError('');
        else setTutorUploadError('');

        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                if (field === 'photoUrl') setUploadError('O arquivo deve ter no máximo 2MB.');
                else setTutorUploadError('O arquivo deve ter no máximo 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, [field]: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (uploadError) return;
        const url = pet ? `/api/pets/${pet.id}` : '/api/pets';
        const method = pet ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ ...formData, owner_id: userId })
            });

            if (res.ok) {
                alert(pet ? 'Pet atualizado com sucesso!' : 'Pet cadastrado com sucesso!');
                onSuccess();
            } else {
                const data = await res.json();
                alert(`Erro: ${data.error || 'Falha na operação'}`);
            }
        } catch (err: any) {
            console.error('Pet submission error:', err);
            const errorMessage = err.message === 'Failed to fetch'
                ? 'Erro de conexão ou limite de tamanho excedido (máx 2MB).'
                : 'Erro de conexão ao tentar salvar o pet.';
            alert(errorMessage);
        }
    };

    const breeds =
        formData.species === 'dog' ? DOG_BREEDS :
            formData.species === 'cat' ? CAT_BREEDS :
                formData.species === 'parrot' ? PARROT_BREEDS :
                    BIRD_BREEDS;

    return (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
                <h2 className="text-3xl font-serif mb-8">{pet ? 'Editar Pet' : 'Cadastrar Novo Pet'}</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Nome</label>
                        <input
                            className="input-field"
                            placeholder="Ex: Max"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Espécie</label>
                            <select
                                className="input-field"
                                value={formData.species}
                                onChange={e => {
                                    const species = e.target.value;
                                    setFormData({ ...formData, species, breed: '' });
                                }}
                            >
                                <option value="dog">Cão</option>
                                <option value="cat">Gato</option>
                                <option value="parrot">Papagaio</option>
                                <option value="bird">Pássaro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Raça</label>
                            <select
                                className="input-field"
                                value={formData.breed}
                                onChange={e => setFormData({ ...formData, breed: e.target.value })}
                            >
                                <option value="">Selecione a raça</option>
                                {breeds.map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Peso (kg)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Ex: 5.5"
                                value={formData.weight}
                                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Sexo</label>
                            <select
                                className="input-field"
                                value={formData.gender}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="M">Macho</option>
                                <option value="F">Fêmea</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Endereço</label>
                        <input
                            className="input-field"
                            placeholder="Rua, Número, Bairro"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Cidade</label>
                            <input
                                className="input-field"
                                placeholder="Ex: São Paulo"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Estado</label>
                            <input
                                className="input-field"
                                placeholder="Ex: SP"
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Contato do Tutor</label>
                        <input
                            className="input-field"
                            placeholder="Telefone ou E-mail"
                            value={formData.contact}
                            onChange={e => setFormData({ ...formData, contact: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Data de Nascimento</label>
                        <input
                            type="date"
                            className="input-field"
                            value={formData.birthDate}
                            onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                        />
                    </div>

                    <div className="bg-brand-bg/30 p-6 rounded-3xl border border-brand-primary/10">
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-brand-primary mb-4">Finalidade do Cadastro</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'none', label: 'Apenas Registro' },
                                { id: 'registrado', label: 'Animal Registrado' },
                                { id: 'lost', label: 'Animal Perdido' },
                                { id: 'found', label: 'Animal Achado' },
                                { id: 'adoption', label: 'Para Adoção' },
                                { id: 'sale', label: 'Para Venda' },
                                { id: 'breeding', label: 'Para Cruza' },
                                { id: 'deceased', label: 'Falecido' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, intent: opt.id as any })}
                                    className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border-2 ${formData.intent === opt.id
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20'
                                        : 'bg-white text-stone-500 border-stone-100 hover:border-brand-primary/30'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        {formData.intent !== 'none' && (
                            <p className="text-[10px] text-brand-primary/60 mt-4 italic font-medium leading-relaxed">
                                * Ao selecionar uma finalidade, seu pet será listado publicamente na área de Doações/Busca.
                            </p>
                        )}
                        {['adoption', 'lost', 'found', 'breeding'].includes(formData.intent) && (
                            <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-brand-primary mb-2">
                                    Informações Adicionais sobre o Status
                                </label>
                                <textarea
                                    className="input-field min-h-[100px] py-3 resize-none"
                                    placeholder="Descreva detalhes importantes (ex: local onde sumiu, temperamento para adoção, etc.)"
                                    value={formData.intentDescription}
                                    onChange={e => setFormData({ ...formData, intentDescription: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Foto do Pet (Máx 2MB)</label>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'photoUrl')}
                                    className="block w-full text-xs text-stone-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-xs file:font-semibold
                  file:bg-brand-bg file:text-brand-primary
                  hover:file:bg-brand-primary hover:file:text-white
                  transition-all cursor-pointer"
                                />
                                {uploadError && <p className="text-red-500 text-[10px]">{uploadError}</p>}
                                {formData.photoUrl && (
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-stone-200">
                                        <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Foto do Tutor (Máx 2MB)</label>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'ownerPhotoUrl')}
                                    className="block w-full text-xs text-stone-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-xs file:font-semibold
                  file:bg-brand-bg file:text-brand-primary
                  hover:file:bg-brand-primary hover:file:text-white
                  transition-all cursor-pointer"
                                />
                                {tutorUploadError && <p className="text-red-500 text-[10px]">{tutorUploadError}</p>}
                                {formData.ownerPhotoUrl && (
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-stone-200">
                                        <img src={formData.ownerPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
                        <button onClick={handleSubmit} className="btn-primary flex-1">Salvar</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PetModal;
