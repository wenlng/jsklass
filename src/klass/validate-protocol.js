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
  Objects,
  Jsons,
  Arrays
} from "../utils/index";
import * as Console from "../console/index";
import {
  hasProtocolId
} from "./identification";
import {
  hasRunEnvGetter,
  getDataWithRunEnv
} from "./helpers"
import {
  hasFinalName,
  filterFinalName
} from "./validate-rule";
import {KeyWord} from "./constant";

/**
 * 检测接口定义类型是否合法
 * @param _defined
 * @return {boolean}
 */
export const checkProtocolType = (_defined) => {
  let attrName = null;
  Utils.each(_defined, (name, value) => {
    if (Utils.isEmpty(Utils.getDefaultVal(value, "type")) &&  Utils.isEmpty(Utils.getDefaultVal(value, "model"))) {
      attrName = name;
      return false;
    }
  });
  return attrName;
};

/**
 * 验证协议的规范
 * @param _name
 * @param _self
 * @param _const
 * @param _static
 * @param _extends
 * @returns {boolean}
 */
export const validateProtocol = (_name, _self, _const, _static, _extends) => {
  const matchVar = /^[A-Z][A-Za-z0-9_]+$/g,
    trimSpaceRep = /[\s+]/g,
    trimArgsRep = /\((.*)\)/g,
    trimStructRep = /\{(.*)\}/g,
    uppercaseRep = /^[A-Z_$]+$/i,
    structStr = '{}',
    structStr2 = 'function(?,?){}',
    presetKeyWord = ["$_construct", "$_encoder", "$_decoder", "$toString"];

  let tmpSelfNames = [],
    isKeyWord = false,
    isExcludeConstructor = false,
    curName = "",
    isOverwrite = false,
    isLowercase = false;

  if (!_name) {
    Console.exit(`没有给定接口名`);
  }

  if (!Strings.isString(_name)) {
    Console.exit(`<${_name}> 协议名称必须是string类型`);
  }

  if (!matchVar.test(_name)) {
    Console.exit(`<${_name}> 协议命名定义不规范,必须是以大写字母开头`);
  }

  if (_self) {
    if (!Objects.isObject(_self)) {
      Console.exit(`<${_name}> 协议中“self”定义的结构体必须是[Object]类型`);
    }

    if (!Jsons.isJson(_self)) {
      Console.exit(`<${_name}> 协议中“self”定义的结构体的格式必须是: {}`);
    }

    const checkSelfType = checkProtocolType(_self);
    if (checkSelfType) {
      Console.exit(`<${_name}> 协议中“self”定义的结构体的值类型不合法,类型必须是: ProtocolType -> ${checkSelfType}`);
    }

    const selfStr = JSON.stringify(_self).replace(trimSpaceRep, '').replace(trimStructRep, '{}');
    if (structStr !== selfStr) {
      Console.exit(`<${_name}> 协议中“self”定义的结构体不规范,格式必须是: ${structStr}`);
    }

    //检测是否存在重复的final;
    Utils.each(_self, function (name, value) {
      if (presetKeyWord.indexOf(name) > -1) {
        curName = name;
        isExcludeConstructor = true;
        return false;
      }

      if (KeyWord.indexOf(name) > -1) {
        curName = name;
        isKeyWord = true;
        return false;
      }

      if (hasFinalName(name)) {
        let reName = filterFinalName(name);//过滤$
        if (tmpSelfNames.indexOf(reName) > -1) {
          curName = reName;
          isOverwrite = true;
          return false;
        }
        tmpSelfNames.push(reName);
      } else if (tmpSelfNames.indexOf(name) > -1) {
        curName = name;
        isOverwrite = true;
        return false;
      }
    });
    if (isKeyWord) {
      Console.exit(`<${_name}> 协议中“self”定义的名称不可使用关键：${curName}`);
      return false
    } else if (isExcludeConstructor) {
      Console.exit(`<${_name}> 协议中“self”定义的“${curName}”构造函数不允许设置为[Final]类型`);
      return false
    } else if (isOverwrite) {
      Console.exit(`<${curName}> 协议中“self”定义的名称已存在`);
      return false
    }
  }

  if (_static) {
    if (!Objects.isObject(_static)) {
      Console.exit(`<${curName}> 协议中“static”定义的结构体必须是[Object]类型`);
    }

    if (!Jsons.isJson(_static)) {
      Console.exit(`<${_name}> 协议中“static”定义的结构体的格式必须是: {}`);
    }

    const staticStr = JSON.stringify(_static).replace(trimSpaceRep, '').replace(trimStructRep, '{}');
    if (structStr !== staticStr) {
      Console.exit(`<${_name}> 协议中“static”定义的结构体不规范,格式必须是: ${structStr}`);
    }

    const checkStaticType = checkProtocolType(_static);
    if (checkStaticType) {
      Console.exit(`<${_name}> 协议中“static”定义的结构体的值类型不合法,类型必须是: ProtocolType -> ${checkStaticType}`);
    }
  }

  //类常量
  if (_const) {
    if (!Objects.isObject(_const)) {
      Console.exit(`<${_name}> 协议中“const”定义的结构体必须是[Object]类型`);
    }

    if (!Jsons.isJson(_const)) {
      Console.exit(`<${_name}> 协议中“const”定义的结构体的格式必须是: {}`);
    }

    const staticStr = JSON.stringify(_const).replace(trimSpaceRep, '').replace(trimStructRep, '{}');
    if (structStr !== staticStr) {
      Console.exit(`<${_name}> 协议中“const”定义的结构体不规范,格式必须是: ${structStr}`);
    }

    const checkStaticType = checkProtocolType(_const);
    if (checkStaticType) {
      Console.exit(`<${_name}> 协议中“const”定义的结构体的值类型不合法,类型必须是ProtocolType -> ${checkStaticType}`);
    }

    //检测是否存在小写的名称并且是关键词;
    Utils.each(_const, function (name, value) {
      if (!uppercaseRep.test(name)) {
        curName = name;
        isLowercase = true;
        return false;
      }

      if (KeyWord.indexOf(name) > -1) {
        curName = name;
        isKeyWord = true;
        return false;
      }
    });
    if (isKeyWord) {
      Console.exit(`<${_name}> 协议中“const”定义的名称不可使用关键：${curName}`);
      return false
    } else if (isLowercase) {
      Console.exit(`<${_name}> 协议中“const”定义的名称必须全部以大写命名：${curName}`);
    }
  }

  if (Arrays.isArray(_extends)) {
    Utils.each(_extends, function (k, ext) {
      if (
        Utils.isEmpty(ext.name)
        || Utils.isEmpty(ext.id)
        || !hasProtocolId(ext.id)
        || !hasRunEnvGetter(ext)
        || Utils.isEmpty(getDataWithRunEnv(ext, "key"))
      ) {
        Console.exit(`<${_name}> 协议继承定义的结构体不规范: ${_name}`);
      }

      if (!Functions.isFunction(ext)) {
        Console.exit(`<${_name}> 协议继承定义的结构体定义不规范,格式必须是: ${structStr2}`);
      }
    });
  }

  tmpSelfNames = [];
  return true;
};

