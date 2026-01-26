'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Corrigido: navigation em vez de router
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ nome: '', sobrenome: '', email: '', senha: '' });
    const [erro, setErro] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        const payload = {
            nome: formData.nome,
            sobrenome: formData.sobrenome,
            email: formData.email,
            senha: formData.senha
        };

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                // Redireciona com mensagem de sucesso
                router.push('/login?success=true'); 
            } else {
                const data = await res.json();
                setErro(data.error || 'Erro ao criar conta.');
            }
        } catch (error) {
            setErro('Erro de conexão com o servidor.');
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-800">Criar Conta</h2>
                    <p className="text-slate-500 text-sm mt-2">Cadastre-se para submeter seus trabalhos</p>
                </div>

                {erro && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 animate-pulse">
                        {erro}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-900 mb-1 ml-1">Nome</label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="João"
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-700 mb-1 ml-1">Sobrenome</label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Silva"
                                onChange={(e) => setFormData({ ...formData, sobrenome: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">E-mail Institucional</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="exemplo@ufla.br"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Senha</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Mínimo 6 caracteres"
                            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full rounded-xl bg-slate-900 py-4 text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]"
                    >
                        CRIAR MINHA CONTA
                    </button>
                </form>

                <div className="pt-4 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        Já possui cadastro? <Link href="/login" className="text-blue-600 font-bold hover:underline">Acesse aqui</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}