import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { pdfFinalUrl } = await request.json();

    const artigoAtualizado = await prisma.artigo.update({
      where: { id: Number(id) },
      data: { 
        pdfFinalUrl,
        status: 'FINALIZADO' // Opcional: mudar status para indicar que o ciclo acabou
      },
    });

    return NextResponse.json(artigoAtualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao enviar versão final' }, { status: 500 });
  }
}