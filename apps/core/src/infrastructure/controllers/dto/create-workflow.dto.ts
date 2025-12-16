export class CreateWorkflowDTO {
  workflow: {
    name: string;
    isActive: boolean;
  };

  schema: {
    schema: any;
    isActive: boolean;
  };
}
