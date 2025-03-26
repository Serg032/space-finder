import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { QuerySpaceCommand, Space } from "../../../model/model";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const queryBySpacename = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<Space[] | undefined> => {
  const body = JSON.parse(event.body) as QuerySpaceCommand;

  const name = body.name;

  const result = (
    await ddbClient.send(
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
    )
  ).Items;

  const unmarshalledItems: Space[] = result.map((item) =>
    unmarshall(item)
  ) as Space[];

  if (result.length === 0) {
    console.log("RESULT WHEN QUERYING", JSON.stringify(result));
    return undefined;
  }
  return unmarshalledItems.map((item) => ({
    id: item.id,
    location: item.location,
    name: item.name,
    photoUrl: item.photoUrl ? item.photoUrl : undefined,
  }));
};
