import { sendServerError } from "./sendServerError.js";

export default function validate(fields, req, res, next) {
  const missingFields = [];
  fields.forEach((filed) => {
    if (!req.body.hasOwnProperty(filed)) {
      missingFields.push(filed);
    }
  });
  if (missingFields.length !== 0) {
    return sendServerError(
      res,
      new Error(
        `More fields required: ${missingFields.map((field) => {
          return field;
        })}`
      )
    );
  }
  return next();
}
