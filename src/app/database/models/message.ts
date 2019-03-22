import * as uuid from "uuid/v4";

export class MessageModel {
  public properties: any;
  private connection: any;

  constructor(poolConnection: any) {
    this.connection = poolConnection;
    this.setProperties();
  }

  setProperties() {
    this.properties = this.connection.model("Message", {
      _id: {
        type: String,
        default: uuid.default(),
        trim: true
      },
      from: String,
      to: String,
      conversationId: String,
      text: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    });
  }
}
