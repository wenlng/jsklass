/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */

import {
  Utils,
  Arrays,
  Objects,
  Functions
} from "../utils/index";
import * as Console from "../console/index";

import {
  generateClassId,
  getRunEnvName
} from "./identification";
import {
  classOfInstance,
  classOfExtend,
  classOfProtocol,
  toClassString,
  convertCode,
  __get__,
  setStatic,
  getStatic,
  getConst,
  getDataWithRunEnv,
  makeInstance,
  remakeInstance
} from "./helpers";
import {ImplementProtocol} from "./implement-protocol";
import {validateClass} from "./validate-class";
import {validateRule} from "./validate-rule";
import {VHClass} from "./virtual-handler";

/**
 * Implementing class definition structure
 * @param name
 * @param _constructor
 * @param _extends
 * @param _protocol
 * @param _prototype
 * @return {Class|*}
 * @constructor
 */
export const Class = function (name, _constructor, _extends, _protocol, _prototype) {
  // Data sources used within classes
  let oVhData = {
      "name": name,
      "id": "",
      "key": "",
      "super_name": [],
      "protocol_name": [],
      "constructor": _constructor,
      "constructor_list": [],
      "self": {},
      "prototype": {},
      "super_self": {},
      "super_prototype": {},
      "const": {},
      "static": {},
      "protocol": {}
    },
    oKlass = function () {
    },
    oClassPrototype  = (Functions.isFunction(_prototype) ? new _prototype : new function ClassPrototype() {
    }),
    oDefineProperties,
    sId = generateClassId(),
    oSelf = {},
    oPrototype = {},
    oSuperSelf = {},
    oSuperPrototype = {},
    oConst = {},
    oConstPack = {},
    oStatic = {},
    oSuperName = [],
    oProtocolName = [],
    oProtocol = {};
    let oConstructorList = [
      {
        "constructor": _constructor,
        "top_prototype": oClassPrototype,
        "self": oSelf,
        "prototype": oPrototype,
        "const": oConst,
        "static": oStatic
      }
    ];

  // Check for compliance with specifications
  if (!validateClass(name, _constructor, _extends, _protocol)) return false;

  // Process extends parent classes
  if (!Utils.isEmpty(_extends)) {
      const
        extConstructorList = getDataWithRunEnv(_extends, "constructor_list"),
        extSelf = getDataWithRunEnv(_extends, "self"),
        extSuperSelf = getDataWithRunEnv(_extends, "super_self"),
        extPrototype = getDataWithRunEnv(_extends, "prototype"),
        extSuperPrototype = getDataWithRunEnv(_extends, "super_prototype"),
        extConst = getDataWithRunEnv(_extends, "const"),
        extStatic = getDataWithRunEnv(_extends, "static"),
        extName = getDataWithRunEnv(_extends, "name"),
        extId = getDataWithRunEnv(_extends, "id"),
        extSuperName = getDataWithRunEnv(_extends, "super_name"),
        extProtocolName = getDataWithRunEnv(_extends, "protocol_name"),
        extProtocol = getDataWithRunEnv(_extends, "protocol")
      ;

      Utils.each(extConstructorList, function (lk, lv) {
          oConstructorList.push(lv);
      });

      Utils.each(extSuperSelf, function (tk, tv) {
          oSuperSelf[tk] = tv;
      });

      Utils.each(extSuperPrototype, function (pk, pv) {
          oSuperPrototype[pk] = pv;
      });

      Utils.each(extConst, function (ck, cv) {
          oConst[ck] = cv;
      });

      Utils.each(extStatic, function (sk, sv) {
          oStatic[sk] = sv;
      });

      Utils.each(extSuperName, function (sk, sv) {
          oSuperName.push(sv);
      });

      Utils.each(extProtocolName, function (ik, iv) {
          oProtocolName.push(iv);
      });

      Utils.each(extProtocol, function (pk, pv) {
        oProtocol[pk] = pv;
      });

      Utils.each(extSelf, function (tk, tv) {
          !oSuperSelf[tk] && (oSuperSelf[tk] = tv);
      });

      Utils.each(extPrototype, function (pk, pv) {
          !oSuperPrototype[pk] && (oSuperPrototype[pk] = pv);
      });

      oSuperName.unshift({ "id": extId, "name": extName });
  }

  // Process compliance protocol
  if(!Utils.isEmpty(_protocol)){
    _protocol = Arrays.isArray(_protocol) ? _protocol : [_protocol];
    Utils.each(_protocol, function (key, pro) {
      Utils.each(getDataWithRunEnv(pro, "implement_list"), function (name, list) {
        Utils.isEmpty(oProtocol[name]) && (oProtocol[name] = {});
        oProtocol[name] = Objects.mergeObject(oProtocol[name], list);
      });

      oProtocolName.push({"id": getDataWithRunEnv(pro, "id"), "name": getDataWithRunEnv(pro, "name")});
    });
  }

  // Process current classes
  _constructor(oSelf, oConst, oStatic, Object.freeze({}), oPrototype);

  // Verification rule (final and keyWork and ...)
  if (!validateRule(name, {
      "self": oSelf,
      "const": oConst,
      "static": oStatic,
      "prototype": oPrototype
    })) return false;

  // Implementation of Verification Protocol
  if (!ImplementProtocol(name, oProtocol, oSelf, oSuperSelf, oPrototype, oSuperPrototype, oConst, oStatic)) return false;

  // Save source data
  oVhData["constructor_list"] = oConstructorList;
  oVhData["self"] = oSelf;
  oVhData["super_self"] = oSuperSelf;
  oVhData["prototype"] = oPrototype;
  oVhData["super_prototype"] = oSuperPrototype;
  oVhData["const"] = oConst;
  oVhData["static"] = oStatic;
  oVhData["name"] = name;
  oVhData["id"] = sId;
  oVhData["key"] = convertCode(sId);
  oVhData["super_name"] = oSuperName;
  oVhData["protocol_name"] = oProtocolName;
  oVhData["protocol"] = oProtocol;

  let GV = {
      "constructor_list": oConstructorList,
      "prototype": oPrototype,
      "self": oSelf,
      "const": oConst,
      "static": oStatic,

      "name": name,
      "id": sId,
      "super_name": oSuperName,
      "vh_data": oVhData,

      "klass": function () {
      },
      "_": {"_": VHClass},
      "console": Console
    },
    evalStr = "function (GV, _){" +
      "GV.klass = function " + name + "() {" +
      "_._._(GV, this, arguments);" +
      "};" +
      "}";

  try {
    Functions.evil(evalStr)(GV, GV);
    oKlass = GV.klass;
  } catch (e) {
    Console.exit(e);
  }

  // Process const
  Utils.each(oConst, function (name, value) {
    oConstPack[name] = {
      value: value,
      writable: false,
      enumerable: false,
      configurable: false
    };
  });

  // Define Properties
  oDefineProperties = {
    "constructor": {
      value: _constructor,
      writable: false,
      enumerable: false,
      configurable: false
    },
    "name": {
      value: name,
      writable: false,
      enumerable: false,
      configurable: false
    },
    "class_name": {
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
    "protocol_name": {
      value: oProtocolName,
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
    "setStatic": {
      value: setStatic(oStatic),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "getStatic": {
      value: getStatic(oStatic),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "getConst": {
      value: getConst(oConst),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "toString": {
      value: toClassString(sId, name),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "extendOf": {
      value: classOfExtend(oKlass),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "instanceOf": {
      value: classOfInstance(oKlass),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "protocolOf": {
      value: classOfProtocol(oKlass),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "new": {
      value: makeInstance(oKlass),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "renew": {
      value: remakeInstance(oKlass),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "kindClass": {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    }
  };
  oDefineProperties[getRunEnvName()]= {
    value: __get__(oVhData),
    writable: false,
    enumerable: false,
    configurable: false
  };
  Object.defineProperties(oKlass, oDefineProperties);

  oStatic.__proto__ = oKlass.__proto__;
  oKlass.__proto__ = Utils.freeze(Object.create(oStatic, oConstPack));

  // Process class prototype
  oKlass.prototype = oClassPrototype;
  return Object.freeze(oKlass);
};