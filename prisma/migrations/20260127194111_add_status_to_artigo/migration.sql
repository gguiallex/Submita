-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artigo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "edicaoId" INTEGER NOT NULL,
    CONSTRAINT "Artigo_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "EdicaoEvento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Artigo" ("edicaoId", "id", "pdfUrl", "resumo", "titulo") SELECT "edicaoId", "id", "pdfUrl", "resumo", "titulo" FROM "Artigo";
DROP TABLE "Artigo";
ALTER TABLE "new_Artigo" RENAME TO "Artigo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
