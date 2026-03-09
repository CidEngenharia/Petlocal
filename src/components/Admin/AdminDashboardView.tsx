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
    Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AdminData } from '../../types';

export default function AdminDashboardView() {
    const [data, setData] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'users' | 'pets' | 'services' | 'accessories'>('users');

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

        // Pets Table
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Lista de Animais', 20, 20);
        doc.autoTable({
            startY: 25,
            head: [['ID', 'Nome', 'Espécie', 'Raça', 'Dono']],
            body: data.data.pets.map(p => [p.id, p.name, p.species, p.breed || '-', p.owner.email]),
        });

        // Services Table
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Lista de Serviços', 20, 20);
        doc.autoTable({
            startY: 25,
            head: [['ID', 'Nome', 'Tipo', 'Preço', 'Prestador']],
            body: data.data.services.map(s => [s.id, s.name, s.type, `R$ ${s.price.toFixed(2)}`, s.provider.email]),
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
                <p className="text-stone-500 font-medium">Carregando dados globais do sistema...</p>
            </div>
        );
    }

    const filteredData = () => {
        if (!data) return [];
        const source = data.data[activeTab];
        return source.filter((item: any) => {
            const searchStr = searchTerm.toLowerCase();
            if (activeTab === 'users') return item.email.toLowerCase().includes(searchStr);
            if (activeTab === 'pets') return item.name.toLowerCase().includes(searchStr) || item.owner.email.toLowerCase().includes(searchStr);
            return item.name.toLowerCase().includes(searchStr);
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-[#004010] mb-2">Painel de Gestão Global</h1>
                    <p className="text-stone-600">Visão geral de todos os dados do sistema PetLocal</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={generatePDF}
                        className="flex items-center gap-2 bg-white text-stone-700 px-4 py-2.5 rounded-xl border border-stone-200 hover:border-primary/30 hover:bg-stone-50 transition-all font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Gerar PDF
                    </button>
                    <button
                        onClick={exportToWhatsApp}
                        className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-xl hover:bg-[#20ba5a] transition-all font-medium shadow-lg shadow-[#25D366]/20"
                    >
                        <Share2 className="w-4 h-4" />
                        WhatsApp
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
                <StatCard icon={<Users className="w-6 h-6 text-blue-600" />} label="Usuários" value={data?.stats.users || 0} color="bg-blue-50" />
                <StatCard icon={<Dog className="w-6 h-6 text-orange-600" />} label="Animais" value={data?.stats.pets || 0} color="bg-orange-50" />
                <StatCard icon={<Briefcase className="w-6 h-6 text-purple-600" />} label="Serviços" value={data?.stats.services || 0} color="bg-purple-50" />
                <StatCard icon={<ShoppingBag className="w-6 h-6 text-pink-600" />} label="Produtos" value={data?.stats.accessories || 0} color="bg-pink-50" />
                <StatCard icon={<FileText className="w-6 h-6 text-green-600" />} label="Documentos" value={data?.stats.documents || 0} color="bg-green-50" />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                <div className="p-6 border-b border-stone-100">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between">
                        <div className="flex p-1 bg-stone-100 rounded-2xl w-fit">
                            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Usuários</TabButton>
                            <TabButton active={activeTab === 'pets'} onClick={() => setActiveTab('pets')}>Animais</TabButton>
                            <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')}>Serviços</TabButton>
                            <TabButton active={activeTab === 'accessories'} onClick={() => setActiveTab('accessories')}>Acessórios</TabButton>
                        </div>

                        <div className="relative flex-grow max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-stone-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-stone-50/50 border-b border-stone-100">
                                <th className="px-6 py-4 text-sm font-semibold text-stone-500">
                                    {activeTab === 'users' ? 'Usuário' : 'Nome'}
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-stone-500">
                                    {activeTab === 'users' ? 'Cargo' : activeTab === 'pets' ? 'Espécie/Raça' : 'Preço/Tipo'}
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-stone-500">Dono/Fornecedor</th>
                                <th className="px-6 py-4 text-sm font-semibold text-stone-500 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {filteredData().map((item: any) => (
                                <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-stone-200 flex-shrink-0 overflow-hidden">
                                                {item.photoUrl ? (
                                                    <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                                                        {activeTab === 'users' ? <Users size={20} /> : <Dog size={20} />}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-stone-800">{activeTab === 'users' ? item.email : item.name}</div>
                                                {activeTab === 'users' && <div className="text-xs text-stone-500">ID: {item.id}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {activeTab === 'users' ? (
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${item.role === 'global_admin' ? 'bg-red-100 text-red-700' :
                                                    item.role === 'provider' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {item.role}
                                            </span>
                                        ) : (
                                            <div className="text-stone-600">
                                                {activeTab === 'pets' ? `${item.species} / ${item.breed || '-'}` :
                                                    activeTab === 'services' ? `R$ ${item.price.toFixed(2)} / ${item.type}` :
                                                        `R$ ${item.price.toFixed(2)}`}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-stone-600">
                                        {activeTab === 'users' ? (
                                            <div className="flex flex-col text-xs">
                                                <span>Pets: {item._count.pets}</span>
                                                <span>Serviços: {item._count.services}</span>
                                            </div>
                                        ) : (
                                            item.owner?.email || item.provider?.email || '-'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-white rounded-lg text-stone-400 hover:text-primary transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-lg shadow-stone-200/50 border border-stone-100"
        >
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-stone-800 mb-1">{value}</div>
            <div className="text-stone-500 text-sm font-medium">{label}</div>
        </motion.div>
    );
}

function TabButton({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${active
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
        >
            {children}
        </button>
    );
}
