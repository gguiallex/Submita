import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const { sigla, descricao } = await request.json();
    const evento = await prisma.evento.create({
      data: { sigla, descricao },
    });
    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 });
  }
}