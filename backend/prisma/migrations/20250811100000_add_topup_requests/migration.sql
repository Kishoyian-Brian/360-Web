-- CreateEnum
CREATE TYPE "TopupStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "topup_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "cryptoAccountId" TEXT NOT NULL,
    "status" "TopupStatus" NOT NULL DEFAULT 'PENDING',
    "paymentProofUrl" TEXT,
    "adminNotes" TEXT,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topup_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "topup_requests" ADD CONSTRAINT "topup_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topup_requests" ADD CONSTRAINT "topup_requests_cryptoAccountId_fkey" FOREIGN KEY ("cryptoAccountId") REFERENCES "crypto_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
