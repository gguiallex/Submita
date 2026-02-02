import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Resolve o ID da URL

    const resultados = await prisma.artigo.findMany({
      where: { 
        edicaoId: Number(id) 
      },
      include: {
        autores: {
          include: { usuario: true }
        },
        atribuicoes: {
          include: {
            revisor: true,
            respostas: {
              include: {
                pergunta: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(resultados);
  } catch (error) {
    console.error("Erro na API de Resultados:", error);
    return NextResponse.json({ error: 'Erro ao buscar resultados' }, { status: 500 });
  }
}