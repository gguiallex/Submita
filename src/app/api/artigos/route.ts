import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

// LISTAR ARTIGOS
export async function GET() {
  try {
    const artigos = await prisma.artigo.findMany({
      include: {
        areas: { include: { area: true } },
        autores: { include: { usuario: true } }
      }
    });
    return NextResponse.json(artigos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar artigos' }, { status: 500 });
  }
}

// CRIAR ARTIGO COM PDF
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Capturando os dados do FormData
    const titulo = formData.get('titulo') as string;
    const resumo = formData.get('resumo') as string;
    const edicaoId = Number(formData.get('edicaoId'));
    const usuarioId = Number(formData.get('usuarioId'));
    const areasRaw = formData.get('areas') as string;
    const areas = JSON.parse(areasRaw); // As áreas vêm como string de array
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json({ error: "O arquivo PDF é obrigatório" }, { status: 400 });
    }

    // 1. SALVAR O ARQUIVO NO DISCO (public/uploads/artigos)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nome único para evitar conflitos
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'artigos', fileName);
    
    await writeFile(uploadPath, buffer);
    const pdfUrl = `/uploads/artigos/${fileName}`;

    // 2. SALVAR NO BANCO COM PRISMA
    const artigo = await prisma.artigo.create({
      data: {
        titulo,
        resumo,
        pdfUrl, // Link para o arquivo
        status: "PENDENTE",
        edicaoId: edicaoId,
        areas: {
          create: areas.map((areaId: number) => ({
            areaId: areaId
          }))
        },
        autores: {
          create: {
            usuarioId: usuarioId,
            ordem: 1
          }
        }
      },
    });

    return NextResponse.json(artigo, { status: 201 });

  } catch (error) {
    console.error("ERRO NA SUBMISSÃO:", error);
    return NextResponse.json({ error: 'Erro ao processar submissão' }, { status: 500 });
  }
}