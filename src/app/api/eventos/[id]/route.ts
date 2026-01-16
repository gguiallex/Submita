import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; 

    const evento = await prisma.evento.findUnique({
      where: { id: Number(id) },
      include: { 
        edicoes: {
          orderBy: {
            ano: 'desc' // Mostra os anos mais novos primeiro
          }
        } 
      },
    });

    if (!evento) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    return NextResponse.json(evento);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar evento' }, { status: 500 });
  }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = (await params).id;
        await prisma.evento.delete({
            where: {id: Number(id)},
        });
        return NextResponse.json({ message: 'Evento apagado com sucesso' });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao apagar evento' }, { status: 500 })
    }
}