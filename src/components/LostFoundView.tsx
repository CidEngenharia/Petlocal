import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Search, Heart, Info, Lock, Plus } from 'lucide-react';
import { Pet, User } from '../types';

interface LostFoundViewProps {
    user: User | null;
}

const LostFoundView: React.FC<LostFoundViewProps> = ({ user }) => {
    const [pets, setPets] = React.useState<(Pet & { owner: { email: string } })[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState<'all' | 'lost' | 'found'>('all');
    const [selectedPet, setSelectedPet] = React.useState<(Pet & { owner: { email: string } }) | null>(null);

    React.useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const res = await fetch('/api/public/pets');
            const data = await res.json();
            // Filtrar apenas o que é relevante para Achados e Perdidos
            const relevant = data.filter((p: any) => ['lost', 'found', 'adoption', 'registrado'].includes(p.intent));
            setPets(relevant);
        } catch (err) {
            console.error('Error fetching pets:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (intent: string) => {
        switch (intent) {
            case 'lost': return 'Animal Perdido';
            case 'found': return 'Animal Achado';
            case 'adoption': return 'Animal para Doar';
            case 'registrado': return 'Animal Registrado';
            case 'deceased': return 'Animal Falecido';
            default: return '';
        }
    };

    const getStatusColor = (intent: string) => {
        switch (intent) {
            case 'lost': return 'text-red-600 bg-red-50 border border-red-100';
            case 'found': return 'text-amber-600 bg-amber-50 border border-amber-100';
            case 'adoption': return 'text-blue-600 bg-blue-50 border border-blue-100';
            case 'registrado': return 'text-green-600 bg-green-50 border border-green-100';
            case 'deceased': return 'text-red-700 bg-red-50 border border-red-200';
            default: return 'text-stone-500 bg-stone-50 border border-stone-100';
        }
    };

    const filteredPets = pets.filter(p => {
        if (filter === 'all') return true;
        return p.intent === filter;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4">Achados e Perdidos</h2>
                <p className="text-stone-500 max-w-2xl mx-auto font-medium">
                    Ajude a reunir pets com suas famílias ou encontre um novo lar para um animal resgatado.
                </p>
            </div>

            <div className="flex justify-center gap-4 mb-12">
                {['all', 'lost', 'found'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-brand-primary text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                            }`}
                    >
                        {f === 'all' ? 'Todos' : f === 'lost' ? 'Perdidos' : 'Achados'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
                </div>
            ) : filteredPets.length === 0 ? (
                <div className="text-center py-20 bg-stone-50 rounded-[40px]">
                    <p className="text-stone-400 font-bold">Nenhum pet encontrado nesta categoria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {filteredPets.map(pet => (
                        <motion.div
                            key={pet.id}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group"
                        >
                            <div className="relative aspect-square overflow-hidden bg-stone-50">
                                <img
                                    src={pet.photoUrl || `https://picsum.photos/seed/${pet.id}/600/400`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className={`absolute top-4 right-4 ${getStatusColor(pet.intent)} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm`}>
                                    {getStatusLabel(pet.intent)}
                                </div>
                            </div>

                            <div className="p-5 text-center">
                                <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-primary transition-colors truncate">{pet.name}</h3>
                                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-3 truncate">{pet.breed || pet.species}</p>

                                <div className="flex items-center justify-center gap-1 text-[10px] font-black text-stone-500 uppercase tracking-tighter mb-4">
                                    <MapPin className="w-3 h-3 text-brand-primary" />
                                    {pet.address || pet.city}
                                </div>

                                <button
                                    onClick={() => setSelectedPet(pet)}
                                    className="w-full py-2.5 bg-brand-bg hover:bg-brand-primary text-brand-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    {user ? 'Ver Detalhes' : 'Entrar'}
                                    {!user && <Lock className="w-3 h-3" />}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default LostFoundView;
