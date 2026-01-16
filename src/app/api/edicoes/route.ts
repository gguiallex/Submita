import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        const edicao = await prisma.edicaoEvento.findUnique({
            where: { id: Number(id) },
            include: {
                evento: true,
            },
        });

        if (!edicao) {
            return NextResponse.json({ error: 'Edição não encontrada' }, { status: 404});
        }

        return NextResponse.json(edicao);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar edição' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { ano, eventoId } = await request.json();

        const novaEdicao = await prisma.edicaoEvento.create({
            data: {
                ano: parseInt(ano),
                eventoId: Number(eventoId),
            },
        });

        return NextResponse.json(novaEdicao);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Já existe uma edição cadastrada para este ano neste evento.' },
                { status: 400 }
            );
        }
        console.log(error);
        return NextResponse.json({ error: 'Erro ao criar edição' }, { status: 500 });
    }
}