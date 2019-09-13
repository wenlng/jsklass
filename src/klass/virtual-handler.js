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
  Jsons,
  Arrays,
  Objects
} from "../utils/index";
import * as Console from "../console/index";
import {
  hasFinalName,
  filterFinalName
} from "./validate-rule";
import {
  toInstanceString,
  instanceOfClass,
  instanceOfProtocol,
  toInstanceJson,
  __get__,
  setStatic,
  getStatic,
  getConst
} from "./helpers";
import {
  parseTypeRule,
  setProtocolTypeRuleValue,
  getProtocolTypeRuleOfSetterAndGetterValue,
  setProtocolTypeRuleOfSetterAndGetterValue,
  getGetterAndSetterValueConfig,
  setGetterAndSetterValue,
  getFinalGetterAndSetterValueConfig,
  setFinalGetterAndSetterValue
} from "./validate-type-rule"
import {
  generateInstanceId,
  getRunEnvName,
  getRemakeInstanceTag
} from "./identification";

/**
 * 实现构造体
 * @param superIndex
 * @return {string}
 */
const VHConstruct = function(superIndex){
  return (`function(GV, oSupers, oCallSupersConstruct, oSupersConstructList){Object.defineProperty(oSupers, "_construct", {value: function(){if(oCallSupersConstruct.indexOf('${superIndex}') > -1 ){GV.console.exit("构造函数只支持在构造对象时调用一次！"); return false;}oCallSupersConstruct.push('${superIndex}');oSupersConstructList['${superIndex}'].apply(this, arguments);},writable: false,enumerable: false,configurable: false});}`);
};


/**
 * 实现类定义结构
 * @param GV
 * @param self
 * @param args
 */
export const VHClass = function (GV, self, args) {
  let supers = {
      0: {
        "_construct": function () {
        },
        "_encoder": function () {
          return {};
        },
        "_decoder": function () {
        }
      }
    }
    , superIndex = 0
    , isRenew = false
    , oArguments = (Arrays.convertArgsToArray(args)).filter(function (value, index) {
      if (!Utils.isEmpty(value) && getRemakeInstanceTag() === value.toString()) {
        isRenew = true;
        return false;
      }
      return true;
    })
    , oDefineProperties = {}

    //预处理父类的prototype
    , curSelfPrototype = {}
    , filterSelfPrototype = {}

    //构造列表
    , oConstructorList = Utils.getDefaultVal(GV, "constructor_list", [])
    //参数
    //, cloneStatic = Objects.shallowCopyObject({}, GV.static)
    , name = Utils.getDefaultVal(GV, "name")
    , sId = generateInstanceId()
    , classId = Utils.getDefaultVal(GV, "id")
    //当前对象预置的一些操作属性
    , curProHandle = {}
    //遵从协议
    , selfRule = Utils.getDefaultVal(GV.vh_data, "protocol.self", {})
    //需要特殊处理的预置函数
    , handlePresetFuncName = ["_encoder", "toString"]
    , handlePresetFuncName2 = ["_decoder", "_construct"]
    //处理的final缓存
    , handleFinalNameTmp = []
    //当前最近的ClassPrototype
    , curClassPrototype = {}
  ;

  //处理所有构造
  Utils.reverseEach(oConstructorList, function (level, con) {
    let
      //准备当前父类
      curSuper = supers[superIndex++]
      //准备下一个父类
      , readySupers = {}
      , readySuperPrototypes = {}
      //准备当前构造
      , curConstructor = Utils.getDefaultVal(con, "constructor", {})
      //当前self属性
      , curSelf = Utils.getDefaultVal(con, "self", {})
      //当前prototype属性
      , curPrototype = Utils.getDefaultVal(con, "prototype", {})
      //当前类顶级prototype
      , curTopPrototype = Utils.getDefaultVal(con, "top_prototype", {})
    ;

    //Utils.freeze(GV.const)
    Functions.isFunction(curConstructor) && curConstructor.apply(self, [self, Utils.seal(GV.const), GV.static, Utils.preventExtension(curSuper), curSelfPrototype]);
    //Utils.freeze(curSuper)

    //缓存当前类的原型
    if(Utils.isEmpty(curClassPrototype) || !Utils.isEmpty(curTopPrototype)){
      curClassPrototype = curTopPrototype;
    }

    //准备父类self
    Utils.each(curSelf, function (name, value) {
      const _name = filterFinalName(name); //过滤$

      //验证当前对象的不可覆写属性修饰符$
      if(self.propertyIsEnumerable(name) && handlePresetFuncName2.indexOf(_name) < 0) {
        if (handleFinalNameTmp.indexOf(_name) > -1) {
          Console.exit(`不可覆写[Final]类型的属性成员：self.${_name}`);
          return false;
        }
        if (hasFinalName(name)) {
          setFinalGetterAndSetterValue(self, _name, self[name], "self");
          delete self[name];
          handleFinalNameTmp.push(_name);
        }
      }

      if (Functions.isFunction(self[_name])) {
        if(self.propertyIsEnumerable(_name)){
          if (handlePresetFuncName.indexOf(_name) > -1) {
            Object.defineProperty(readySupers, _name, {
              value: self[_name],
              writable: false,
              enumerable: true,
              configurable: false
            });
          }else if (hasFinalName(name) && handlePresetFuncName2.indexOf(_name) < 0) {
            //不可覆写属性修饰符$
            readySupers[_name] = {
              value: self[name],
              writable: false,
              enumerable: true,
              configurable: false
            };
          }else{
            readySupers[_name] = self[_name];
          }
        }
      }else{
        Object.defineProperty(readySupers, _name, {
          configurable: true,
          enumerable: true,
          get: function () {
            return self[_name];
          },
          set: function (value) {
            self[_name] = value;
          }
        });
      }
    });

    //准备父类prototype
    Utils.each(curPrototype, function (name, value) {
      if ("_construct" !== name) {
        const _name = filterFinalName(name); //过滤Fanil

        //验证当前对象的不可覆写属性修饰符$
        if (handleFinalNameTmp.indexOf(_name) > -1) {
          Console.exit(`不可覆写[Final]类型的属性成员：prototype.${_name}`);
          return false;
        }

        if (handlePresetFuncName.indexOf(_name) > -1) {
          Object.defineProperty(readySuperPrototypes, name, {
            value: !Utils.isEmpty(self[name]) ? self[name] : curSelfPrototype[name],
            writable: false,
            enumerable: true,
            configurable: false
          });
        }else if (hasFinalName(name) && handlePresetFuncName2.indexOf(_name) < 0) {
          setFinalGetterAndSetterValue(readySuperPrototypes, _name, !Utils.isEmpty(self[name]) ? self[name] : curSelfPrototype[name], "prototype");
          handleFinalNameTmp.push(_name);
        } else if (Objects.inObject(selfRule, name)) {
          let typeRule = parseTypeRule(Utils.getDefaultVal(selfRule, name, {}));
          setProtocolTypeRuleOfSetterAndGetterValue(readySuperPrototypes, name, self, curSelfPrototype, typeRule, "prototype");
        } else{
          setGetterAndSetterValue(readySuperPrototypes, _name, self, curSelfPrototype);
        }
      }
    });

    //保存当前对象用作父类
    readySuperPrototypes.__proto__ = curTopPrototype;
    readySupers.__proto__ = readySuperPrototypes;
    supers[superIndex] = readySupers;
  });

  //处理当前对象prototype与协议赋值类型
  Utils.each(curSelfPrototype, function (name, value) {
    const _name = filterFinalName(name);

    if (handlePresetFuncName.indexOf(_name) > -1) {
      filterSelfPrototype[name] = {
        value: value,
        writable: false,
        enumerable: true,
        configurable: false
      };
    }else if (hasFinalName(name) && handlePresetFuncName2.indexOf(_name) < 0) {
      filterSelfPrototype[_name] = getFinalGetterAndSetterValueConfig(_name, value, "prototype");
    } else if (Objects.inObject(selfRule, name)) {
      let typeRule = parseTypeRule(Utils.getDefaultVal(selfRule, name, {}));
      filterSelfPrototype[_name] = getProtocolTypeRuleOfSetterAndGetterValue(curSelfPrototype, name, typeRule, "prototype");
    } else {
      filterSelfPrototype[name] = getGetterAndSetterValueConfig(curSelfPrototype, name);
    }
  });

  oDefineProperties = {
    "id": {
      value: sId,
      writable: false,
      enumerable: false,
      configurable: false
    },
    "setStatic": {
      value: setStatic(GV.static),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "getStatic": {
      value: getStatic(GV.static),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "getConst": {
      value: getConst(GV.const),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "toString": {
      value: toInstanceString(sId, classId, name),
      writable: true,
      enumerable: false,
      configurable: true
    },
    "toJSON": {
      value: toInstanceJson(),
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
    "classOf": {
      value: instanceOfClass(self),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "protocolOf": {
      value: instanceOfProtocol(self),
      writable: false,
      enumerable: false,
      configurable: false
    },
    "kindInstance": {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    }
  };
  oDefineProperties[getRunEnvName()] = {
    value: __get__(GV.vh_data),
    writable: false,
    enumerable: false,
    configurable: false
  };
  Object.defineProperties(curProHandle, oDefineProperties);

  //处理类原型的原型
  curProHandle.__proto__ = curClassPrototype;
  self.__proto__ = Object.freeze(Object.create(curProHandle, filterSelfPrototype));

  //处理当前对象协议赋值类型
  Utils.each(selfRule, function (name, value) {
    const _name = filterFinalName(name);
    if(
      handleFinalNameTmp.indexOf(_name) < 0
      && self.propertyIsEnumerable(name)
      && handlePresetFuncName2.indexOf(_name) < 0
    ){
      if(hasFinalName(name)){
        let typeRule = parseTypeRule(Utils.getDefaultVal(selfRule, name, {}));
        setProtocolTypeRuleValue(self, _name, self[name], typeRule, "self");
        delete self[name];
      }else{
        let typeRule = parseTypeRule(Utils.getDefaultVal(selfRule, name, {}));
        setProtocolTypeRuleValue(self, _name, self[_name], typeRule, "self");
      }
    }
  });

  //调用当前对象的构造函数
  if (isRenew) {
    if (!Functions.isFunction(self["_decoder"])) {
      Console.exit(`<${name}> 类请实现 sl._encoder=[function]`);
    }
    (oArguments.length > 0) && (oArguments[0] = Jsons.parseJson(Jsons.stringify(oArguments[0])));
    self["_decoder"].apply(self, oArguments);
  } else if (self["_construct"]) {
    self["_construct"].apply(self, oArguments);
  }
  self["_decoder"] && (delete self["_decoder"]);
  self["_construct"] && (delete self["_construct"]);

  //禁用当前对象的super构造函数
  Utils.each(supers, function (superIndex, superObj) {
    superObj["_decoder"] && (delete superObj["_decoder"]);
    superObj["_construct"] && (delete superObj["_construct"]);
    Utils.freeze(superObj);
  });

  //清缓存
  handleFinalNameTmp = [];
};

/**
 * 实现协议体
 * @param GV
 * @param self
 */
export const VHProtocol = function(GV, self){

};