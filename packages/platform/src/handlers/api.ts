import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { routes } from '../routes/api'
import { toLambdaHandler } from '../engine/adapters/lambda'

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const handlers = routes.reduce((routeMap, route) => {
    return { ...routeMap, [route.path]: toLambdaHandler(route) };
  }, {})

  const handler = handlers[event.resource]
  if (!handler) {
    return {
      body: JSON.stringify({ message: `${event.path} could not be found` }),
      statusCode: 404
    };
  }

  return handler(event, context);
};
