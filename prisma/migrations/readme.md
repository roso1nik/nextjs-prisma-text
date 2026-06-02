generator client {
  provider = "prisma-client"
  output   = "./generated"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  role      Role     @default(USER)

  orders    Order[]
  cart      Cart?
  reviews   Review[]
  likes     Like[]
}

model Product {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  price       Float
  brand       String
  category    Category
  sizes       Size[]
  colors      String[]
  stock       Int       @default(0)
  images      String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  orderItems  OrderItem[]
  reviews     Review[]
  likes       Like[]
}

enum Category {
  SNEAKERS
  BOOTS
  SANDALS
  LOAFERS
  HEELS
  SPORTS
}

enum Size {
  EU_36
  EU_37
  EU_38
  EU_39
  EU_40
  EU_41
  EU_42
  EU_43
  EU_44
  EU_45
}

model Cart {
  id        Int      @id @default(autoincrement())
  userId    Int      @unique
  user      User     @relation(fields: [userId], references: [id])
  items     CartItem[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CartItem {
  id        Int     @id @default(autoincrement())
  cartId    Int
  cart      Cart    @relation(fields: [cartId], references: [id])
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  size      Size
  quantity  Int     @default(1)
}

model Order {
  id          Int         @id @default(autoincrement())
  userId      Int
  user        User        @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  total       Float
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  address     String
  phone       String
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id])
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  size      Size
  quantity  Int
  price     Float
}

model Review {
  id        Int      @id @default(autoincrement())
  rating    Int
  comment   String?
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
}

model Like {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}

enum Role {
  USER
  ADMIN
}