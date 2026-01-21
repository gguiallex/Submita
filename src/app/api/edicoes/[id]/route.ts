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