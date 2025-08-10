-- CreateEnum
CREATE TYPE "public"."BalanceTransactionType" AS ENUM ('ADD', 'SUBTRACT', 'PAYMENT_APPROVAL', 'TOPUP_APPROVAL', 'PURCHASE', 'REFUND');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE "public"."balance_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "public"."BalanceTransactionType" NOT NULL,
    "reason" TEXT NOT NULL,
    "previousBalance" DOUBLE PRECISION NOT NULL,
    "newBalance" DOUBLE PRECISION NOT NULL,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balance_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."balance_history" ADD CONSTRAINT "balance_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
