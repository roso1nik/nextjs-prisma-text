## GHUB_ADMIN_FRONTEND

DOCKER:

docker run -d --name test-postgre -e POSTGRES_PASSWORD=root -p 5432:5432 postgres:latest

PROD BUILD: npm run build && npm run start

PRISMA:

npx prisma init

npx prisma db pull

npx prisma migrate dev --name init

npx prisma generate
npx prisma studio
