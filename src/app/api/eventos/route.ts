import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      include: { edicoes: true },
    });
    return NextResponse.json(eventos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sigla, descricao, usuarioId } = await request.json();

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuario || usuario.role !== 'ADMIN_GERAL') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    if (!sigla || !descricao) {
      return NextResponse.json({ error: 'Sigla e descrição são obrigatórios' }, { status: 400 });
    }

    const evento = await prisma.evento.create({
      data: { sigla, descricao },
    });

    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 });
  }
}