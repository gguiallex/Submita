import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// LISTAR PERGUNTAS DA EDIÇÃO
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const perguntas = await prisma.pergunta.findMany({
    where: { edicaoId: Number(id) }
  });
  return NextResponse.json(perguntas);
}

// ADICIONAR NOVA PERGUNTA
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { texto, tipo } = await req.json();

  const nova = await prisma.pergunta.create({
    data: {
      texto,
      tipo,
      edicaoId: Number(id)
    }
  });
  return NextResponse.json(nova, { status: 201 });
}

// REMOVER PERGUNTA
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const perguntaId = searchParams.get('perguntaId');

  await prisma.pergunta.delete({
    where: { id: Number(perguntaId) }
  });
  return NextResponse.json({ message: 'Removida' });
}