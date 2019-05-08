import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return {
    body: JSON.stringify({ message: "ok", event }),
    statusCode: 200
  };
};
