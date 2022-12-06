import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/// Número aleatorio con extremos incluidos
function random(mn: number, mx: number) {
    return Math.floor(Math.random() * (mx - mn) + mn);
};

export async function nuevaFrase(msg: string) {
    await prisma.frases.create({ data: { mensaje: msg } });
    await prisma.$disconnect();
};

export async function fraseAleatoria() {
    const max = await prisma.frases.count({ where: {} });
    const resp = await prisma.frases.findUnique({ where: { id: random(1, max) } });
    await prisma.$disconnect();
    if (resp == null) {
        return { mensaje: "" }
    }
    else {
        return resp;
    }
};
