import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const artigos = await prisma.artigo.findMany({
      //include: { titulo: true },
    });
    return NextResponse.json(artigos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar artigos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { titulo, autores, resumo, areas, edicaoId, atribuicoes } = await request.json();
    const artigo = await prisma.artigo.create({
      data: { titulo, autores, resumo, areas, edicaoId, atribuicoes },
    });
    return NextResponse.json(artigo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar artigo' }, { status: 500 });
  }
}