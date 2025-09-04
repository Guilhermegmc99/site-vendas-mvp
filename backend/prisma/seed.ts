import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de teste
  const passwordHash = await bcrypt.hash('123456', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'vendedor@teste.com' },
    update: {},
    create: {
      name: 'Vendedor Teste',
      email: 'vendedor@teste.com',
      passwordHash
    }
  });

  console.log('✅ Usuário criado:', user.email);

  // Criar veículos de exemplo
  const vehicles = [
    {
      title: 'Honda Civic 2.0 EXL CVT',
      price: 95000,
      year: 2022,
      mileageKm: 25000,
      transmission: 'CVT',
      fuel: 'Flex',
      color: 'Branco Pérola',
      location: 'Goiânia, GO',
      description: 'Honda Civic em excelente estado de conservação. Único dono, sempre revisado na concessionária. Veículo impecável, sem detalhes.',
      plate: 'ABC1234'
    },
    {
      title: 'Toyota Corolla XEi 2.0 Automático',
      price: 89000,
      year: 2021,
      mileageKm: 35000,
      transmission: 'Automática',
      fuel: 'Flex',
      color: 'Prata',
      location: 'Goiânia, GO',
      description: 'Toyota Corolla XEi em perfeito estado. Revisões em dia, pneus novos, documento ok. Pronto para financiamento.',
      plate: 'DEF5678'
    },
    {
      title: 'Volkswagen Jetta TSI 1.4 Turbo',
      price: 72000,
      year: 2020,
      mileageKm: 45000,
      transmission: 'Automática',
      fuel: 'Gasolina',
      color: 'Azul Noturno',
      location: 'Goiânia, GO',
      description: 'Jetta TSI com motor turbo, economia de combustível e performance. Veículo bem cuidado, interior impecável.',
      plate: 'GHI9012'
    },
    {
      title: 'Hyundai HB20S 1.6 Comfort Plus',
      price: 58000,
      year: 2021,
      mileageKm: 28000,
      transmission: 'Manual',
      fuel: 'Flex',
      color: 'Vermelho',
      location: 'Goiânia, GO',
      description: 'HB20S sedã em excelente estado. Econômico, confiável e espaçoso. Ideal para família.',
      plate: 'JKL3456'
    },
    {
      title: 'Ford Ka SE 1.0 3 Cilindros',
      price: 42000,
      year: 2019,
      mileageKm: 38000,
      transmission: 'Manual',
      fuel: 'Flex',
      color: 'Branco',
      location: 'Goiânia, GO',
      description: 'Ford Ka SE em ótimo estado de conservação. Econômico e ágil para o dia a dia urbano.',
      plate: 'MNO7890'
    }
  ];

  for (const vehicleData of vehicles) {
    const slug = vehicleData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: user.id,
        slug,
        ...vehicleData
      }
    });

    console.log('✅ Veículo criado:', vehicle.title);
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
