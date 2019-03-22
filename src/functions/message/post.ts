const filename = (__filename).replace(new RegExp(__dirname, "iu"), "");

if (filename.match(/\.js\W*$/i)) {
  require("module-alias/register");
}

import { Handler, Context, Callback } from "aws-lambda";
import { MongoDBConnection } from "@app/database/config/mongodb/connection";
import { MessageModel } from "@app/database/models/message";
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

    ParamsRequired.compareParamsAndValues([
      "from",
      "to",
      "conversationId",
      "text"
    ], event.body);

  } catch (e) {
    console.log("Exception", e);
    statusCode = HttpStatusCode.INVALID_PARAMS;
    return Http.setCallback(callback, statusCode, {
      message: e.message
    });
  }

  const from = event.body.from;
  const to = event.body.to;
  const conversationId = event.body.conversationId;
  const text = event.body.text;

  const db = new MongoDBConnection();
  await db.pool();

  const model = new MessageModel(db.get());
  const message = new model.properties({
    from: from,
    to: to,
    conversationId: conversationId,
    text: text
  });

  const save = await message.save();
  Http.setCallback(callback, statusCode, save, !save._id)
};
export { index }
