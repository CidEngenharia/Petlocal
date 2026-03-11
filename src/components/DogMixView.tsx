import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dog, Sparkles, Wand2, BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const DogMixView: React.FC = () => {
    // Breed Simulator
    const [breed1, setBreed1] = useState('');
    const [breed2, setBreed2] = useState('');
    const [simResult, setSimResult] = useState<any>(null);
    const [simLoading, setSimLoading] = useState(false);

    // Name Generator
    const [nameWords, setNameWords] = useState(['', '', '']);
    const [nameResult, setNameResult] = useState<any>(null);
    const [nameLoading, setNameLoading] = useState(false);

    // Name Meaning
    const [meaningInput, setMeaningInput] = useState('');
    const [meaningResult, setMeaningResult] = useState<any>(null);
    const [meaningLoading, setMeaningLoading] = useState(false);

    const [activeSection, setActiveSection] = useState<'simulator' | 'generator' | 'meaning'>('simulator');

    const API = '/api';

    const handleSimulate = async () => {
        if (!breed1.trim() || !breed2.trim()) return;
        setSimLoading(true);
        setSimResult(null);
        try {
            const res = await fetch(`${API}/dogmix/simulate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ breed1: breed1.trim(), breed2: breed2.trim() })
            });
            const data = await res.json();
            setSimResult(data);
        } catch {
            setSimResult({ error: 'Erro ao simular' });
        }
        setSimLoading(false);
    };

    const handleGenerateName = async () => {
        const validWords = nameWords.filter(w => w.trim().length > 0);
        if (validWords.length === 0) return;
        setNameLoading(true);
        setNameResult(null);
        try {
            const res = await fetch(`${API}/dogmix/generate-name`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ words: validWords })
            });
            const data = await res.json();
            setNameResult(data);
        } catch {
            setNameResult({ error: 'Erro ao gerar nome' });
        }
        setNameLoading(false);
    };

    const handleMeaning = async () => {
        if (!meaningInput.trim()) return;
        setMeaningLoading(true);
        setMeaningResult(null);
        try {
            const res = await fetch(`${API}/dogmix/name-meaning`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: meaningInput.trim() })
            });
            const data = await res.json();
            setMeaningResult(data);
        } catch {
            setMeaningResult({ error: 'Erro ao buscar significado' });
        }
        setMeaningLoading(false);
    };

    const breedSuggestions = [
        'Labrador', 'Poodle', 'Golden Retriever', 'Bulldog', 'Husky',
        'Chihuahua', 'Pastor Alemão', 'Shih Tzu', 'Rottweiler', 'Beagle',
        'Yorkshire', 'Dachshund', 'Border Collie', 'Pit Bull', 'Spitz'
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
                    <Dog className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">DogMix</h1>
                    <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-stone-500 mt-2">Simulador de raças, gerador de nomes e muito mais com IA!</p>
            </motion.div>

            {/* Section Tabs */}
            <div className="flex gap-2 justify-center flex-wrap">
                {[
                    { id: 'simulator' as const, label: '🐕 Simulador de Raças', icon: Dog },
                    { id: 'generator' as const, label: '✨ Gerador de Nomes', icon: Wand2 },
                    { id: 'meaning' as const, label: '📖 Significado de Nomes', icon: BookOpen },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                            activeSection === tab.id
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200'
                                : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* SECTION 1: Breed Simulator */}
            <AnimatePresence mode="wait">
                {activeSection === 'simulator' && (
                    <motion.div
                        key="simulator"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-stone-100">
                            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <Dog className="w-6 h-6 text-amber-600" />
                                Simulador de Cruzamento
                            </h2>
                            <p className="text-stone-500 text-sm mt-1">Selecione duas raças e descubra como seria o filhote!</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">🐕 Raça 1</label>
                                    <input
                                        type="text"
                                        value={breed1}
                                        onChange={e => setBreed1(e.target.value)}
                                        placeholder="Ex: Labrador"
                                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                        list="breeds1"
                                    />
                                    <datalist id="breeds1">
                                        {breedSuggestions.map(b => <option key={b} value={b} />)}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">🐕 Raça 2</label>
                                    <input
                                        type="text"
                                        value={breed2}
                                        onChange={e => setBreed2(e.target.value)}
                                        placeholder="Ex: Poodle"
                                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                        list="breeds2"
                                    />
                                    <datalist id="breeds2">
                                        {breedSuggestions.map(b => <option key={b} value={b} />)}
                                    </datalist>
                                </div>
                            </div>

                            <button
                                onClick={handleSimulate}
                                disabled={simLoading || !breed1.trim() || !breed2.trim()}
                                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                {simLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                {simLoading ? 'Simulando...' : 'Simular Cruzamento'}
                            </button>

                            {simResult && !simResult.error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <Dog className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-amber-800">{simResult.mixName}</h3>
                                            <span className="text-sm text-amber-600 bg-amber-100 px-3 py-0.5 rounded-full">Porte {simResult.size}</span>
                                        </div>
                                    </div>
                                    <p className="text-stone-700 leading-relaxed mb-4">{simResult.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {simResult.traits?.map((t: string, i: number) => (
                                            <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-white text-amber-700 border border-amber-200 shadow-sm">
                                                ✨ {t}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* SECTION 2: Name Generator */}
                {activeSection === 'generator' && (
                    <motion.div
                        key="generator"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-stone-100">
                            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <Wand2 className="w-6 h-6 text-purple-600" />
                                Gerador de Nomes com IA
                            </h2>
                            <p className="text-stone-500 text-sm mt-1">Digite até 3 palavras e a IA criará um nome perfeito!</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-3 gap-3">
                                {nameWords.map((word, i) => (
                                    <div key={i}>
                                        <label className="block text-xs font-semibold text-stone-500 mb-1">Palavra {i + 1}</label>
                                        <input
                                            type="text"
                                            value={word}
                                            onChange={e => {
                                                const newWords = [...nameWords];
                                                newWords[i] = e.target.value;
                                                setNameWords(newWords);
                                            }}
                                            placeholder={['feliz', 'paz', 'amor'][i]}
                                            className="w-full px-3 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-sm"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleGenerateName}
                                disabled={nameLoading || nameWords.every(w => !w.trim())}
                                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                {nameLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                                {nameLoading ? 'Gerando...' : 'Gerar Nome'}
                            </button>

                            {nameResult && !nameResult.error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
                                >
                                    <div className="text-center mb-4">
                                        <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Nome sugerido</span>
                                        <h3 className="text-3xl font-bold text-purple-800 mt-1">{nameResult.name}</h3>
                                    </div>
                                    <p className="text-stone-600 text-sm text-center mb-4">{nameResult.reason}</p>
                                    {nameResult.alternatives?.length > 1 && (
                                        <div>
                                            <p className="text-xs font-semibold text-stone-500 mb-2">Outras sugestões:</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {nameResult.alternatives.filter((n: string) => n !== nameResult.name).map((alt: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium bg-white text-purple-700 border border-purple-200 shadow-sm">
                                                        {alt}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* SECTION 3: Name Meaning */}
                {activeSection === 'meaning' && (
                    <motion.div
                        key="meaning"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-stone-100">
                            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-emerald-600" />
                                Significado do Nome
                            </h2>
                            <p className="text-stone-500 text-sm mt-1">Descubra o significado por trás do nome do seu pet!</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Nome do pet</label>
                                <input
                                    type="text"
                                    value={meaningInput}
                                    onChange={e => setMeaningInput(e.target.value)}
                                    placeholder="Ex: Luna, Rex, Mel..."
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                                    onKeyDown={e => e.key === 'Enter' && handleMeaning()}
                                />
                            </div>

                            <button
                                onClick={handleMeaning}
                                disabled={meaningLoading || !meaningInput.trim()}
                                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                {meaningLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
                                {meaningLoading ? 'Buscando...' : 'Descobrir Significado'}
                            </button>

                            {meaningResult && !meaningResult.error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                                            <BookOpen className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-emerald-800">{meaningResult.name}</h3>
                                    </div>
                                    <p className="text-stone-700 leading-relaxed">{meaningResult.meaning}</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DogMixView;
