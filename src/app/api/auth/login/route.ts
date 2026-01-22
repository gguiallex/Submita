import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request:Request) {
    try {
        const { email, senha } = await request.json();

        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if(usuario) {
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

            if(!senhaCorreta) {
                return NextResponse.json(
                    { error: 'Senha inválida' },
                    { status: 401 }
                );
            }

            const { senha: _, ...dadosPublicos } = usuario;

            return NextResponse.json(dadosPublicos);
        } else {
            return NextResponse.json(
                { error: "Email inválido" },
                { status: 401 }
            )
        }
    } catch (error) {
        console.error("Erro no login: ", error);
        return NextResponse.json(
            { error: 'Erro interno no servidor' },
            { status: 500 }
        );
    }
}