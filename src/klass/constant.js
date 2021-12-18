/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
 */

import {
  getRunEnvName
} from "./identification";

/**
 * Self keyword
 * @type {Array}
 */
export const KeyWord = [
  "class_name",
  "protocol_name",
  "super_name",
  "prototype",
  "constructor",
  "id",
  getRunEnvName(),
  "setStatic",
  "getStatic",
  "getConst",

  "instanceOf",
  "extendOf",
  "classOf",
  "protocolOf",

  "apply",
  "bind",
  "call",
  "caller",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toLocaleString",
  "valueOf",
  "__proto__",

  "$class_name",
  "$super_name",
  "$protocol_name",
  "$prototype",
  "$constructor",
  "$id",
  ("$"+getRunEnvName()),
  "$setStatic",
  "$getStatic",
  "$getConst",

  "$instanceOf",
  "$extendOf",
  "$classOf",
  "$protocolOf",

  "$apply",
  "$bind",
  "$call",
  "$caller",
  "$hasOwnProperty",
  "$isPrototypeOf",
  "$propertyIsEnumerable",
  "$toLocaleString",
  "$valueOf",
  "$__proto__"
];

/**
 * Const and static keyword
 * @type {[*]}
 */
export const KeyWord2 = [
  "class_name",
  "protocol_name",
  "super_name",
  "prototype",
  "constructor",
  "id",
  getRunEnvName(),
  "setStatic",
  "getStatic",
  "getConst",

  "instanceOf",
  "extendOf",
  "classOf",
  "protocolOf",

  "apply",
  "bind",
  "call",
  "caller",
  "toSource",
  "toString",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toLocaleString",
  "valueOf",
  "__proto__",

  "$class_name",
  "$super_name",
  "$protocol_name",
  "$prototype",
  "$constructor",
  "$id",
  ("$"+getRunEnvName()),
  "$setStatic",
  "$getStatic",
  "$getConst",

  "$instanceOf",
  "$extendOf",
  "$classOf",
  "$protocolOf",

  "$apply",
  "$bind",
  "$call",
  "$caller",
  "$toSource",
  "$toString",
  "$hasOwnProperty",
  "$isPrototypeOf",
  "$propertyIsEnumerable",
  "$toLocaleString",
  "$valueOf",
  "$__proto__"
];