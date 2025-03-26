import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const deleteSpaceById = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.queryStringParameters["id"];

    if (!id) {
      return {
        statusCode: 400,
        body: "Id required",
      };
    }

    const response = await ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: {
            S: id,
          },
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item deleted successfully",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error during deleting an item",
        error,
      }),
    };
  }
};
