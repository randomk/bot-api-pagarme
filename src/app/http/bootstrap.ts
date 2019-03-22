import { HttpStatusCode } from "@app/enums/http-status-code";

export interface IResponse {
  statusCode: number;
  body: string;
}

export class Http {
  static setCallback(callback: any, statusCode: number, result: any, isNotFound?: boolean) {
    if (isNotFound === true || !result) {
      statusCode = HttpStatusCode.NOT_FOUND;
    } else if (statusCode === HttpStatusCode.UNKNOWN) {
      statusCode = HttpStatusCode.OK;
    }
    result = this.normalizeId(result);
    const response: IResponse = {
      statusCode: statusCode,
      body: JSON.stringify(result)
    };
    return callback(undefined, response);
  }

  static normalizeId(result: any) {
    result = JSON.parse(JSON.stringify(result));
    if (Array.isArray(result)) {
      result = result.map((data: any) => {
        const id = data._id;
        delete data._id;
        return {
          id,
          ...data
        };
      });
    } else if (result) {
      const id = result._id;
      delete result._id;
      result = {
        id,
        ...result
      };
    }
    return result;
  }
}
