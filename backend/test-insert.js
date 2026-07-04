const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const newCourse = await prisma.course.create({
      data: {
        code: '001',
        name: 'compuer science',
        durationYears: parseInt('4'),
        description: 'like to java'
      }
    });
    console.log(newCourse);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
