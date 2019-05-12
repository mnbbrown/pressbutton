import * as pulumi from "@pulumi/pulumi";
import * as path from "path";
import * as aws from "@pulumi/aws";
import webpack from "webpack";
import webpackConfig from "../../webpack.config";

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
  const file = handler.substring(0, handler.lastIndexOf("."));
  const entry = handler.substring(handler.lastIndexOf("."), handler.length);
  return { file, entry };
};

const compileFunction = async (
  handlerInput: string,
  codePathOptions: any
): Promise<pulumi.asset.AssetMap> => {
  const handler = await handlerInput;
  const { file } = getHandlerParts(handler);

  codePathOptions = codePathOptions || {};
  codePathOptions.extraExcludePackages = codePathOptions.extraExcludePackages || [];
  codePathOptions.extraExcludePackages.push("aws-sdk");
  const modulePaths = await pulumi.runtime.computeCodePaths(codePathOptions);

  return new Promise<pulumi.asset.AssetMap>((resolve, reject) => {
    const config: webpack.Configuration = Object.assign(
      {},
      webpackConfig as webpack.Configuration,
      {
        entry: ["./node_modules/reflect-metadata/Reflect.js", path.resolve(file)]
      }
    );
    webpack(config).run((err, output) => {
      if (err) {
        return reject(err);
      }
      const stats = output.toJson();
      const assetPath = stats.publicPath || '';
      const assets = stats.assetsByChunkName;
      if (!assets) {
        return resolve();
      }

      const files: pulumi.asset.AssetMap = Object.keys(assets).reduce((assetMap, assetName) => {
        const assetFile = assets[assetName] as unknown
        const fullPath = path.resolve(path.join(config!.output!.path! || '', assetFile as string))
        return {
          ...assetMap,
          [file + '.js']: new pulumi.asset.FileAsset(fullPath as string),
        };
      }, {});
      for (const [path, asset] of modulePaths) {
        files[path] = asset;
      }
      return resolve(files);
    });
  });
};

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface WebpackFunctionArgs
extends Omit<aws.lambda.FunctionArgs, "handler" | "role" | "runtime"> {
  handler: string;
  policies?: string[];
  role?: aws.iam.Role;
  codePathOptions: any;
}

export class WebpackFunction extends aws.lambda.Function {
  public roleInstance?: aws.iam.Role;
  public policyAttachments: aws.iam.RolePolicyAttachment[];
  public constructor(
    name: string,
    args: WebpackFunctionArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    const { handler, codePathOptions } = args;
    const codePaths = compileFunction(handler, codePathOptions);

    let role: aws.iam.Role;
    let policyAttachments: aws.iam.RolePolicyAttachment[] = [];
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

      policyAttachments = args.policies.map((policy) =>
        new aws.iam.RolePolicyAttachment(
          `${name}-${policy}-roleattachment`,
          {
            role: role,
            policyArn: policy
          },
          opts
        )
      )
    }

    const functionArgs: aws.lambda.FunctionArgs = {
      ...args,
      role: role.arn,
      runtime: aws.lambda.NodeJS8d10Runtime,
      code: new pulumi.asset.AssetArchive(codePaths)
    };
    super(name, functionArgs, opts);
    this.roleInstance = role
    this.policyAttachments = policyAttachments
  }
}
