import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'



const prisma = new PrismaClient()
export const initialDump = async () => {
    try {

        const adminUser = await prisma.user.findUnique({ where: { email: 'admin@gmail.com' } });
        if (!adminUser) {
            const pass = await bcrypt.hash('adminpassword', 10)
            await prisma.user.create({
                data: {
                  email: 'admin@gmail.com',
                  name: 'admin',
                  password:pass,
                  role:'Admin',
                  photo:''
                },
              })
        }

        const defaultUser = await prisma.user.findUnique({ where: { email: 'user@gmail.com' } });
        if (!defaultUser) {
            const pass = await bcrypt.hash('1234', 10)
            await prisma.user.create({
                data: {
                  email: 'user@gmail.com',
                  name: 'Alan Leonel Medina',
                  password:pass,
                  role:'Admin',
                  photo:'/admin.jpg'
                },
              })
        }
    } catch (error) {
        console.error('Error al inicializar el usuario administrador:', error);
    }
}

