import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient(); 
async function main() { 
  const p = await prisma.category.findFirst({ where: { name: 'Beauty' } }); 
  console.log(JSON.stringify(p, null, 2)); 
} 
main().finally(() => prisma.$disconnect());
