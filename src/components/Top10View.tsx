import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PawPrint, MapPin, Camera } from 'lucide-react';
import { Pet } from '../types';

const Top10View: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTop10();
    }, []);

    const fetchTop10 = async () => {
        try {
            const res = await fetch('/api/public/top10');
            const data = await res.json();
            // Shuffle them for "randômico" feel on each load
            const shuffled = data.sort(() => Math.random() - 0.5);
            setPets(shuffled);
        } catch (err) {
            console.error('Error fetching top 10:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block bg-brand-primary/10 p-3 rounded-2xl text-brand-primary mb-4"
                >
                    <PawPrint className="w-8 h-8" />
                </motion.div>
                <h1 className="text-5xl font-serif mb-4">Top 10 PetLocal</h1>
                <p className="text-stone-500 max-w-2xl mx-auto font-medium">
                    Conheça os últimos amigos que se juntaram à nossa comunidade.
                    Nossa lista é atualizada automaticamente a cada novo registro!
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {pets.map((pet, index) => (
                        <motion.div
                            key={pet.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group"
                        >
                            <div className="relative aspect-square overflow-hidden bg-stone-50">
                                {pet.photoUrl ? (
                                    <img
                                        src={pet.photoUrl}
                                        alt={pet.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                                        <Camera className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-sm text-brand-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        #{index + 1}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 text-center">
                                <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-primary transition-colors">{pet.name}</h3>
                                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-3">
                                    {pet.breed || pet.species}
                                </p>
                                <div className="flex items-center justify-center gap-1 text-[10px] font-black text-stone-500 uppercase tracking-tighter">
                                    <MapPin className="w-3 h-3 text-brand-primary" />
                                    {pet.city || 'PetLocal'}, {pet.state || 'BR'}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-20 text-center bg-brand-bg rounded-[40px] p-12 border border-brand-primary/10">
                <h3 className="text-2xl font-serif mb-4">Também quer registrar seu Pet?</h3>
                <p className="text-stone-500 mb-8 max-w-lg mx-auto font-medium">
                    Garanta o RG Digital, Certidão e Carteira de Vacinas personalizada para o seu melhor amigo agora mesmo!
                </p>
                <button
                    onClick={() => window.location.href = '#documentation'}
                    className="btn-primary px-10 py-4 shadow-xl shadow-brand-primary/20"
                >
                    Registrar Meu Pet Agora
                </button>
            </div>
        </div>
    );
};

export default Top10View;
