import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3Client = new S3Client();

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  const myBuckets = (await s3Client.send(new ListBucketsCommand())).Buckets;

  console.log(myBuckets);

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(`
      Hello from lambda. This is the id: ${randomUUID()}\n
      Here are ur buckets: ${JSON.stringify(myBuckets)}
      `),
  };

  console.log("EVENT", event);

  return response;
}
