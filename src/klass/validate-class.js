/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */

import {
  Utils,
  Functions,
  Strings,
  Arrays
} from "../utils/index";
import * as Console from "../console/index";
import {
  hasClassId,
  hasProtocolId
} from "./identification";
import {
  hasRunEnvGetter,
  getDataWithRunEnv
} from "./helpers"

/**
 * 验证类的规范
 * @param _name
 * @param _constructor
 * @param _extends
 * @param _protocol
 * @returns {boolean}
 */
export const validateClass = (_name, _constructor, _extends, _protocol) => {
  const matchVar = /^[A-Z][A-Za-z0-9_]+$/g,
    trimSpaceRep = /[\s+]/g,
    trimStructRep = /\{(.*)+\}$/g,
    trimArgsRep = /\((.*)\)/g,
    structStr = "function(?,?){}";

  if (!_name) {
    Console.exit(`没有给定类名`);
  }

  if (!Strings.isString(_name)) {
    Console.exit(`<${_name}> 类名称必须是[String]类型`);
  }

  if (!matchVar.test(_name)) {
    Console.exit(`<${_name}> 类命名称定义不规范,必须是以大写字母开头`);
  }

  if (!_constructor) {
    Console.exit(`<${_name}> 没有定义类结构体`);
  }

  if (!Functions.isFunction(_constructor)) {
    Console.exit(`<${_name}> 类结构体必须是[Function]类型`);
  }

  const conStr = _constructor.toString().replace(trimSpaceRep, "").replace(trimStructRep, "{}").replace(trimArgsRep, "(?,?)");
  if (structStr !== conStr) {
    Console.exit(`<${_name}> 类结构体定义不规范,格式必须是: ${structStr}`);
  }

  if (_extends) {
    if (!Functions.isFunction(_extends)) {
      Console.exit(`<${_name}> 类继承的结构体必须是[Function]类型`);
    }

    if (
      Utils.isEmpty(_extends.name)
      || Utils.isEmpty(_extends.id)
      || !hasClassId(_extends.id)
      || !hasRunEnvGetter(_extends)
      || Utils.isEmpty(getDataWithRunEnv(_extends, "key"))
    ) {
      Console.exit(`<${_name}> 类继承的结构体不规范`);
    }

    if (!Functions.isFunction(_extends)) {
      Console.exit(`<${_name}> 类继承的结构体不规范,格式必须是: ${structStr}`);
    }
  }

  if (_protocol) {
    _protocol = Arrays.isArray(_protocol) ? _protocol : [_protocol];
    Utils.each(_protocol, function (key, curProtocol) {
      if (!Functions.isFunction(curProtocol)) {
        Console.exit(`<${_name}> 协议的结构体必须是[function]类型`);
      }

      if (
        Utils.isEmpty(curProtocol.name)
        || Utils.isEmpty(curProtocol.id)
        || !hasProtocolId(curProtocol.id)
        || !hasRunEnvGetter(curProtocol)
        || Utils.isEmpty(getDataWithRunEnv(curProtocol, "key"))
      ) {
        Console.exit(`<${_name}> 协议的结构体不规范`);
      }

      if (!Functions.isFunction(curProtocol)) {
        Console.exit(`<${_name}> 协议的结构体不规范,格式必须是: ${structStr}`);
      }
    });
  }

  return true;
};

