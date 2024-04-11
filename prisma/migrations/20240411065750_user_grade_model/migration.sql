/*
  Warnings:

  - You are about to drop the column `lessonId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the `AssignmentUploadedFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseGrade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `AssignmentSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `episodeId` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('ASSIGNNMENT', 'EPISODE');

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentUploadedFile" DROP CONSTRAINT "AssignmentUploadedFile_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "CourseGrade" DROP CONSTRAINT "CourseGrade_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseGrade" DROP CONSTRAINT "CourseGrade_userId_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseGrade" DROP CONSTRAINT "CourseGrade_userId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_episodeId_fkey";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "lessonId",
ADD COLUMN     "episodeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AssignmentSubmission" ADD COLUMN     "id" SERIAL NOT NULL;

-- DropTable
DROP TABLE "AssignmentUploadedFile";

-- DropTable
DROP TABLE "CourseGrade";

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "status" "GradeStatus" NOT NULL DEFAULT 'NORMAL',
    "value" INTEGER NOT NULL DEFAULT 40,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedFile" (
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "pathname" TEXT NOT NULL,
    "episodeId" INTEGER,
    "type" "FileType" NOT NULL,
    "userId" INTEGER,
    "assignmentSubmissionUserId" INTEGER,
    "assignmentSubmissionAssignmentId" INTEGER,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_id_key" ON "Grade"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_userId_key" ON "Grade"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UploadedFile_pathname_key" ON "UploadedFile"("pathname");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSubmission_id_key" ON "AssignmentSubmission"("id");

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_assignmentSubmissionUserId_assignmentSubmissi_fkey" FOREIGN KEY ("assignmentSubmissionUserId", "assignmentSubmissionAssignmentId") REFERENCES "AssignmentSubmission"("userId", "assignmentId") ON DELETE SET NULL ON UPDATE CASCADE;
