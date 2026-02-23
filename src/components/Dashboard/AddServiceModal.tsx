import React, { useState } from 'react';
import { motion } from 'motion/react';

interface AddServiceModalProps {
    providerId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ providerId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        type: 'trainer',
        name: '',
        description: '',
        price: '',
        location: '',
        whatsapp: '',
        instagram: '',
        photoUrl: ''
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
        const res = await fetch('/api/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ ...formData, provider_id: providerId, price: parseFloat(formData.price) || 0 })
        });
        if (res.ok) onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
                <h2 className="text-3xl font-serif mb-8">Divulgar Seu Serviço</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Tipo de Serviço</label>
                        <select
                            className="input-field"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="trainer">Adestrador</option>
                            <option value="hotel">Hotel Pet</option>
                            <option value="vet">Veterinário</option>
                            <option value="petsitter">PetSitter</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Nome do Estabelecimento/Profissional</label>
                        <input
                            className="input-field"
                            placeholder="Ex: Dog Care Center"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Preço Base (R$)</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Localização</label>
                            <input
                                className="input-field"
                                placeholder="Cidade, UF"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">WhatsApp</label>
                            <input
                                className="input-field"
                                placeholder="Ex: 11999999999"
                                value={formData.whatsapp}
                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Instagram</label>
                            <input
                                className="input-field"
                                placeholder="@seuusuario"
                                value={formData.instagram}
                                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Foto do Serviço (Máx 2MB)</label>
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

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Descrição</label>
                        <textarea
                            className="input-field min-h-[100px]"
                            placeholder="Conte mais sobre seus serviços..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
                        <button onClick={handleSubmit} className="btn-primary flex-1">Publicar (Taxa de Divulgação)</button>
                    </div>
                    <p className="text-[10px] text-center text-stone-400 uppercase tracking-widest">Ao publicar, você concorda com a taxa de manutenção da plataforma.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default AddServiceModal;
