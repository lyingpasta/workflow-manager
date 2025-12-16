-- CreateTable
CREATE TABLE "workflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_execution" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'started',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "workflowId" TEXT NOT NULL,
    "workflow_schema_id" TEXT NOT NULL,

    CONSTRAINT "workflow_execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_schema" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "schema" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "workflow_id" TEXT NOT NULL,

    CONSTRAINT "workflow_schema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node_execution" (
    "id" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'started',
    "input" JSONB,
    "output" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "workflowExecutionId" TEXT NOT NULL,

    CONSTRAINT "node_execution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workflow_execution" ADD CONSTRAINT "workflow_execution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_execution" ADD CONSTRAINT "workflow_id" FOREIGN KEY ("workflow_schema_id") REFERENCES "workflow_schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_schema" ADD CONSTRAINT "workflow_schema_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node_execution" ADD CONSTRAINT "node_execution_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "workflow_execution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
