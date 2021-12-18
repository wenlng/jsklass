/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
 */

import {
  Utils
} from "../utils/index";
import * as Console from "../console/index";
import {
  hasClassId
} from "./identification";
import {
  checkClassLegal,
  getDataWithRunEnv,
  hasRunEnvGetter,
  formatCode
} from "./helpers";
import {ProtocolTypeRule} from "./protocol-type-rule";

/**
 * 协议规范对应类型
 * @type {*}
 */

export const ProtocolType = {
  "function": function () {
    let model = "", argsArr = [];
    Utils.each(arguments, (key, name) => {
      if(name.indexOf("@") === 0){
        model = name;
      }else {
        argsArr.push(name);
      }
    });
    return Object.freeze(ProtocolTypeRule("function", model, argsArr));
  },
  "object": function (model) {
    return Object.freeze(ProtocolTypeRule("object", model, ""));
  },
  "array": function (model) {
    return Object.freeze(ProtocolTypeRule("array", model, ""));
  },
  "string": function (model) {
    return Object.freeze(ProtocolTypeRule("string", model, ""));
  },
  "number": function (model) {
    return Object.freeze(ProtocolTypeRule("number", model, ""));
  },
  "class": function (model, klass) {
    let key = "",
        id = "",
        name = "";
    try {
      if(hasRunEnvGetter(klass)){
        key = getDataWithRunEnv(klass, "key");
        id = getDataWithRunEnv(klass, "id");
        name = getDataWithRunEnv(klass, "name");
      }
    }catch (e){}

    if(!hasClassId(id) || !checkClassLegal(name, key, id)){
      Console.exit(`协议约定的类不合法: <${klass}>`);
    }

    return Object.freeze(ProtocolTypeRule("class", model, formatCode([name, id])));
  },
  "own": function (model) {
    return Object.freeze(ProtocolTypeRule("own", model, ""));
  }
};