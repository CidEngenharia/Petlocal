import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Tag, Star, ArrowRight } from 'lucide-react';

const PetShop: React.FC = () => {
    const products = [
        { id: 1, name: 'Ração Premium Adulto 15kg', price: 189.90, category: 'Alimentação', rating: 4.8 },
        { id: 2, name: 'Cama Ortopédica G', price: 249.00, category: 'Acessórios', rating: 4.9 },
        { id: 3, name: 'Brinquedo Interativo Kong', price: 89.90, category: 'Brinquedos', rating: 4.7 },
        { id: 4, name: 'Coleira com GPS Inteligente', price: 399.00, category: 'Tecnologia', rating: 4.5 },
        { id: 5, name: 'Arranhador Torre para Gatos', price: 320.00, category: 'Acessórios', rating: 4.9 },
        { id: 6, name: 'Kit Banho e Tosa em Casa', price: 155.00, category: 'Higiene', rating: 4.6 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-12"
        >
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-serif mb-2">Pet Shop & Vendas</h2>
                    <p className="text-stone-500">Produtos selecionados para o conforto e saúde do seu pet.</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn-secondary flex items-center gap-2">
                        <Tag className="w-5 h-5" /> Promoções
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" /> Meu Carrinho
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <div key={product.id} className="card group hover:border-brand-primary/30 transition-all overflow-hidden">
                        <div className="aspect-square bg-stone-100 relative overflow-hidden">
                            <img
                                src={`https://picsum.photos/seed/product${product.id}/600/600`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                                {product.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold group-hover:text-brand-primary transition-colors">{product.name}</h3>
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                    <Star className="w-3 h-3 fill-current" /> {product.rating}
                                </div>
                            </div>
                            <div className="text-2xl font-serif font-bold text-stone-900 mb-6">
                                R$ {product.price.toFixed(2)}
                            </div>
                            <button className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                                Adicionar <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-24 p-12 bg-stone-900 text-white rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-3xl font-serif mb-2">Quer vender seus produtos?</h3>
                    <p className="text-stone-400">Torne-se um parceiro lojista do PetLocal e alcance milhares de donos de pets.</p>
                </div>
                <button className="btn-primary bg-white text-stone-900 border-white hover:bg-stone-100 whitespace-nowrap">
                    Seja um Lojista
                </button>
            </div>
        </motion.div>
    );
};

export default PetShop;
