Отличная шпаргалка! Вот все основные методы Prisma для REST API:

## 📚 Prisma CRUD Шпаргалка

### 1. **CREATE (Создание)**

```typescript
// Создать одну запись
const user = await prisma.user.create({
    data: {
        name: 'Иван',
        email: 'ivan@example.com',
        age: 25
    }
})

// Создать несколько записей
const users = await prisma.user.createMany({
    data: [
        { name: 'Анна', email: 'anna@example.com' },
        { name: 'Петр', email: 'petr@example.com' }
    ],
    skipDuplicates: true // пропустить дубликаты
})

// Создать с вложенными связями
const userWithPosts = await prisma.user.create({
    data: {
        name: 'Мария',
        email: 'maria@example.com',
        posts: {
            create: [
                { title: 'Первый пост', content: 'Привет!' },
                { title: 'Второй пост', content: 'Привет снова!' }
            ]
        }
    }
})
```

### 2. **READ (Чтение)**

```typescript
// Найти все записи
const users = await prisma.user.findMany()

// Найти по ID
const user = await prisma.user.findUnique({
    where: { id: 1 }
})

// Найти по уникальному полю
const user = await prisma.user.findUnique({
    where: { email: 'ivan@example.com' }
})

// Найти первую подходящую
const user = await prisma.user.findFirst({
    where: { age: { gt: 18 } },
    orderBy: { createdAt: 'desc' }
})

// Фильтрация
const users = await prisma.user.findMany({
    where: {
        AND: [{ age: { gte: 18 } }, { age: { lte: 65 } }],
        OR: [{ name: { contains: 'ан' } }, { email: { startsWith: 'a' } }],
        NOT: { email: { endsWith: 'spam.com' } }
    }
})

// Пагинация
const users = await prisma.user.findMany({
    skip: 0, // сколько пропустить
    take: 10, // сколько взять
    orderBy: { createdAt: 'desc' }
})

// Курсорная пагинация
const users = await prisma.user.findMany({
    cursor: { id: 100 },
    take: 10
})

// Выбрать конкретные поля
const users = await prisma.user.findMany({
    select: {
        id: true,
        name: true,
        email: true,
        posts: {
            select: { title: true }
        }
    }
})

// Исключить поля
const users = await prisma.user.findMany({
    omit: {
        email: true, // не возвращать email
        password: true // не возвращать пароль
    }
})

// Включить связанные данные
const user = await prisma.user.findUnique({
    where: { id: 1 },
    include: {
        posts: true,
        likes: {
            include: { post: true }
        }
    }
})
```

### 3. **UPDATE (Обновление)**

```typescript
// Обновить одну запись
const user = await prisma.user.update({
    where: { id: 1 },
    data: { age: 26 }
})

// Обновить или создать
const user = await prisma.user.upsert({
    where: { email: 'ivan@example.com' },
    update: { age: 26 },
    create: {
        name: 'Иван',
        email: 'ivan@example.com',
        age: 25
    }
})

// Обновить несколько записей
const result = await prisma.user.updateMany({
    where: { age: { lt: 18 } },
    data: { isAdult: false }
})

// Инкремент/декремент
const user = await prisma.user.update({
    where: { id: 1 },
    data: { views: { increment: 1 } }
})
// Еще: decrement, multiply, divide, set

// Обновить вложенные связи
const user = await prisma.user.update({
    where: { id: 1 },
    data: {
        posts: {
            create: [{ title: 'Новый пост' }],
            delete: { id: 5 },
            update: {
                where: { id: 3 },
                data: { title: 'Обновленный пост' }
            }
        }
    }
})
```

### 4. **DELETE (Удаление)**

```typescript
// Удалить одну запись
const user = await prisma.user.delete({
    where: { id: 1 }
})

// Удалить несколько записей
const result = await prisma.user.deleteMany({
    where: { isActive: false }
})

// Удалить все записи (осторожно!)
const result = await prisma.user.deleteMany({})

// Удалить с проверкой существования
const user = await prisma.user.findUnique({
    where: { id: 1 }
})
if (user) {
    await prisma.user.delete({ where: { id: 1 } })
}
```

### 5. **AGGREGATIONS (Агрегации)**

```typescript
// Статистика
const stats = await prisma.user.aggregate({
    _count: { id: true },
    _avg: { age: true },
    _sum: { views: true },
    _min: { age: true },
    _max: { age: true },
    where: { isActive: true }
})

// Группировка
const groupBy = await prisma.user.groupBy({
    by: ['city', 'isActive'],
    _count: { id: true },
    _avg: { age: true },
    having: {
        age: { _avg: { gt: 25 } }
    }
})

// Количество записей
const count = await prisma.user.count({
    where: { isActive: true }
})
```

### 6. **RAW SQL (Сырой SQL)**

```typescript
// Запрос с параметрами
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE age > ${18}
`

// Выполнить команду
await prisma.$executeRaw`
  UPDATE "User" SET "isActive" = true WHERE age > ${18}
`

// Транзакция
const result = await prisma.$transaction([
    prisma.user.create({ data: { name: 'John' } }),
    prisma.profile.create({ data: { bio: 'Hello' } })
])

// Интерактивная транзакция
await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { name: 'John' } })
    await tx.profile.create({ data: { userId: user.id } })
    return user
})
```

### 7. **ПОЛЕЗНЫЕ ОПЕРАТОРЫ**

```typescript
// Строковые
where: {
  name: { contains: 'ван', mode: 'insensitive' }, // содержит
  name: { startsWith: 'И' },  // начинается с
  name: { endsWith: 'н' },    // заканчивается на
  name: { equals: 'Иван' },   // равно
  name: { in: ['Иван', 'Петр'] }, // в массиве
}

// Числовые
where: {
  age: { gt: 18 },   // greater than
  age: { gte: 18 },  // greater than or equal
  age: { lt: 65 },   // less than
  age: { lte: 65 },  // less than or equal
  age: { equals: 25 },
  age: { in: [18, 25, 30] },
}

// Boolean
where: {
  isActive: true,
  isAdmin: false,
}

// DateTime
where: {
  createdAt: { gte: new Date('2024-01-01') },
  createdAt: { lte: new Date() },
}
```

### 8. **СОРТИРОВКА И ВЫБОРКА**

```typescript
// Сортировка
const users = await prisma.user.findMany({
    orderBy: {
        age: 'desc', // asc или desc
        name: 'asc'
    }
})

// Сортировка по нескольким полям
const users = await prisma.user.findMany({
    orderBy: [{ age: 'desc' }, { name: 'asc' }]
})

// Различные значения
const distinctAges = await prisma.user.findMany({
    select: { age: true },
    distinct: ['age']
})
```

### 9. **ГОТОВЫЕ ENDPOINTS ДЛЯ REST API**

```typescript
// GET /users
app.get('/users', async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const users = await prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: { posts: true }
    })
    res.json(users)
})

// GET /users/:id
app.get('/users/:id', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
        include: { posts: true }
    })
    res.json(user)
})

// POST /users
app.post('/users', async (req, res) => {
    const user = await prisma.user.create({
        data: req.body
    })
    res.json(user)
})

// PUT /users/:id
app.put('/users/:id', async (req, res) => {
    const user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: req.body
    })
    res.json(user)
})

// DELETE /users/:id
app.delete('/users/:id', async (req, res) => {
    await prisma.user.delete({
        where: { id: Number(req.params.id) }
    })
    res.status(204).send()
})

// PATCH /users/:id
app.patch('/users/:id', async (req, res) => {
    const user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: req.body
    })
    res.json(user)
})
```

## 🔥 БЫСТРЫЙ СТАРТ ДЛЯ ВАШЕЙ МОДЕЛИ

```typescript
// likes.controller.ts
const likeService = {
    // Создать лайк
    create: async (userId: number) => {
        return await prisma.like.create({
            data: { userId }
        })
    },

    // Получить все лайки
    findAll: async () => {
        return await prisma.like.findMany({
            include: { user: true }
        })
    },

    // Получить лайк по ID
    findOne: async (id: number) => {
        return await prisma.like.findUnique({
            where: { id },
            include: { user: true }
        })
    },

    // Удалить лайк
    remove: async (id: number) => {
        return await prisma.like.delete({
            where: { id }
        })
    },

    // Удалить все лайки пользователя
    removeByUser: async (userId: number) => {
        return await prisma.like.deleteMany({
            where: { userId }
        })
    }
}
```

Сохраните эту шпаргалку - она пригодится для 95% задач! 🚀
