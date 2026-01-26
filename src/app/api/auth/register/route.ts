import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const {nome, sobrenome, email, senha } = await request.json();

        const usuarioExistente = await prisma.usuario.findUnique({
            where: { email },
        });

        if (usuarioExistente) {
            return NextResponse.json(
                { error: 'Este e-mail já está cadastrado.' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                sobrenome: sobrenome,
                email,
                senha: hashedPassword,
                role: 'AUTOR',
            },
        });

        const { senha: _, ...dadosPublicos } = novoUsuario;
        return NextResponse.json(dadosPublicos, { status: 201 });
    } catch (error) {
        console.log("Erro ao tentar criar usuário.", error);
        return NextResponse.json(
            { error: 'Erro ao criar conta. ' },
            { status: 500 }
        );
    }
}
