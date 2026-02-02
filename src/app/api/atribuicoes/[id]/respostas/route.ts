import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Este id é o atribuicaoId
    const { respostas } = await request.json(); // Objeto { "1": "4", "2": "comentário" }

    // Usamos uma transação para garantir que ou salva tudo ou não salva nada
    const operacoes = Object.entries(respostas).map(([perguntaId, valor]) => {
      return prisma.resposta.upsert({
        where: {
          atribuicaoId_perguntaId: {
            atribuicaoId: Number(id),
            perguntaId: Number(perguntaId),
          },
        },
        update: { resposta: String(valor) },
        create: {
          atribuicaoId: Number(id),
          perguntaId: Number(perguntaId),
          resposta: String(valor),
        },
      });
    });

    await prisma.$transaction(operacoes);

    // Opcional: Se todas as perguntas da edição foram respondidas, 
    // podemos marcar o status do artigo como "AVALIADO"
    const atribuicao = await prisma.atribuicao.findUnique({
      where: { id: Number(id) },
      include: { artigo: true }
    });

    if (atribuicao) {
      await prisma.artigo.update({
        where: { id: atribuicao.artigoId },
        data: { status: 'AVALIADO' }
      });
    }

    return NextResponse.json({ message: 'Avaliação salva com sucesso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao salvar respostas' }, { status: 500 });
  }
}