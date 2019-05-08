import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handle = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  return {
    body: JSON.stringify(event.requestContext),
    statusCode: 200
  };
};
