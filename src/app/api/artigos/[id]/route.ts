import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const artigoAtualizado = await prisma.artigo.update({
      where: { id: Number(id) },
      data: { status: status },
    });

    return NextResponse.json(artigoAtualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar artigo' }, { status: 500 });
  }
}