import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.log('--- Iniciando Seed de Dados ---');

  const areas = [
    'Banco de Dados',
    'Inteligência Artificial',
    'Engenharia de Software',
    'Redes de Computadores',
    'Segurança da Informação',
    'Sistemas Distribuídos',
    'Interação Humano-Computador'
  ];

  console.log('-> Cadastrando áreas...');
  for (const nome of areas) {
    await db.area.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const senhaHash = await bcrypt.hash('admin123', 10);
  
  console.log('-> Cadastrando administrador padrão...');
  await db.usuario.upsert({
    where: { email: 'admin@ufla.br' },
    update: {},
    create: {
      nome: 'Admin',
      sobrenome: 'Sistema',
      email: 'admin@ufla.br',
      senha: senhaHash,
      role: 'ADMIN_GERAL',
    },
  });

  console.log('--- Seed finalizado com sucesso! ---');
}

main()
  .catch((e) => {
    console.error('Erro no Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });