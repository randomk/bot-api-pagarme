const filename = (__filename).replace(new RegExp(__dirname, "iu"), "");

if (filename.match(/\.js\W*$/i)) {
  require("module-alias/register");
}

import { Handler, Context, Callback } from "aws-lambda";
import { MongoDBConnection } from "@app/database/config/mongodb/connection";
import { BotModel } from "@app/database/models/bot";

import { Http } from "@app/http/bootstrap";
import { HttpStatusCode } from "@app/enums/http-status-code";

const index: Handler = async (event: any, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let statusCode = HttpStatusCode.UNKNOWN;
  let bots = null;

  if (typeof(event) === "string") {
    event = JSON.parse(event);
  }

  const id = event.pathParameters && event.pathParameters.id
    ? event.pathParameters.id
    : null;

  const db = new MongoDBConnection();
  await db.pool();
  let found = false;

  const model = new BotModel(db.get());
  
  try {
    bots = id !== null
      ? await model.properties.findOne({ _id: id }).lean()
      : await model.properties.find().lean();
    found = true;
  } catch (e) {
    bots = {
      message: "Bot not found!"
    };
  }

  Http.setCallback(callback, statusCode, bots, !found);
};
export { index }
