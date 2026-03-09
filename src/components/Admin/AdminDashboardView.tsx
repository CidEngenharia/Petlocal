import React, { useState, useEffect } from 'react';
import {
    Users,
    Dog,
    ShoppingBag,
    Briefcase,
    FileText,
    Download,
    Share2,
    Search,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    ExternalLink,
    Loader2,
    Trash2,
    Edit,
    MoreVertical,
    MessageCircle,
    Plus,
    ArrowRight,
    Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import 'jspdf-autotable';
import { AdminData, Pet } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AdminDashboardViewProps {
    onViewDocument: (pet: Pet, type: 'RG' | 'BirthCert' | 'Vaccination') => void;
    setView: (view: any) => void;
    key?: string;
}

export default function AdminDashboardView({ onViewDocument, setView }: AdminDashboardViewProps) {
    const [data, setData] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'users' | 'pets' | 'services' | 'accessories'>('users');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/system-data', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!res.ok) throw new Error('Falha ao buscar dados');
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error(err);
            alert('Erro ao carregar dados do sistema.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type: string, id: number) => {
        if (!confirm(`Tem certeza que deseja excluir? Esta ação não pode ser desfeita.`)) return;

        // Map tab names to backend entities
        const routeMap: Record<string, string> = {
            'users': 'users',
            'pets': 'pets',
            'services': 'services',
            'accessories': 'accessories'
        };

        try {
            const res = await fetch(`/api/admin/${routeMap[activeTab]}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                alert(`${type} excluído com sucesso!`);
                fetchAdminData();
            } else {
                alert('Erro ao excluir item.');
            }
        } catch (err) {
            console.error(err);
            alert('Falha na conexão.');
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            const type = activeTab;
            const res = await fetch(`/api/admin/${type}/${editingItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editingItem)
            });

            if (res.ok) {
                alert('Atualizado com sucesso!');
                setIsEditModalOpen(false);
                fetchAdminData();
            } else {
                alert('Erro ao atualizar.');
            }
        } catch (err) {
            console.error(err);
            alert('Falha ao salvar as alterações.');
        }
    };

    const generatePDF = () => {
        if (!data) return;
        const doc = new jsPDF() as any;

        doc.setFontSize(22);
        doc.text('Relatório Geral PetLocal', 20, 20);
        doc.setFontSize(12);
        doc.text(`Gerado em: ${new Date().toLocaleString()}`, 20, 30);

        // Summary
        doc.setFontSize(16);
        doc.text('Resumo do Sistema', 20, 45);
        doc.setFontSize(12);
        doc.text(`Total de Usuários: ${data.stats.users}`, 20, 55);
        doc.text(`Total de Pets: ${data.stats.pets}`, 20, 62);
        doc.text(`Total de Serviços: ${data.stats.services}`, 20, 69);
        doc.text(`Total de Acessórios: ${data.stats.accessories}`, 20, 76);
        doc.text(`Total de Documentos: ${data.stats.documents}`, 20, 83);

        // Users Table
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Lista de Usuários', 20, 20);
        doc.autoTable({
            startY: 25,
            head: [['ID', 'Email', 'Cargo', 'Cadastro']],
            body: data.data.users.map(u => [u.id, u.email, u.role, new Date(u.createdAt).toLocaleDateString()]),
        });

        const filename = `relatorio-petlocal-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
    };

    const exportToWhatsApp = () => {
        if (!data) return;
        const text = `*RELATÓRIO GERAL PETLOCAL*\n\n` +
            `📅 Data: ${new Date().toLocaleString()}\n\n` +
            `📊 *RESUMO*\n` +
            `- Usuários: ${data.stats.users}\n` +
            `- Pets: ${data.stats.pets}\n` +
            `- Serviços: ${data.stats.services}\n` +
            `- Acessórios: ${data.stats.accessories}\n` +
            `- Documentos: ${data.stats.documents}\n\n` +
            `Acesse o painel para mais detalhes: ${window.location.origin}`;

        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-stone-500 font-medium italic">Preparando centro de comando...</p>
            </div>
        );
    }

    // Visualization Data
    const chartData = [
        { name: 'Usuários', value: data?.stats.users || 0, color: '#3B82F6' },
        { name: 'Animais', value: data?.stats.pets || 0, color: '#F97316' },
        { name: 'Serviços', value: data?.stats.services || 0, color: '#8B5CF6' },
        { name: 'Produtos', value: data?.stats.accessories || 0, color: '#EC4899' },
    ];

    const filteredData = () => {
        if (!data) return [];
        const source = (data.data as any)[activeTab];
        return source.filter((item: any) => {
            const searchStr = searchTerm.toLowerCase();
            if (activeTab === 'users') return item.email.toLowerCase().includes(searchStr);
            if (activeTab === 'pets') return item.name.toLowerCase().includes(searchStr) || (item.owner?.email || '').toLowerCase().includes(searchStr);
            return item.name.toLowerCase().includes(searchStr);
        });
    };

    const openWhatsAppUser = (user: any) => {
        const contact = user.contact || (data?.data.pets.find(p => p.ownerId === user.id)?.contact) || '';
        if (!contact) {
            alert('Este usuário não possui contato cadastrado ou associado a um pet.');
            return;
        }
        const cleanNumbers = contact.replace(/\D/g, '');
        window.open(`https://wa.me/55${cleanNumbers}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-stone-50/50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-[#004010]">Visão Estratégica do Sistema</h1>
                        </div>
                        <p className="text-stone-500 text-lg">Central de Inteligência PetLocal - Sidney Sales</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="bg-white px-4 py-2 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Status do Servidor</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-sm font-semibold text-stone-700 uppercase">Operacional</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-stone-100"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Última Sincro</span>
                                <span className="text-sm font-semibold text-stone-700">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={generatePDF}
                                className="flex items-center gap-2 bg-white text-stone-700 px-5 py-3 rounded-2xl border border-stone-200 hover:border-primary/30 hover:bg-stone-50 transition-all font-semibold shadow-sm"
                            >
                                <Download className="w-5 h-5" />
                                Exportar PDF
                            </button>
                            <button
                                onClick={exportToWhatsApp}
                                className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-2xl hover:bg-[#20ba5a] transition-all font-semibold shadow-xl shadow-[#25D366]/20"
                            >
                                <Share2 className="w-5 h-5" />
                                Canais WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                {/* High-Level Metrics (Horizontal Layout as in reference) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <CompactMetricCard
                        label="Usuários Cadastrados"
                        value={data?.stats.users || 0}
                        trend="+12% este mês"
                        icon={<Users className="w-5 h-5" />}
                        color="bg-blue-600"
                        progress={75}
                    />
                    <CompactMetricCard
                        label="Animais Ativos"
                        value={data?.stats.pets || 0}
                        trend="+8% este mês"
                        icon={<Dog className="w-5 h-5" />}
                        color="bg-orange-500"
                        progress={62}
                    />
                    <CompactMetricCard
                        label="Serviços Oferecidos"
                        value={data?.stats.services || 0}
                        trend="+5% este mês"
                        icon={<Briefcase className="w-5 h-5" />}
                        color="bg-purple-600"
                        progress={48}
                    />
                    <CompactMetricCard
                        label="Checkout Documentos"
                        value={data?.stats.documents || 0}
                        trend="Recorrência 92%"
                        icon={<FileText className="w-5 h-5" />}
                        color="bg-green-600"
                        progress={92}
                    />
                </div>

                {/* Middle Visual Section (Charts) */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                    {/* Chart 1: Evolution */}
                    <div className="xl:col-span-2 bg-white rounded-[32px] p-8 shadow-xl shadow-stone-100 border border-stone-100">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-stone-800">Engajamento de Ecossistema</h3>
                                <p className="text-sm text-stone-400">Distribuição de ativos por categoria</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-lg text-[10px] font-bold text-stone-500">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> USUÁRIOS
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Diversity/Status */}
                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-stone-100 border border-stone-100">
                        <h3 className="text-xl font-bold text-stone-800 mb-6">Saúde Financeira</h3>
                        <div className="h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-stone-800">{data?.stats.documents}</span>
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Docs Pagos</span>
                            </div>
                        </div>

                        <div className="space-y-4 mt-6">
                            {chartData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm font-medium text-stone-600">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-stone-800">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Data Explorer */}
                <div className="bg-white rounded-[32px] shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                    <div className="p-8 border-b border-stone-100">
                        <div className="flex flex-col lg:flex-row gap-8 justify-between">
                            <div className="flex p-1.5 bg-stone-100 rounded-2xl w-fit">
                                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Gestão de Pessoas</TabButton>
                                <TabButton active={activeTab === 'pets'} onClick={() => setActiveTab('pets')}>Monitoramento Pets</TabButton>
                                <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')}>Hub Serviços</TabButton>
                                <TabButton active={activeTab === 'accessories'} onClick={() => setActiveTab('accessories')}>Portfólio Produtos</TabButton>
                            </div>

                            <div className="relative flex-grow max-w-md">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Busca avançada inteligente..."
                                    className="w-full pl-13 pr-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-stone-700 font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50/50 border-b border-stone-100 uppercase tracking-widest text-[11px] font-black text-stone-400">
                                    <th className="px-8 py-5">Identificação</th>
                                    <th className="px-8 py-5">Metatags / Atributos</th>
                                    <th className="px-8 py-5">Relacionamento</th>
                                    <th className="px-8 py-5 text-right">Ações de Gestor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                <AnimatePresence mode="popLayout">
                                    {filteredData().map((item: any) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={item.id}
                                            className="hover:bg-stone-50/70 transition-colors group"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex-shrink-0 overflow-hidden border-2 border-white shadow-sm ring-1 ring-stone-200">
                                                        {item.photoUrl ? (
                                                            <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300">
                                                                {activeTab === 'users' ? <Users size={24} /> : activeTab === 'pets' ? <Dog size={24} /> : <ShoppingBag size={24} />}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-stone-800 text-lg mb-0.5">{activeTab === 'users' ? item.email.split('@')[0] : item.name}</div>
                                                        <div className="text-xs text-stone-400 font-medium tracking-tight truncate max-w-[200px]">
                                                            {activeTab === 'users' ? item.email : `UID #${item.id} - ${new Date(item.createdAt).toLocaleDateString()}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                {activeTab === 'users' ? (
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${item.role === 'global_admin' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                            item.role === 'provider' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                                                                'bg-blue-50 text-blue-600 border border-blue-100'
                                                            }`}>
                                                            {item.role === 'global_admin' ? 'Super Admin' : item.role}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-sm font-bold text-stone-700">
                                                            {activeTab === 'pets' ? `${item.species} • Raça ${item.breed || '-'}` :
                                                                activeTab === 'services' ? `Preço sugerido: R$ ${item.price.toFixed(2)}` :
                                                                    `Setor: ${item.category}`}
                                                        </div>
                                                        <div className="text-xs text-stone-400">
                                                            {activeTab === 'pets' ? (
                                                                <span className="flex items-center gap-1.5">
                                                                    <AlertCircle className="w-3 h-3 text-orange-400" />
                                                                    Intenção: {item.intent}
                                                                </span>
                                                            ) : (
                                                                <span>Cadastrado em {new Date(item.createdAt).toLocaleDateString()}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 font-semibold text-stone-600">
                                                {activeTab === 'users' ? (
                                                    <div className="flex gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-stone-400 font-black uppercase">Ativos</span>
                                                            <span className="text-stone-700">{item._count.pets + item._count.services}</span>
                                                        </div>
                                                        <div className="w-px h-8 bg-stone-100 mt-1"></div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-stone-400 font-black uppercase">Subs</span>
                                                            <span className="text-stone-700">{item._count.subscriptions}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 max-w-[180px] truncate">
                                                        {item.owner?.email || item.provider?.email || 'N/A'}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {activeTab === 'users' && (
                                                        <button
                                                            onClick={() => openWhatsAppUser(item)}
                                                            className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                            title="Falar com Tutor"
                                                        >
                                                            <MessageCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {activeTab === 'pets' && (
                                                        <button
                                                            onClick={() => onViewDocument(item, 'RG')}
                                                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                            title="Ver Prontuário Digital"
                                                        >
                                                            <FileText className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {activeTab === 'services' && (
                                                        <button
                                                            onClick={() => setView('marketplace')}
                                                            className="p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                                            title="Ver no Marketplace"
                                                        >
                                                            <ExternalLink className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {activeTab === 'accessories' && (
                                                        <button
                                                            onClick={() => setView('shop')}
                                                            className="p-2.5 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                                                            title="Ver na Vitrine"
                                                        >
                                                            <ShoppingBag className="w-5 h-5" />
                                                        </button>
                                                    )}

                                                    <div className="w-px h-6 bg-stone-100 mx-1"></div>

                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2.5 text-stone-400 hover:text-primary transition-colors"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(activeTab === 'accessories' ? 'accessorie' : activeTab, item.id)}
                                                        className="p-2.5 text-stone-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modern Edit Modal */}
            {isEditModalOpen && editingItem && (
                <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-3xl font-black text-stone-800">Editar Entidade</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
                                    <Plus className="w-8 h-8 rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={saveEdit} className="space-y-6">
                                {activeTab === 'users' ? (
                                    <>
                                        <EditField label="E-mail Corporativo" value={editingItem.email} onChange={(v) => setEditingItem({ ...editingItem, email: v })} />
                                        <div>
                                            <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">Nível de Acesso</label>
                                            <select
                                                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-primary/10 font-bold text-stone-700"
                                                value={editingItem.role}
                                                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                                            >
                                                <option value="owner">Tutor (Owner)</option>
                                                <option value="provider">Prestador (Provider)</option>
                                                <option value="global_admin">Administrador Global</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <EditField label="Nome da Entidade" value={editingItem.name} onChange={(v) => setEditingItem({ ...editingItem, name: v })} />
                                        {(activeTab === 'services' || activeTab === 'accessories') && (
                                            <EditField label="Preço (R$)" value={editingItem.price?.toString() || ''} onChange={(v) => setEditingItem({ ...editingItem, price: parseFloat(v) || 0 })} />
                                        )}
                                        {activeTab === 'pets' && (
                                            <>
                                                <EditField label="Espécie" value={editingItem.species} onChange={(v) => setEditingItem({ ...editingItem, species: v })} />
                                                <EditField label="Cidade" value={editingItem.city || ''} onChange={(v) => setEditingItem({ ...editingItem, city: v })} />
                                            </>
                                        )}
                                        {activeTab === 'accessories' && (
                                            <EditField label="Categoria" value={editingItem.category || ''} onChange={(v) => setEditingItem({ ...editingItem, category: v })} />
                                        )}
                                        <EditField label="Descrição" value={editingItem.description || ''} onChange={(v) => setEditingItem({ ...editingItem, description: v })} />
                                    </>
                                )}

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        Confirmar Alterações <ArrowRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function EditField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    return (
        <div>
            <label className="block text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">{label}</label>
            <input
                type="text"
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-4 focus:ring-primary/10 font-bold text-stone-700 transition-all"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function CompactMetricCard({ label, value, trend, icon, color, progress }: { label: string, value: number, trend: string, icon: React.ReactNode, color: string, progress: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[36px] shadow-xl shadow-stone-200/50 border border-stone-100 flex flex-col justify-between"
        >
            <div className="flex items-start justify-between mb-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
                    {icon}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-stone-800">{value}</span>
                    <span className="text-[10px] font-black text-green-500 uppercase">{trend}</span>
                </div>
            </div>

            <div>
                <span className="text-sm font-bold text-stone-500 mb-3 block">{label}</span>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        className={cn("h-full rounded-full", color)}
                    />
                </div>
            </div>
        </motion.div>
    );
}

function TabButton({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                active
                    ? 'bg-white text-primary shadow-lg shadow-stone-200 ring-1 ring-stone-100'
                    : 'text-stone-400 hover:text-stone-600'
            )}
        >
            {children}
        </button>
    );
}
