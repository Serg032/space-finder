import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./cases/post-spaces";
import { getSpaces } from "./cases/get-spaces";
import { updateSpaceById } from "./cases/update-by-id";

const ddbClient = new DynamoDBClient();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;

  try {
    switch (event.httpMethod) {
      case "GET":
        message = "Hello from GET";
        return await getSpaces(event, ddbClient);
      case "POST":
        message = "Hello from POST";
        return await postSpaces(event, ddbClient);
      case "PUT":
        message = "Hello from PUT";
        return await updateSpaceById(event, ddbClient);
      default:
        message = "Hello from default";
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
}
