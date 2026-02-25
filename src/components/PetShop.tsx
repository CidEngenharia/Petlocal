import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Tag, Star, ArrowRight, Plus, Camera, X, Dog, Package, MapPin } from 'lucide-react';
import { Pet, Accessory, User } from '../types';

interface PetShopProps {
    user: User | null;
    setView: (v: any) => void;
}

const PetShop: React.FC<PetShopProps> = ({ user, setView }) => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [accessories, setAccessories] = useState<Accessory[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pets' | 'accessories'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Acessórios',
        photoUrl: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, aRes] = await Promise.all([
                fetch('/api/public/pets/sale'),
                fetch('/api/public/accessories')
            ]);
            setPets(await pRes.json());
            setAccessories(await aRes.json());
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const res = await fetch('/api/accessories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    owner_id: user.id,
                    ...formData
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ name: '', description: '', price: '', category: 'Acessórios', photoUrl: '' });
                fetchData();
            }
        } catch (err) {
            console.error('Error creating accessory:', err);
        }
    };

    const items = [
        ...pets.map(p => ({ ...p, type: 'pet' as const })),
        ...accessories.map(a => ({ ...a, type: 'accessory' as const }))
    ].filter(item => {
        if (filter === 'all') return true;
        if (filter === 'pets') return item.type === 'pet';
        return item.type === 'accessory';
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-serif mb-2">Pets à Venda</h2>
                    <p className="text-stone-500">Encontre o novo companheiro ideal ou acessórios para o seu pet.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-12">
                {[
                    { id: 'all', label: 'Todos os Itens', icon: ShoppingBag },
                    { id: 'pets', label: 'Pets à Venda', icon: Dog },
                    { id: 'accessories', label: 'Acessórios', icon: Package }
                ].map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setFilter(opt.id as any)}
                        className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${filter === opt.id
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105'
                            : 'bg-white text-stone-500 hover:bg-stone-50'
                            }`}
                    >
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-stone-50 rounded-[40px]">
                    <p className="text-stone-400 font-bold text-lg">Nenhum item encontrado nesta categoria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {items.map((item: any) => (
                        <motion.div
                            layout
                            key={`${item.type}-${item.id}`}
                            className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group"
                        >
                            <div className="relative aspect-square overflow-hidden bg-stone-50">
                                <img
                                    src={item.photoUrl || `https://picsum.photos/seed/${item.type}${item.id}/600/600`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                    <div className={`backdrop-blur px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit shadow-sm ${item.type === 'pet' ? 'bg-amber-500 text-white' : 'bg-brand-primary/90 text-white'
                                        }`}>
                                        {item.type === 'pet' ? 'Pet à Venda' : item.category}
                                    </div>
                                    {item.type === 'pet' && (
                                        <div className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-stone-900 border border-stone-100 w-fit shadow-sm">
                                            {item.breed || item.species}
                                        </div>
                                    {item.type === 'pet' && item.ownerPhotoUrl && (
                                        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-stone-100 z-10">
                                            <img src={item.ownerPhotoUrl} alt="Tutor" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-5 text-center">
                                <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-primary transition-colors truncate mb-1">{item.name}</h3>

                                <div className="text-xl font-serif font-black text-brand-primary mb-3">
                                    {item.price ? `R$ ${item.price.toFixed(2)}` : 'Sob Consulta'}
                                </div>

                                {item.type === 'pet' ? (
                                    <div className="flex items-center justify-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">
                                        <MapPin className="w-3 h-3 text-brand-primary" />
                                        {item.city}, {item.state}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-1 text-amber-500 text-[10px] font-bold mb-4">
                                        <Star className="w-3 h-3 fill-current" /> 5.0 (Novo)
                                    </div>
                                )}

                                <button className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10">
                                    {item.type === 'pet' ? 'Contato' : 'Comprar'} <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Accessory Registration Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                                <h2 className="text-2xl font-serif">Cadastrar Acessório</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-full">
                                    <Plus className="w-6 h-6 rotate-45 text-stone-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <div
                                            onClick={() => document.getElementById('accessory-image')?.click()}
                                            className="w-full h-48 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-stone-100 transition-all overflow-hidden relative group"
                                        >
                                            {formData.photoUrl ? (
                                                <>
                                                    <img src={formData.photoUrl} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                        <Camera className="text-white w-8 h-8" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="bg-white p-4 rounded-full shadow-sm">
                                                        <Camera className="text-stone-400 w-8 h-8" />
                                                    </div>
                                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Foto do Produto</p>
                                                </>
                                            )}
                                        </div>
                                        <input id="accessory-image" type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-xs font-black uppercase text-stone-400 mb-2 block">Nome do Produto</label>
                                        <input
                                            required
                                            className="w-full p-4 bg-stone-50 rounded-2xl border-stone-200 focus:bg-white text-sm font-bold"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black uppercase text-stone-400 mb-2 block">Preço (R$)</label>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            className="w-full p-4 bg-stone-50 rounded-2xl border-stone-200 focus:bg-white text-sm font-bold"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black uppercase text-stone-400 mb-2 block">Categoria</label>
                                        <select
                                            className="w-full p-4 bg-stone-50 rounded-2xl border-stone-200 focus:bg-white text-sm font-bold appearance-none"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option>Acessórios</option>
                                            <option>Alimentação</option>
                                            <option>Brinquedos</option>
                                            <option>Higiene</option>
                                            <option>Saúde</option>
                                            <option>Camas & Conforto</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-xs font-black uppercase text-stone-400 mb-2 block">Descrição Breve</label>
                                        <textarea
                                            className="w-full p-4 bg-stone-50 rounded-2xl border-stone-200 focus:bg-white text-sm font-bold h-24"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary w-full py-5 text-lg shadow-xl shadow-brand-primary/20">
                                    Confirmar Cadastro
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="mt-24 p-12 bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-[60px] flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
                <div className="relative z-10 max-w-2xl">
                    <div className="bg-brand-primary/20 p-4 rounded-full w-fit mb-6">
                        <Tag className="w-8 h-8 text-brand-primary" />
                    </div>
                    <h3 className="text-4xl font-serif mb-4">Cadastre seus Pets ou Acessórios</h3>
                    <p className="text-stone-400 text-lg">Seja um acessório ou um pet que precisa de um novo lar, nossa plataforma facilita a conexão com o comprador ideal.</p>
                </div>
                {user ? (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary bg-brand-primary text-white border-brand-primary hover:bg-white hover:text-stone-900 px-12 py-6 text-xl shadow-2xl relative z-10"
                    >
                        Cadastrar Agora
                    </button>
                ) : (
                    <div className="text-center md:text-right relative z-10">
                        <p className="text-stone-400 mb-6 italic">Faça login para cadastrar seus itens.</p>
                        <button
                            onClick={() => setView('profile')}
                            className="btn-primary bg-white text-stone-900 border-white hover:bg-stone-50 px-12 py-6 text-xl shadow-2xl"
                        >
                            Entrar para Vender
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PetShop;
