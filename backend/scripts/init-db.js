const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    console.log('🚀 Inicializando banco de dados...');

    // Aplicar schema
    console.log('📊 Aplicando schema do banco...');
    
    // Criar usuário padrão se não existir
    const existingUser = await prisma.user.findUnique({
      where: { email: 'vendedor@teste.com' }
    });

    if (!existingUser) {
      console.log('👤 Criando usuário de teste...');
      const passwordHash = await bcrypt.hash('123456', 12);
      
      const user = await prisma.user.create({
        data: {
          name: 'Vendedor Teste',
          email: 'vendedor@teste.com',
          passwordHash
        }
      });

      console.log('✅ Usuário criado:', user.email);

      // Criar alguns veículos de exemplo
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
          description: 'Honda Civic em excelente estado de conservação. Único dono, sempre revisado na concessionária.',
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
          description: 'Toyota Corolla XEi em perfeito estado. Revisões em dia, pneus novos, documento ok.',
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
          description: 'Jetta TSI com motor turbo, economia de combustível e performance.',
          plate: 'GHI9012'
        }
      ];

      for (const vehicleData of vehicles) {
        const slug = vehicleData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

        await prisma.vehicle.create({
          data: {
            userId: user.id,
            slug,
            ...vehicleData
          }
        });

        console.log('✅ Veículo criado:', vehicleData.title);
      }
    } else {
      console.log('👤 Usuário já existe:', existingUser.email);
    }

    console.log('🎉 Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
