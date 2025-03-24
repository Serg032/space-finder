import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/data";
import { LambdaStack } from "./stacks/lambda";
import { ApiStack } from "./stacks/api";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  spacesTable: dataStack.spacesTable,
});
new ApiStack(app, "ApiStack", {
  helloLambdaIntegration: lambdaStack.helloLambdaIntegration,
  spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
});
