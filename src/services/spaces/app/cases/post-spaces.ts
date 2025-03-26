import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { marshall } from "@aws-sdk/util-dynamodb";
import { queryBySpacename } from "./query-by-name";
import { MissingFieldError, validateSpace } from "../../../shared/validator";
import { CreateSpaceCommand } from "../../../model/model";

export const postSpaces = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("EVENT", event);
    const body = JSON.parse(event.body) as CreateSpaceCommand;

    const item = { id: randomUUID(), ...body };

    console.log("ITEM", item);

    validateSpace(item);

    const queryBySpacenameResponse = await queryBySpacename(event, ddbClient);

    if (queryBySpacenameResponse) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          `There is a space with name ${body.name} that already exists.`
        ),
      };
    }

    const randomId = randomUUID();

    const result = await ddbClient.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item),
      })
    );

    return {
      body: JSON.stringify({
        message: "Item created",
        item: result.Attributes,
      }),
      statusCode: 200,
    };
  } catch (error) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    return {
      body: JSON.stringify(error.message),
      statusCode: 500,
    };
  }
};
