/*
  Warnings:

  - You are about to drop the column `endTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Availability` table. All the data in the column will be lost.
  - Added the required column `endHour` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endMinute` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startHour` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMinute` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the new columns with nullable constraints
ALTER TABLE "Availability" ADD COLUMN "startHour" INTEGER;
ALTER TABLE "Availability" ADD COLUMN "startMinute" INTEGER;
ALTER TABLE "Availability" ADD COLUMN "endHour" INTEGER;
ALTER TABLE "Availability" ADD COLUMN "endMinute" INTEGER;

-- Update the new columns with data from the existing time columns
UPDATE "Availability"
SET 
    "startHour" = EXTRACT(HOUR FROM "startTime"),
    "startMinute" = EXTRACT(MINUTE FROM "startTime"),
    "endHour" = EXTRACT(HOUR FROM "endTime"),
    "endMinute" = EXTRACT(MINUTE FROM "endTime");

-- Make the new columns required
ALTER TABLE "Availability" ALTER COLUMN "startHour" SET NOT NULL;
ALTER TABLE "Availability" ALTER COLUMN "startMinute" SET NOT NULL;
ALTER TABLE "Availability" ALTER COLUMN "endHour" SET NOT NULL;
ALTER TABLE "Availability" ALTER COLUMN "endMinute" SET NOT NULL;

-- Drop the old columns
ALTER TABLE "Availability" DROP COLUMN "startTime";
ALTER TABLE "Availability" DROP COLUMN "endTime";
