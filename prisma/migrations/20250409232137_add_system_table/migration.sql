-- CreateTable
CREATE TABLE "System" (
    "id" SERIAL NOT NULL,
    "pointName" TEXT NOT NULL,
    "level" DOUBLE PRECISION NOT NULL,
    "hourly" TEXT NOT NULL,
    "CriticalLevel" BOOLEAN NOT NULL DEFAULT false,
    "LowLevel" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "System_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "System" ADD CONSTRAINT "System_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
