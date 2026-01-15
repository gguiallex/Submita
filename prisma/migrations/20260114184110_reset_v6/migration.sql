-- CreateTable
CREATE TABLE "Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sigla" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EdicaoEvento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ano" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    CONSTRAINT "EdicaoEvento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Artigo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autores" JSONB NOT NULL,
    "resumo" TEXT NOT NULL,
    "areas" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "edicaoId" INTEGER NOT NULL,
    CONSTRAINT "Artigo_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "EdicaoEvento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Revisor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "areas" JSONB NOT NULL,
    "edicaoId" INTEGER NOT NULL,
    CONSTRAINT "Revisor_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "EdicaoEvento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Atribuicao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artigoId" INTEGER NOT NULL,
    "revisorId" INTEGER NOT NULL,
    CONSTRAINT "Atribuicao_artigoId_fkey" FOREIGN KEY ("artigoId") REFERENCES "Artigo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Atribuicao_revisorId_fkey" FOREIGN KEY ("revisorId") REFERENCES "Revisor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pergunta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "edicaoId" INTEGER NOT NULL,
    CONSTRAINT "Pergunta_edicaoId_fkey" FOREIGN KEY ("edicaoId") REFERENCES "EdicaoEvento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resposta" TEXT NOT NULL,
    "atribuicaoId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    CONSTRAINT "Resposta_atribuicaoId_fkey" FOREIGN KEY ("atribuicaoId") REFERENCES "Atribuicao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Evento_sigla_key" ON "Evento"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "EdicaoEvento_eventoId_ano_key" ON "EdicaoEvento"("eventoId", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "Atribuicao_artigoId_revisorId_key" ON "Atribuicao"("artigoId", "revisorId");

-- CreateIndex
CREATE UNIQUE INDEX "Resposta_atribuicaoId_perguntaId_key" ON "Resposta"("atribuicaoId", "perguntaId");
