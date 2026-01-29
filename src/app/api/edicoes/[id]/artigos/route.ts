import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Tipado como Promise
) {
  const { searchParams } = new URL(request.url);
  const usuarioId = searchParams.get('usuarioId');
  
  // No Next.js 15+, o params deve ser aguardado antes do uso
  const resolvedParams = await params;
  const edicaoId = Number(resolvedParams.id);

  try {
    const artigos = await prisma.artigo.findMany({
      where: {
        edicaoId: edicaoId,
        ...(usuarioId && {
          autores: {
            some: { 
              usuarioId: Number(usuarioId) 
            }
          }
        })
      },
      include: {
        areas: {
          include: { area: true }
        },
        autores: {
          include: { usuario: true }
        },
        atribuicoes: true
      },
      orderBy: { id: 'desc' }
    });

    // Garante que o retorno seja um array, mesmo se vazio
    return NextResponse.json(artigos || []);
    
  } catch (error) {
    console.error("Erro interno na API de artigos:", error);
    // IMPORTANTE: Retornar array vazio em caso de erro para não quebrar o frontend
    return NextResponse.json([], { status: 500 });
  }
}