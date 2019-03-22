const filename = (__filename).replace(new RegExp(__dirname, "iu"), "");

if (filename.match(/\.js\W*$/i)) {
  require("module-alias/register");
}

import { Handler, Context, Callback } from "aws-lambda";
import { MongoDBConnection } from "@app/database/config/mongodb/connection";
import { MessageModel } from "@app/database/models/message";
import {
  Http
} from "@app/http/bootstrap";
import { ParamsRequired } from "@app/validators/params-required";
import { HttpStatusCode } from "@app/enums/http-status-code";

const index: Handler = async (event: any, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let statusCode = HttpStatusCode.UNKNOWN;
  if (typeof(event) === "string") {
    event = JSON.parse(event);
  }

  const error = ParamsRequired.compareParamsAndValues([
    "conversationId",
  ], event.queryStringParameters, true);

  try {
    if (error) {
      console.log(`pathParameters`, event.pathParameters);
      ParamsRequired.compareParamsAndValues([
        "id",
      ], event.pathParameters);
    }
  } catch (e) {
    console.log("Exception", e);
    statusCode = HttpStatusCode.INVALID_PARAMS;
    return Http.setCallback(callback, statusCode, {
      message: e.message
    });
  }

  const conversationId = event.queryStringParameters && event.queryStringParameters.conversationId
    ? event.queryStringParameters.conversationId
    : null;

  const id = event.pathParameters && event.pathParameters.id
    ? event.pathParameters.id
    : null;

  const db = new MongoDBConnection();
  await db.pool();

  const model = new MessageModel(db.get());
  let messages = [];

  if (conversationId) {
    messages = await model.properties.find({ conversationId: conversationId }).lean();
  } else if (id) {
    messages = await model.properties.findOne({ _id: id }).lean();
  }

  return Http.setCallback(callback, statusCode, messages, !messages);
};
export { index }
