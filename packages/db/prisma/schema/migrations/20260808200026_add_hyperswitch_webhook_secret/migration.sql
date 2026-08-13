-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "lineItems" JSONB;

-- AlterTable
ALTER TABLE "partner_integrations" ADD COLUMN     "webhookCiphertext" TEXT,
ADD COLUMN     "webhookIv" TEXT,
ADD COLUMN     "webhookLastFour" TEXT,
ADD COLUMN     "webhookTag" TEXT;
