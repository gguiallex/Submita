/*
  Warnings:

  - You are about to drop the `Revisor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `areas` on the `Artigo` table. All the data in the column will be lost.
  - You are about to drop the column `autores` on the `Artigo` table. All the data in the column will be lost.
  - You are about to drop the column `revisorId` on the `Atribuicao` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `Atribuicao` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Revisor";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Area" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ArtigoArea" (
    "artigoId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,

    PRIMARY KEY ("artigoId", "areaId"),
    CONSTRAINT "ArtigoArea_artigoId_fkey" FOREIGN KEY ("artigoId") REFERENCES "Artigo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtigoArea_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Autoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artigoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,
    CONSTRAINT "Autoria_artigoId_fkey" FOREIGN KEY ("artigoId") REFERENCES "Artigo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Autoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artigo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "edicaoId" INTEGER NOT NULL,
    CONSTRAINT "Artigo_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "EdicaoEvento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Artigo" ("edicaoId", "id", "pdfUrl", "resumo", "titulo") SELECT "edicaoId", "id", "pdfUrl", "resumo", "titulo" FROM "Artigo";
DROP TABLE "Artigo";
ALTER TABLE "new_Artigo" RENAME TO "Artigo";
CREATE TABLE "new_Atribuicao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artigoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Atribuicao_artigoId_fkey" FOREIGN KEY ("artigoId") REFERENCES "Artigo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Atribuicao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Atribuicao" ("artigoId", "id") SELECT "artigoId", "id" FROM "Atribuicao";
DROP TABLE "Atribuicao";
ALTER TABLE "new_Atribuicao" RENAME TO "Atribuicao";
CREATE UNIQUE INDEX "Atribuicao_artigoId_usuarioId_key" ON "Atribuicao"("artigoId", "usuarioId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Area_nome_key" ON "Area"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Autoria_artigoId_usuarioId_key" ON "Autoria"("artigoId", "usuarioId");
