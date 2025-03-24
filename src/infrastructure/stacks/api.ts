import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  helloLambdaIntegration: LambdaIntegration;
  spacesLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpacesApi");
    const testResource = api.root.addResource("test");
    const spacesResource = api.root.addResource("spaces");
    testResource.addMethod("GET", props.helloLambdaIntegration);
    spacesResource.addMethod("GET", props.spacesLambdaIntegration);
    spacesResource.addMethod("POST", props.spacesLambdaIntegration);
  }
}
