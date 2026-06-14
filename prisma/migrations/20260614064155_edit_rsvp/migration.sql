/*
  Warnings:

  - You are about to drop the column `is_present` on the `EventRsvp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventRsvp" DROP COLUMN "is_present",
ADD COLUMN     "att_count" INTEGER NOT NULL DEFAULT 0;
