/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
 */

import {
  Utils,
  Platform,
  Objects,
  Arrays,
  Functions,
  Strings,
  Numbers
} from "../utils/index";
import * as Console from "../console/index";
import {
  hasClassId,
  hasInstanceId
} from "./identification";
import {
  formatCode,
  checkClassLegal,
  hasRunEnvGetter,
  getDataWithRunEnv,
  formatGetterName,
  formatSetterName
} from "./helpers";


/**
 * 格式化js语法结构
 * @param methodStr
 * @return {string}
 */
export const formatSyntax = (methodStr) => {
  return methodStr.replace(/[\s+]/g, "").replace(/\{(.*)\}/g, "{}");
};

/**
 * 格式化es语法结构
 * @param methodStr
 * @return {string}
 */
export const formatEsSyntax = (methodStr) => {
  return methodStr.replace(/function\(/g, "(").replace(/\)/g, ")=>");
};

/**
 * 解析协议的验证类型
 * @param typeRule
 * @return {{check: boolean, value: *}}
 */
export const parseTypeRule = (typeRule) => {
  let value = "", check = false;

  switch (typeRule.type) {
    case "function":
      check = true;
      value = "function(" + typeRule.args.join(",") + "){}";
      break;
    case "object":
      check = true;
      value = '[object]';
      break;
    case "array":
      check = true;
      value = '[array]';
      break;
    case "string":
      check = true;
      value = "[string]";
      break;
    case "number":
      check = true;
      value = "[number]";
      break;
    case "class":
      check = true;
      value = typeRule.args;
      break;
    default:
      check = true;
      value = "[*]";
      break;
  }

  //如果协议是@optional->可选实现
  if ("@optional" === typeRule.mode) {
    check = false;
  }

  return {
    "type": typeRule.type,
    "check": check,
    "value": value
  };
};

/**
 * 根据平台格式化语法结构
 * @param abortSyntax
 */
export const formatSyntaxWidthPlatform = function (abortSyntax) {
  if (Platform.isBrowserSide()) {
    return abortSyntax;
  } else {
    return formatSyntax(abortSyntax);
  }
};

/**
 * 验证规范
 * @param collect
 * @param name
 * @param typeRule
 * @return {*}
 */
export const validateTypeRule = (collect, name, typeRule) => {
  let
    type = Utils.getDefaultVal(typeRule, "type"),
    isCheck = Utils.getDefaultVal(typeRule, "check"),
    checkValue = Utils.getDefaultVal(typeRule, "value"),
    syntax = checkValue.replace(/[\s+]/g, "");

  if (!collect.hasOwnProperty(name)) {
    return (name + (syntax ? "=" + syntax : ""));
  }

  let definedValue = collect[name],
    definedValueString = definedValue.toString(),
    definedValueType = Utils.getType(definedValue);

  if (isCheck &&　definedValue !== undefined && definedValue !== null) {
    switch (type) {
      case "function":
        if (definedValueType !== "function") {
          return (name + (syntax ? "=" + syntax : ""));
        }
        if (formatSyntax(checkValue) !== formatSyntax(definedValueString) ||
          formatEsSyntax(formatSyntax(checkValue)) !== formatEsSyntax(formatSyntax(definedValueString))
        ) {
          return (name + (syntax ? "=" + syntax : ""));
        }
        break;
      case "object":
        if (definedValueType !== "object") {
          return (name + (syntax ? "=" + syntax : ""));
        }
        break;
      case "array":
        if (definedValueType !== "array") {
          return (name + (syntax ? "=" + syntax : ""));
        }
        break;
      case "string":
        if (definedValueType !== "string") {
          return (name + (syntax ? "=" + syntax : ""));
        }
        break;
      case "number":
        if (definedValueType !== "number") {
          return (name + (syntax ? "=" + syntax : ""));
        }
        break;
      case "class":
        let key = "",
          classId = "",
          id = "",
          _name = "";

        try {
          if (hasRunEnvGetter(definedValue)) {
            key = getDataWithRunEnv(definedValue, "key");
            classId = getDataWithRunEnv(definedValue, "id");
            _name = getDataWithRunEnv(definedValue, "name");
          }
          id = definedValue.id;
        } catch (e) {
        }

        if (!hasInstanceId(id) || !hasClassId(classId) || !checkClassLegal(_name, key, classId) || formatCode([_name, classId]) !== checkValue) {
          return (name + (syntax ? "=" + syntax : ""));
        }
        break;
    }
  }

  return null;
};


/**
 * prototype(setter|getter)
 * @param name
 * @param callback
 * @return {function(*, *)}
 * @private
 */
export const prototype = (name, callback) => {
  const evalStr = "function (resolve){" +
    "resolve.method = function _" + name + "_(value) {" +
    "if(resolve.callback) return (resolve.callback).apply(this, [value]);" +
    "};" +
    "}";

  try {
    let resolve = {
      "method": function (value) {

      },
      "callback": callback
    };
    Functions.evil(evalStr)(resolve);
    return resolve.method;
  } catch (e) {
    Console.exit(e);
  }
};

/**
 * 获取协议规范的原子性值配置
 * @param name
 * @param value
 * @param typeRule
 * @param alias
 * @param isPrototype
 */
export const getProtocolTypeRuleValueConfig = function (name, value, typeRule, alias, isPrototype) {
  let type = Utils.getDefaultVal(typeRule, "type"),
    checkValue = Utils.getDefaultVal(typeRule, "value");

  return {
    configurable: false,
    enumerable: true,
    get: prototype(type, function () {
      const getter = this[formatGetterName(name)];
      if(isPrototype && Functions.isFunction(getter)){
        return getter(value);
      }
      return value;
    }),
    set: prototype(type, function (input) {
      const setter = this[formatSetterName(name)];
      let check = true,
        valueType = Utils.getType(input);

      if(isPrototype && Functions.isFunction(setter)){
        input = setter(input);
        if(Utils.isEmpty(input)) return false;
        valueType = Utils.getType(input);
      }

      switch (type) {
        case "function":
          check = Functions.isFunction(input);
          break;
        case "object":
          check = Objects.isObject(input);
          break;
        case "array":
          check = Arrays.isArray(input);
          break;
        case "string":
          check = Strings.isString(input);
          break;
        case "number":
          check = Numbers.isNumber(input);
          break;
        case "class":
          let key = "",
            classId = "",
            oid = "",
            name = "";

          try {
            if (hasRunEnvGetter(input)) {
              key = getDataWithRunEnv(input, "key");
              classId = getDataWithRunEnv(input, "id");
              name = getDataWithRunEnv(input, "name");
            }
            oid = input.id;
          } catch (e) {
          }

          check = (hasInstanceId(oid) && hasClassId(classId) && checkClassLegal(name, key, classId) && formatCode([name, classId]) === checkValue);
          if(!check){
            valueType = formatCode([name, classId]);
            type = checkValue;
          }
          break;
      }
      if (!check && input !== undefined && input !== null) {
        Console.exit(`${alias}.${name}=[${valueType}] 与协议中定义的值类型必须是一致: ${alias}.${name}=[${type}]"`);
        return false;
      }
      value = input;
      return true;
    })
  }
};

/**
 * 获取协议规范的原子性值配置
 * @param collect
 * @param name
 * @param typeRule
 * @param alias
 * @param isPrototype
 */
export const getProtocolTypeRuleValueConfig2 = function (collect, name,  typeRule, alias, isPrototype) {
  let type = Utils.getDefaultVal(typeRule, "type"),
    checkValue = Utils.getDefaultVal(typeRule, "value");

  return {
    configurable: false,
    enumerable: true,
    get: prototype(type, function () {
      const getter = this[formatGetterName(name)];
      if(isPrototype && Functions.isFunction(getter)){
        return getter(collect[name]);
      }
      return collect[name];
    }),
    set: prototype(type, function (input) {
      const setter = this[formatSetterName(name)];
      let check = true,
        valueType = Utils.getType(input);

      if(isPrototype && Functions.isFunction(setter)){
        input = setter(input);
        if(Utils.isEmpty(input)) return false;
        valueType = Utils.getType(input);
      }

      switch (type) {
        case "function":
          check = Functions.isFunction(input);
          break;
        case "object":
          check = Objects.isObject(input);
          break;
        case "array":
          check = Arrays.isArray(input);
          break;
        case "string":
          check = Strings.isString(input);
          break;
        case "number":
          check = Numbers.isNumber(input);
          break;
        case "class":
          let key = "",
            classId = "",
            oid = "",
            name = "";

          try {
            if (hasRunEnvGetter(input)) {
              key = getDataWithRunEnv(input, "key");
              classId = getDataWithRunEnv(input, "id");
              name = getDataWithRunEnv(input, "name");
            }
            oid = input.id;
          } catch (e) {
          }

          check = (hasInstanceId(oid) && hasClassId(classId) && checkClassLegal(name, key, classId) && formatCode([name, classId]) === checkValue);
          if(!check){
            valueType = formatCode([name, classId]);
            type = checkValue;
          }
          break;
      }

      if (!check && input !== undefined && input !== null) {
        Console.exit(`${alias}.${name}=[${valueType}] 与协议中定义的值类型必须是一致: ${alias}.${name}=[${type}]"`);
        return false;
      }
      collect[name] = input;
      return true;
    })
  }
};


/**
 * 设置协议规范的原子性值
 * @param collect
 * @param name
 * @param value
 * @param typeRule
 * @param alias
 */
export const setProtocolTypeRuleValue = function (collect, name, value, typeRule, alias) {
  Object.defineProperty(collect, name, getProtocolTypeRuleValueConfig(name, value, typeRule, alias, false));
};

/**
 * 获取协议规范的原子性值并调用setter&getter
 * @param collect
 * @param name
 * @param typeRule
 * @param alias
 */
export const getProtocolTypeRuleOfSetterAndGetterValue = function (collect, name, typeRule, alias) {
  return getProtocolTypeRuleValueConfig2(collect, name, typeRule, alias, true)
};

/**
 * 设置协议规范的原子性值并调用setter&getter
 * @param collect
 * @param name
 * @param collect2
 * @param collect3
 * @param typeRule
 * @param alias
 */
export const setProtocolTypeRuleOfSetterAndGetterValue = function (collect, name, collect2, collect3, typeRule, alias) {
  let _collect = !Utils.isEmpty(collect2[name]) ? collect2 : collect3;
  Object.defineProperty(collect, name, getProtocolTypeRuleValueConfig2(_collect, name, typeRule, alias, true));
};


/**
 * 获取setter&getter配置
 * @param name
 * @param collect
 */
export const getGetterAndSetterValueConfig = function (collect, name) {
  return {
    configurable: false,
    enumerable: true,
    get: prototype(Utils.getType(collect[name]), function () {
      const getter = this[formatGetterName(name)];
      if(Functions.isFunction(getter)){
        return getter(collect[name]);
      }
      return collect[name];
    }),
    set: prototype(Utils.getType(collect[name]), function (input) {
      const setter = this[formatSetterName(name)];
      if(Functions.isFunction(setter)){
        input = setter(input);
        if(Utils.isEmpty(input)) return false;
      }
      collect[name] = input;
      return true;
    })
  }
};

/**
 * 设置setter&getter
 * @param collect
 * @param collect2
 * @param collect3
 * @param name
 */
export const setGetterAndSetterValue = function (collect, name, collect2, collect3) {
  let _collect = !Utils.isEmpty(collect2[name]) ? collect2 : collect3;
  Object.defineProperty(collect, name, getGetterAndSetterValueConfig(_collect, name));
};

/**
 * 获取Final类型的原子性值配置
 * @param value
 * @param name
 * @param alias
 */
export const getFinalGetterAndSetterValueConfig = function (name, value, alias) {
  return {
    configurable: false,
    enumerable: true,
    get: prototype(Utils.getType(value), function () {
      return value;
    }),
    set: prototype(Utils.getType(value), function () {
      Console.exit(`不可覆写[Final]类型的属性成员：${alias}.${name}`);
    })
  }
};

/**
 * 设置Final类型setter&getter
 * @param collect
 * @param name
 * @param value
 * @param alias
 */
export const setFinalGetterAndSetterValue = function (collect, name, value, alias) {
  Object.defineProperty(collect, name, {
    configurable: false,
    enumerable: true,
    get: prototype(Utils.getType(value), function () {
      return value;
    }),
    set: prototype(Utils.getType(value), function () {
      Console.exit(`不可覆写[Final]类型的属性成员：${alias}.${name}`);
    })
  });
};
