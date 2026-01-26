import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Use a instância global que você já tem

export async function GET() {
  try {
    const artigos = await prisma.artigo.findMany({
      include: {
        areas: { include: { area: true } }, // Inclui os nomes das áreas
        autores: { include: { usuario: true } } // Inclui os nomes dos autores
      }
    });
    return NextResponse.json(artigos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar artigos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { titulo, resumo, areas, edicaoId, usuarioId } = await request.json();

    // O Prisma exige que relacionamentos N:N sejam criados assim:
    const artigo = await prisma.artigo.create({
      data: {
        titulo,
        resumo,
        edicaoId: Number(edicaoId),
        // Criando o vínculo na tabela ArtigoArea
        areas: {
          create: areas.map((areaId: number) => ({
            areaId: areaId
          }))
        },
        // Criando o vínculo na tabela ArtigoAutor
        autores: {
          create: {
            usuarioId: usuarioId,
            ordem: 1 // O usuário que submeteu é o primeiro autor
          }
        }
      },
    });

    return NextResponse.json(artigo, { status: 201 });
  } catch (error) {
    console.error("ERRO NO PRISMA:", error);
    return NextResponse.json({ error: 'Erro ao criar artigo' }, { status: 500 });
  }
}