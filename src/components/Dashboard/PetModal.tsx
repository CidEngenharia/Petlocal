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
    'Salsicha', 'Husky Siberiano', 'Vira-lata (SRD)', 'Outra'
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
        weight: pet?.weight || '',
        gender: pet?.gender || 'M',
        address: pet?.address || '',
        city: pet?.city || '',
        state: pet?.state || '',
        contact: pet?.contact || ''
    });

    const [uploadError, setUploadError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setUploadError('');

        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setUploadError('O arquivo deve ter no máximo 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (uploadError) return;
        const url = pet ? `/api/pets/${pet.id}` : '/api/pets';
        const method = pet ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ ...formData, owner_id: userId })
        });
        if (res.ok) onSuccess();
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

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Foto do Pet (Máx 2MB)</label>
                        <div className="flex flex-col gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-stone-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand-bg file:text-brand-primary
                  hover:file:bg-brand-primary hover:file:text-white
                  transition-all cursor-pointer"
                            />
                            {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}
                            {formData.photoUrl && (
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-stone-200">
                                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
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
