-- CreateTable
CREATE TABLE "File" (
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "pathname" TEXT NOT NULL,
    "episodeId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_pathname_key" ON "File"("pathname");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
