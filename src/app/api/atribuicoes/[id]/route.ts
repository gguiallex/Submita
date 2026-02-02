import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const atribuicao = await prisma.atribuicao.findUnique({
      where: { id: Number(id) },
      include: {
        artigo: {
          include: {
            edicao: {
              include: { perguntas: true }
            }
          }
        },
        respostas: true // Traz respostas antigas caso ele esteja editando
      }
    });

    if (!atribuicao) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

    return NextResponse.json(atribuicao);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}