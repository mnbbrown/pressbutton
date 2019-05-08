import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import webpack from "webpack";
import * as webpackConfig from "../../webpack.config";

interface IHandlerParts {
  file: string;
  entry: string;
}

const lambdaRolePolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Action: "sts:AssumeRole",
      Principal: {
        Service: "lambda.amazonaws.com"
      },
      Effect: "Allow",
      Sid: ""
    }
  ]
};

const getHandlerParts = (handler: string): IHandlerParts => {
  const file = handler.substring(0, handler.lastIndexOf(".") + 1);
  const entry = handler.substring(handler.lastIndexOf("/") + 1, handler.length);
  return { file, entry };
};

const compileFunction = async (
  handlerInput: string
): Promise<pulumi.asset.AssetMap> => {
  const handler = await handlerInput;
  const { file } = getHandlerParts(handler);
  return new Promise<pulumi.asset.AssetMap>((resolve, reject) => {
    const config: webpack.Configuration = Object.assign(
      {},
      webpackConfig as webpack.Configuration,
      {
        entry: file
      }
    );
    webpack(config).run((err, stats) => {
      if (err) {
        return reject(err);
      }
      console.log(stats);
      return resolve({});
    });
  });
};

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface WebpackFunctionArgs
  extends Omit<aws.lambda.FunctionArgs, "handler" | "role"> {
  handler: string;
  policies?: string[];
  role?: aws.iam.Role;
}

export class WebpackFunction extends aws.lambda.Function {
  public constructor(
    name: string,
    args: WebpackFunctionArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    const { handler } = args;
    const codePaths = compileFunction(handler);

    let role: aws.iam.Role;
    if (args.role) {
      role = args.role;
    } else {
      // Attach a role and then, if there are policies, attach those too.
      role = new aws.iam.Role(
        name,
        {
          assumeRolePolicy: JSON.stringify(lambdaRolePolicy)
        },
        opts
      );

      if (!args.policies) {
        // Provides wide access to "serverless" services (Dynamo, S3, etc.)
        args.policies = [aws.iam.AWSLambdaFullAccess];
      }

      for (const policy of args.policies) {
        // RolePolicyAttachment objects don't have a physical identity, and create/deletes are processed
        // structurally based on the `role` and `policyArn`.  So we need to make sure our Pulumi name matches the
        // structural identity by using a name that includes the role name and policyArn.
        new aws.iam.RolePolicyAttachment(
          `${name}-${policy}`,
          {
            role: role,
            policyArn: policy
          },
          opts
        );
      }
    }

    const functionArgs: aws.lambda.FunctionArgs = {
      ...args,
      role: role.arn,
      code: new pulumi.asset.AssetArchive(codePaths)
    };
    super(name, functionArgs, opts);
  }
}
