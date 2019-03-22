const filename = (__filename).replace(new RegExp(__dirname, "iu"), "");

if (filename.match(/\.js\W*$/i)) {
  require("module-alias/register");
}

import { Handler, Context, Callback } from "aws-lambda";
import { MongoDBConnection } from "@app/database/config/mongodb/connection";
import { BotModel } from "@app/database/models/bot";

import { Http } from "@app/http/bootstrap";
import { ParamsRequired } from "@app/validators/params-required";
import { HttpStatusCode } from "@app/enums/http-status-code";

const index: Handler = async (event: any, context: Context, callback: Callback) => {
  let statusCode = HttpStatusCode.UNKNOWN;
  context.callbackWaitsForEmptyEventLoop = false;

  if (typeof(event.body) === "string") {
    event.body = JSON.parse(event.body);
  }

  try {
    ParamsRequired.compareParamsAndValues([ "id" ], event.body);
  } catch (e) {
    console.log("Exception", e);
    statusCode = 403;
    return Http.setCallback(callback, statusCode, {
      message: e.message
    });
  }

  const id = event.body.id;
  const db = new MongoDBConnection();
  await db.pool();

  const model = new BotModel(db.get());
  const bot = await model.properties.findOne({ _id: id });
  const deleteBot = await model.properties.deleteOne({ _id: id });

  const body = {
    message: bot && deleteBot && deleteBot.ok === 1
      ? `Bot with id ${ id } was deleted!`
      : "Bot not found!"
  };

  Http.setCallback(callback, statusCode, body, !bot);
};

export { index }
