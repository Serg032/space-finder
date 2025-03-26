import { Space } from "../model/model";

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value of ${missingField} expected.`);
  }
}

export const validateSpace = (arg: any) => {
  if (!(arg as Space).id) {
    throw new MissingFieldError("id");
  }

  if (!(arg as Space).location) {
    throw new MissingFieldError("location");
  }

  if (!(arg as Space).name) {
    throw new MissingFieldError("name");
  }
};
