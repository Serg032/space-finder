import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { queryBySpacename } from "./query-by-location";

export const postSpaces = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
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

  const randomId = v4();

  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: { S: randomId },
        spacename: { S: body.spacename },
      },
    })
  );

  return {
    body: JSON.stringify({ id: randomId, spacename: body.spacename }),
    statusCode: 200,
  };
};
