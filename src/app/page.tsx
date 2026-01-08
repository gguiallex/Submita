import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Sistema de Submissão de Artigos</h1>
      <p className="mb-4">Gerencie eventos, artigos e revisores.</p>
      <Link href="/eventos" className="bg-blue-500 text-white p-2 rounded">
        Ver Eventos
      </Link>
    </div>
  );
}
