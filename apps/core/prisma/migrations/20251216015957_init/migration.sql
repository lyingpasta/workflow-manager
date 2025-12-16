-- CreateTable
CREATE TABLE "workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution" (
    "id" TEXT NOT NULL,
    "workflow_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'started',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "execution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workflow_name_key" ON "workflow"("name");

-- AddForeignKey
ALTER TABLE "execution" ADD CONSTRAINT "workflow_id" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
