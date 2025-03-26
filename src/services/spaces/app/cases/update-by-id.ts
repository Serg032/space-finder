import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export const updateSpaceById = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.queryStringParameters["id"];
    const body = event.body;

    if (!id || !body) {
      return {
        statusCode: 400,
        body: "Id and body required",
      };
    }

    const name = JSON.parse(body).name;

    const response = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: {
            S: id,
          },
        },
        UpdateExpression: "set #NAME = :s",
        ExpressionAttributeNames: {
          "#NAME": "name",
        },
        ExpressionAttributeValues: {
          ":s": {
            S: name,
          },
        },
        ConditionExpression: "attribute_exists(id)",
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Item updated successfully",
        updatedItem: response.Attributes,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error during updating an item",
        error,
      }),
    };
  }
};
