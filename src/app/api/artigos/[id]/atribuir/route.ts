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
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Este revisor já está atribuído a este artigo.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');

    if (!usuarioId) return NextResponse.json({ error: 'Faltando ID do usuário' }, { status: 400 });

    await prisma.atribuicao.delete({
      where: {
        artigoId_usuarioId: {
          artigoId: Number(id),
          usuarioId: Number(usuarioId),
        },
      },
    });

    return NextResponse.json({ message: 'Removido com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 });
  }
}