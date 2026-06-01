import { prisma } from '@/shared/libs/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const user = await prisma.user.findUnique({
        where: { id: 1 }
    })
    return NextResponse.json(user)
}
