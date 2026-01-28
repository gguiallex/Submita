import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ usuarioId: string }> }
) {
  try {
    const { usuarioId } = await params;

    const atribuicoes = await prisma.atribuicao.findMany({
      where: {
        usuarioId: Number(usuarioId)
      },
      include: {
        artigo: true,
        respostas: true // Para verificar se já foi avaliado
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(atribuicoes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao carregar tarefas' }, { status: 500 });
  }
}