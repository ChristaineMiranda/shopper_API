import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function findProductByCode(code: number) {
    return await prisma.products.findUnique({
        where: { code }
    });
}

async function findByPackId(pack_id: number) {

    return await prisma.packs.findMany({
        where: { pack_id }
    });
}

async function findPackByProductId(product_id: number) {
    return await prisma.packs.findFirst({
        where: { product_id }
    });
}

async function updateProduct(code: number, sales_price: number) {
    return await prisma.products.update({
        where: { code },
        data: { sales_price }
    });
}


const repository = {
    findProductByCode,
    findByPackId,
    findPackByProductId,
    updateProduct
}
export default repository;