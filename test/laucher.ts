import { handler } from "../src/services/spaces/app/handler";

handler(
  {
    httpMethod: "POST",
    body: JSON.stringify({
      name: "Los Angeles",
    }),
  } as any,
  {} as any
);
