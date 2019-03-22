const filename = (__filename).replace(new RegExp(__dirname, "iu"), "");

if (filename.match(/\.js\W*$/i)) {
  require("module-alias/register");
}

import { Handler, Context, Callback } from "aws-lambda";
import { MongoDBConnection } from "@app/database/config/mongodb/connection";
import { BotModel } from "@app/database/models/bot";

import { Http } from "@app/http/bootstrap";
import { HttpStatusCode } from "@app/enums/http-status-code";
import { ParamsRequired } from "@app/validators/params-required";

const index: Handler = async (event: any, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let statusCode = HttpStatusCode.UNKNOWN;
  let body = {};

  if (typeof(event.body) === "string") {
    event.body = JSON.parse(event.body);
  }

  try {
    ParamsRequired.compareParamsAndValues([ "id", "name" ], event.body);
  } catch (e) {
    console.log("Exception", e);
    statusCode = HttpStatusCode.INVALID_PARAMS;
    return Http.setCallback(callback, statusCode, {
      message: e.message
    });
  }

  const name = event.body.name;
  const id = event.body.id;

  const db = new MongoDBConnection();
  await db.pool();

  const model = new BotModel(db.get());
  let bot = {};

  try {

    const bot = await model.properties.findOne({ _id: id });
    let save = { _id: undefined };
    
    if (bot) {
      bot.name = name.toLowerCase();
      save = await bot.save();
    }

    if (save._id) {
      body = {
        message: `Bot with id ${ id } update successfully!`
      };
    } else {
      body = {
        message: `Bot with id ${ id } was not updated`
      };
      statusCode = HttpStatusCode.ERROR;
    }

  } catch (e) {
    console.log(e);
    statusCode = HttpStatusCode.NOT_FOUND;
    body = {
      message: "Bot not found!"
    };
  }

  Http.setCallback(callback, statusCode, body, !bot);
};
export { index }
