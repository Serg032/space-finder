import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const getSpaces = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  try {
    const queryStringParameters = event.queryStringParameters;

    if (queryStringParameters) {
      if ("id" in queryStringParameters) {
        const spaceId = queryStringParameters["id"];
        if (!spaceId) {
          return {
            body: "id is required",
            statusCode: 400,
          };
        }
        const result = await ddbClient.send(
          new GetItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: { id: { S: spaceId } },
          })
        );

        return {
          body: JSON.stringify({
            item: result.Item ? unmarshall(result.Item) : undefined,
          }),
          statusCode: 200,
        };
      }
      if ("name" in queryStringParameters) {
        const name = queryStringParameters["name"];
        if (!name) {
          return {
            body: "name is required",
            statusCode: 400,
          };
        }
        const result = await ddbClient.send(
          new QueryCommand({
            TableName: process.env.TABLE_NAME,
            IndexName: "NameIndex",
            ExpressionAttributeNames: {
              "#name": "name",
            },
            KeyConditionExpression: "#name = :spacename",
            ExpressionAttributeValues: {
              ":spacename": { S: name },
            },
          })
        );

        return {
          body: JSON.stringify({
            item: result.Items
              ? result.Items.map((item) => unmarshall(item))
              : `Spaces with name ${name} not found`,
          }),
          statusCode: 200,
        };
      }
    }

    const result = await ddbClient.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME,
      })
    );

    return {
      body: JSON.stringify({
        items: result.Items ? result.Items.map((item) => unmarshall(item)) : [],
        length: result.Items ? result.Items.length : 0,
      }),
      statusCode: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: 500,
    };
  }
};
