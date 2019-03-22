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
  context.callbackWaitsForEmptyEventLoop = false;
  let statusCode = HttpStatusCode.UNKNOWN;

  if (typeof(event.body) === "string") {
    event.body = JSON.parse(event.body);
  }

  try {
    ParamsRequired.compareParamsAndValues([ "name" ], event.body);
  } catch (e) {
    console.log("Exception", e);
    statusCode = HttpStatusCode.INVALID_PARAMS;
    return Http.setCallback(callback, statusCode, {
      message: e.message
    });
  }

  const name = event.body.name;
  const id = event.body.id
    ? event.body.id
    : null;

  const db = new MongoDBConnection();
  await db.pool();

  let data: any = {
    name: name.toLowerCase()
  };

  if (id) {
    data = {
      ...data,
      _id: id,
    };
  }

  const model = new BotModel(db.get());
  const bot = new model.properties(data);

  const save = await bot.save();
  Http.setCallback(callback, statusCode, save, !save._id);
};
export { index }
