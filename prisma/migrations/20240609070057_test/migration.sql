/*
  Warnings:

  - Added the required column `assignmentParagraph` to the `AssignmentSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignmentSubmission" ADD COLUMN     "assignmentParagraph" TEXT NOT NULL;
