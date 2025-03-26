import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Space } from "../../domain";

export const queryBySpacename = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<Space[] | undefined> => {
  const body = JSON.parse(event.body);

  const spacename = body.spacename;

  const result = await ddbClient.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: "SpaceNameIndex",
      KeyConditionExpression: "spacename = :spacename",
      ExpressionAttributeValues: {
        ":spacename": { S: spacename },
      },
    })
  );

  if (result.Items.length === 0) {
    console.log("RESULT WHEN QUERYING", JSON.stringify(result));
    return undefined;
  }
  return result.Items.map((item) => ({
    id: item.id.S,
    spacename: item.spacename.S,
  }));
};
