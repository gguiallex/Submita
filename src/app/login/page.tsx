'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Importe o hook useAuth

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const router = useRouter();
    
    // Pegamos a função login do contexto
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha }),
        });

        if (res.ok) {
            const usuario = await res.json();
            
            // 1. Usamos a função login do contexto. 
            // Ela já salva no localStorage e avisa a Navbar na hora!
            login(usuario); 
            
            // 2. Redirecionamos para a home
            router.push('/');
        } else {
            setErro('E-mail ou senha incorretos.');
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
                <h2 className="text-center text-3xl font-bold text-gray-900">Acessar Sistema</h2>

                {erro && <p className="text-center text-sm text-red-600 bg-red-50 p-2 rounded">{erro}</p>}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}