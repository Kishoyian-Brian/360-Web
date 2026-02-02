-- Add admin-only download password to orders
ALTER TABLE "orders" ADD COLUMN "downloadPassword" TEXT;
