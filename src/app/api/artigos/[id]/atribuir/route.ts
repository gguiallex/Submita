import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { revisorId } = await request.json();

    // Criar a atribuição no banco
    const atribuicao = await prisma.atribuicao.create({
      data: {
        artigoId: Number(id),
        usuarioId: Number(revisorId),
      },
    });

    // Mudar status do artigo para "EM_AVALIACAO" automaticamente
    await prisma.artigo.update({
      where: { id: Number(id) },
      data: { status: 'EM_AVALIACAO' }
    });

    return NextResponse.json(atribuicao, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atribuir revisor' }, { status: 500 });
  }
}