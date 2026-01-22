'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Importe o seu novo hook

export default function Navbar() {
  // Pegamos o usuário e a função de logout diretamente do contexto
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Home - Usando Link do Next para não recarregar a página */}
          <Link href="/">
            <div className="flex items-center gap-3">
              <img src="/iconeSubmita.png" alt="Submita" className="w-10 h-10" />
              <span className="text-2xl font-bold text-blue-600">Submita</span>
            </div>
          </Link>

          {/* Menu Desktop e Mobile */}
          <div className="flex items-center space-x-4">
            <Link href="/eventos" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Eventos
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Botão visível apenas para Admin Geral */}
                {/*user.role === 'ADMIN_GERAL' && (
                  <Link href="/eventos/novo" className="hidden md:block bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    + Novo Evento
                  </Link>
                )*/}
                
                <span className="text-gray-700 text-sm hidden sm:block">
                  Olá, <strong>{user.nome}</strong>
                </span>

                <button
                  onClick={logout} // Chama o logout do Contexto
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}