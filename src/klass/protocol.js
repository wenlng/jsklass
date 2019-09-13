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
  Arrays
} from "../utils/index";
import * as Console from "../console/index";
import {
  generateProtocolId,
  getRunEnvName
} from "./identification";
import {
  toProtocolString,
  extendOfProtocol,
  protocolOfInstance,
  convertCode,
  __get__,
  getDataWithRunEnv
} from "./helpers";
import {validateProtocol} from './validate-protocol';
import {VHProtocol} from "./virtual-handler";

/**
 * 实现协议的结构定义
 * @param name
 * @param definition
 * @param _extends
 * @return {Object}
 * @constructor
 */
export const Protocol = function (name, definition, _extends) {
  //内部使用的数据源
  let oVhData = {
      "name": name,
      "id": "",
      "key": "",
      "super_name": [],
      "self": {},
      "const": {},
      "static": {},
      "implement_list":{}
    },
    oProtocol = function () {
    },
    oDefineProperties = {},
    sId = generateProtocolId(),
    oSelf = Utils.getDefaultVal(definition, "self", {}),
    oConst = Utils.getDefaultVal(definition, "const", {}),
    oStatic = Utils.getDefaultVal(definition, "static", {}),
    oSuperName = []
  ;

  //允许多继承
  (Utils.isEmpty(_extends) && (_extends = [])) || (!Arrays.isArray(_extends)) && (_extends = [_extends]);

  //检测规范
  if (!validateProtocol(name, oSelf, oConst, oStatic , _extends)) return ;

  //处理继承的父协议
  if (!Utils.isEmpty(_extends)) {
    Utils.reverseEach(_extends, function (k, ext) {
      const extSelf = getDataWithRunEnv(ext, "self"),
        extConst = getDataWithRunEnv(ext, "const"),
        extStatic = getDataWithRunEnv(ext, "static"),
        extSuperName = getDataWithRunEnv(ext, "super_name"),
        extName = getDataWithRunEnv(ext, "name"),
        extId = getDataWithRunEnv(ext, "id")
      ;

      Utils.each(extSelf, function (tk, tv) {
        !oSelf[tk] && (oSelf[tk] = tv);
      });

      Utils.each(extConst, function (ck, cv) {
        !oConst[ck] && (oConst[ck] = cv);
      });

      Utils.each(extStatic, function (sk, sv) {
        !oStatic[sk] && (oStatic[sk] = sv);
      });

      Utils.each(extSuperName, function (sk, sv) {
        oSuperName.push(sv);
      });

      oSuperName.unshift({ "id": extId, "name": extName });
    });
  }

  oVhData["name"] = name;
  oVhData["id"] = sId;
  oVhData["key"] = convertCode(sId);
  oVhData["self"] = oSelf;
  oVhData["const"] = oConst;
  oVhData["static"] = oStatic;
  oVhData["super_name"] = oSuperName;
  oVhData["implement_list"] = {
    "self": oSelf,
    "const": oConst,
    "static": oStatic
  };

  const GV = {
      "self": oSelf,
      "const": oConst,
      "static": oStatic,

      "name": name,
      "id": sId,
      "super_name": oSuperName,

      "protocol": function () {
      },
      "_": {"_": VHProtocol},
      "console": Console
    },
    evalStr = "function (GV, _){"  +
    "GV.protocol = function " + name + "() {" +
    "_._._(GV, this, arguments);" +
    "};" +
    "}";

  try {
    Functions.evil(evalStr)(GV, GV);
  } catch (e) {
    Console.error(e);
  }

  //更新Protocol核心体
  oProtocol = GV.protocol;

  oDefineProperties = {
    "protocol_name": {
      value: name,
      writable: false,
      enumerable: false,
      configurable: false
    },
    "super_name": {
      value: oSuperName,
      writable: false,
      enumerable: false,
      configurable: false
    },
    "id": {
      value: sId,
      writable: false,
      enumerable: false,
      configurable: false
    },
    "toString": {
      value: toProtocolString(sId, name),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "instanceOf": {
      value: protocolOfInstance(oProtocol),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "extendOf": {
      value: extendOfProtocol(oProtocol),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "kindProtocol": {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    }
  };
  oDefineProperties[getRunEnvName()] = {
    value: __get__(oVhData),
    writable: false,
    enumerable: false,
    configurable: false
  };
  Object.defineProperties(oProtocol, oDefineProperties);

  //设置当前协议
  oProtocol.__proto__ = Object.freeze({
    "self": oSelf,
    "const": oConst,
    "static": oStatic
  });

  return Object.freeze(oProtocol);
};
