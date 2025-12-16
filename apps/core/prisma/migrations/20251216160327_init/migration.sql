-- CreateTable
CREATE TABLE "workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_schema" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "schema" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "workflow_id" TEXT NOT NULL,

    CONSTRAINT "workflow_schema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_execution" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'started',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "workflow_id" TEXT NOT NULL,
    "workflow_schema_id" TEXT NOT NULL,

    CONSTRAINT "workflow_execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_execution" (
    "id" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "next_node_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "input" JSONB,
    "output" JSONB,
    "is_start" BOOLEAN NOT NULL,
    "is_end" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "workflowExecutionId" TEXT NOT NULL,

    CONSTRAINT "node_execution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workflow_schema" ADD CONSTRAINT "workflow_schema_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_execution" ADD CONSTRAINT "workflow_execution_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_execution" ADD CONSTRAINT "workflow_id" FOREIGN KEY ("workflow_schema_id") REFERENCES "workflow_schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_execution" ADD CONSTRAINT "node_execution_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "workflow_execution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
