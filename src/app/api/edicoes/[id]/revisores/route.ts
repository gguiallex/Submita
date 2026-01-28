import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Busca usuários que tenham vínculo de REVISOR nesta edição
    const revisores = await prisma.vinculoEdicao.findMany({
      where: {
        edicaoId: Number(id),
        tipo: 'REVISOR'
      },
      include: {
        usuario: true
      }
    });

    return NextResponse.json(revisores.map((v: any) => v.usuario));
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar revisores' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email } = await request.json();

    // 1. Verificar se o usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // 2. Criar o vínculo de revisor
    const vinculo = await prisma.vinculoEdicao.create({
      data: {
        usuarioId: usuario.id,
        edicaoId: Number(id),
        tipo: 'REVISOR'
      }
    });

    return NextResponse.json(vinculo, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Este usuário já é revisor desta edição' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro ao vincular revisor' }, { status: 500 });
  }
}