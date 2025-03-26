import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { marshall } from "@aws-sdk/util-dynamodb";
import { queryBySpacename } from "./query-by-location";

export const postSpaces = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);

    const queryBySpacenameResponse = await queryBySpacename(event, ddbClient);

    if (queryBySpacenameResponse) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          `There is a space with spacename ${body.spacename} that already exists.`
        ),
      };
    }

    const randomId = randomUUID();

    const result = await ddbClient.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall({
          id: randomId,
          spacename: body.spacename,
        }),
      })
    );

    return {
      body: JSON.stringify({ id: randomId, spacename: body.spacename }),
      statusCode: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: 500,
    };
  }
};
