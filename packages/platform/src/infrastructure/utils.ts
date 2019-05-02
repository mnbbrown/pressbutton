import { environment, project } from "./variables";

export const name = (v: string) => `${project}-${environment}-${v}`;

export const tags = (v: string) => ({
  Name: name(v),
  Environment: environment,
  Project: project
});
