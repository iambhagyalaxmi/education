import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.galleryImage.count();
  console.log('GalleryImage count in DB:', count);
  if (count > 0) {
    const images = await prisma.galleryImage.findMany({ take: 5 });
    console.log(images);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
