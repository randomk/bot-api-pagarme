import * as uuid from "uuid/v4";

export class BotModel {
  public properties: any;
  private connection: any;

  constructor(poolConnection: any) {
    this.connection = poolConnection;
    this.setProperties();
  }

  setProperties() {
    this.properties = this.connection.model("Bot", {
      _id: {
        type: String,
        default: uuid.default(),
        trim: true
      },
      name: String
    });
  }
}
