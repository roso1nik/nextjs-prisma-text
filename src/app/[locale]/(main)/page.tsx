import { prisma } from '@/shared/libs/prisma'
import { Button } from '@mantine/core'

const HomePage = async () => {
    const user = await prisma.user.findUnique({
        where: { id: 1 },
        include: { likes: true }
    })

    return (
        <div className="flex flex-col gap-5">
            <h1>hello world</h1>
            {user && (
                <div>
                    <p>User: {user.name}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
            <Button>Test</Button>
        </div>
    )
}

export default HomePage
