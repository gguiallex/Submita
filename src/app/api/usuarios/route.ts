import prisma from '@/lib/prisma';
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    try {
        const { nome, sobrenome, email, senha } = await request.json();

        const usuarioExistente = await prisma.usuario.findUnique({
            where: { email }
        });

        if(usuarioExistente) {
            return NextResponse.json(
                { error: 'Este e-amil já está cadastrado.' }, { status: 400 }
            );
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                sobrenome,
                email,
                senha: senhaCriptografada,
                role: "USER"
            }
        });

        const { senha: _, ...usuarioSemSenha } = novoUsuario;
        return NextResponse.json(usuarioSemSenha);
    } catch (error) {
        console.error("Erro no cadastro:", error);
        return NextResponse.json(
            { error: 'Erro ao criar conta.' },
            { status: 500 }
        );
    }
}