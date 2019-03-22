import mongoose from "mongoose";

export class MongoDBConnection {
  private connection: any;
  constructor() {
  }

  async pool() {
    const uri = this.getURI();
    this.connection = await mongoose.createConnection(uri, { useNewUrlParser: true });
  }

  close() {
    return this.connection.close();
  }
  
  get() {
    return this.connection;
  }

  getURI() {
    const env = process.env;
    const host = env.DATABASE_HOST;
    const name = env.DATABASE_NAME;
    const port = env.DATABASE_PORT;
    const user = env.DATABASE_USER;
    const password = env.DATABASE_PASSWORD;
    return password
      ? `mongodb://${ user }:${ password }@${ host }:${ port }/${ name }`
      : `mongodb://${ user }@${ host }:${ port }/${ name }`;
  }
}
