export class ParamsRequired {
  static compareParamsAndValues(isRequired: Array<string>, params: Object, noException: boolean = false) {
    if (!params || Object.keys(params).length === 0) {
      const message = "Invalid params! send at least one parameter.";
      if (noException === false) throw new Error(message);
      return message;
    }

    const paramsKey = Object.keys(params).map(value => value);

    isRequired.forEach((value, index) => {
      if (paramsKey.indexOf(value) >= 0) {
        delete(isRequired[index]);
      }
    });

    isRequired = isRequired.filter(value => value !== null);

    if (isRequired.length > 0) {
      const message = `Invalid params! It's missing: ${ isRequired.join(",") }`;
      if (noException === false) throw new Error(message);
      return message;
    }
  }
}
