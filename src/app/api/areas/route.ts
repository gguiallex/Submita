import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET() {
    try {
        const areas = await prisma.area.findMany({
            orderBy: {
                nome: 'asc'
            }
        });

        return NextResponse.json(areas);
    } catch (error) {
        console.error("Erro ao buscar áreas: ", error);
        return NextResponse.json(
            { error: 'Erro ao carregar áreas acadêmicas' },
            { status: 500 }
        ); 
    }
}