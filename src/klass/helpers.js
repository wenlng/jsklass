/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
 */

import {
  Utils,
  Arrays,
  Functions,
  Strings
} from "../utils/index";
import {
  getRunEnvId,
  getRunEnvName,
  getRemakeInstanceTag,
  hasClassId,
  hasProtocolId,
  hasInstanceId
} from "./identification";
import * as Console from "../console/index";

/**
 * Package Code
 * @param id
 * @return {string}
 */
export const convertCode = (id) => {
  return getRunEnvId() + "@" + id;
};

/**
 * Format Code
 * @param arr
 * @return {string}
 */
export const formatCode = (arr) => {
  arr = Arrays.isArray(arr) ? arr : [];
  return arr.join("@");
};

/**
 * Verify the legal of classes
 * @param name
 * @param key
 * @param id
 * @return {boolean}
 */
export const checkClassLegal = (name, key, id) => {
  return !Utils.isEmpty(name) && convertCode(id) === key;
};

/**
 * Verify the legal of instance
 * @param name
 * @param key
 * @param id
 * @return {boolean}
 */
export const checkInstanceLegal = (name, key, id) => {
  return !Utils.isEmpty(name) && convertCode(id) === key;
};

/**
 * 验证某个实例是否是当前类实例
 * @param klass
 * @return {function(*)}
 */
export const classOfInstance = (klass) => {
  return (instance) => {
    let classNameList = [],
      sKey = "",
      sId = "",
      sName = "",
      sName2 = "",
      supperName = [],
      curName = "";

    if (
      Utils.isEmpty(instance.id)
      || !hasInstanceId(instance.id)
      || !hasRunEnvGetter(instance)
      || Utils.isEmpty(getDataWithRunEnv(instance, "key"))
    ){
      return false;
    }

    try {
      if(hasRunEnvGetter(instance)){
        sKey = getDataWithRunEnv(instance, "key");
        sName = getDataWithRunEnv(instance, "name");
      }

      if(hasRunEnvGetter(klass)){
        sId = getDataWithRunEnv(klass, "id");
        sName2 = getDataWithRunEnv(klass, "name");
        supperName = getDataWithRunEnv(klass, "super_name");
      }
      classNameList.push({"id": sId, "name": sName2});
      if (Arrays.isArray(supperName)) {
        classNameList = Arrays.mergeArray(classNameList, supperName);
      }
    }catch (e){}

    Utils.each(classNameList, (key, obj) => {
      const id = Utils.getDefaultVal(obj, "id"),
        name = Utils.getDefaultVal(obj, "name");

      let curKey = convertCode(id);
      if (curKey === sKey) {
        curName = name;
        return false;
      }
    });

    return (curName === sName);
  };
};

/**
 * 验证某个类实例是否是当前实例
 * @param instance
 * @return {function(*)}
 */
export const instanceOfClass = (instance) => {
  return (klass) => {
    let classNameList = [],
      sKey = "",
      sId = "",
      sName = "",
      sName2 = "",
      supperName = [],
      curName = "";

    if (
      Utils.isEmpty(klass.id)
      || !hasClassId(klass.id)
      || !hasRunEnvGetter(klass)
      || Utils.isEmpty(getDataWithRunEnv(klass, "key"))
    ){
      return false;
    }

    try {
      if(hasRunEnvGetter(klass)){
        sKey = getDataWithRunEnv(klass, "key");
        sName = getDataWithRunEnv(klass, "name");
      }

      if(hasRunEnvGetter(instance)){
        sId = getDataWithRunEnv(instance, "id");
        sName2 = getDataWithRunEnv(instance, "name");
        supperName = getDataWithRunEnv(instance, "super_name");
      }
      classNameList.push({"id": sId, "name": sName2});
      if (Arrays.isArray(supperName)) {
        classNameList = Arrays.mergeArray(classNameList, supperName);
      }
    }catch (e){}

    Utils.each(classNameList, (key, obj) => {
      const id = Utils.getDefaultVal(obj, "id"),
        name = Utils.getDefaultVal(obj, "name");

      let curKey = convertCode(id);
      if (curKey === sKey) {
        curName = name;
        return false;
      }
    });

    return (curName === sName);
  };
};

/**
 * 验证某个类是否继承某个类
 * @param klass
 * @return {function(*)}
 */
export const classOfExtend = (klass) => {
  return (extend) => {
    let classNameList = [],
      sKey = "",
      sId = "",
      sName = "",
      sName2 = "",
      supperName = [],
      curName = "";

    if (
      Utils.isEmpty(extend.id)
      || !hasClassId(extend.id)
      || !hasRunEnvGetter(extend)
      || Utils.isEmpty(getDataWithRunEnv(extend, "key"))
    ){
      return false;
    }


    try {
      if(hasRunEnvGetter(extend)){
        sKey = getDataWithRunEnv(extend, "key");
        sName = getDataWithRunEnv(extend, "name");
      }

      if(hasRunEnvGetter(klass)){
        sId = getDataWithRunEnv(klass, "id");
        sName2 = getDataWithRunEnv(klass, "name");
        supperName = getDataWithRunEnv(klass, "super_name");
      }
      classNameList.push({"id": sId, "name": sName2});
      if (Arrays.isArray(supperName)) {
        classNameList = Arrays.mergeArray(classNameList, supperName);
      }
    }catch (e){}

    Utils.each(classNameList, (key, obj) => {
      const id = Utils.getDefaultVal(obj, "id"),
        name = Utils.getDefaultVal(obj, "name");

      let curKey = convertCode(id);
      if (curKey === sKey) {
        curName = name;
        return false;
      }
    });

    return (curName === sName);
  };
};

/**
 * 验证当前类是否实现了某个协议
 * @param klass
 * @return {function(*)}
 */
export const classOfProtocol = (klass) => {
  return (protocol) => {
    let protocolNameList = [],
      sKey = "",
      sName = "",
      curName = "";

    if (
      Utils.isEmpty(protocol.id)
      || !hasProtocolId(protocol.id)
      || !hasRunEnvGetter(protocol)
      || Utils.isEmpty(getDataWithRunEnv(protocol, "key"))
    ){
      return false;
    }

    try {
      if(hasRunEnvGetter(protocol)){
        sKey = getDataWithRunEnv(protocol, "key");
        sName = getDataWithRunEnv(protocol, "name");
      }
      if(hasRunEnvGetter(klass)){
        protocolNameList = getDataWithRunEnv(klass, "protocol_name");
      }
    }catch (e){}

    Utils.each(protocolNameList, (key, obj) => {
      const id = Utils.getDefaultVal(obj, "id"),
        name = Utils.getDefaultVal(obj, "name");

      let curKey = convertCode(id);
      if (curKey === sKey) {
        curName = name;
        return false;
      }
    });

    return (curName === sName);
  };
};

/**
 * 验证当前实例是否实现了某个协议
 * @param instance
 * @return {function(*)}
 */
export const instanceOfProtocol = (instance) => {
  return (protocol) => {
    let protocolNameList = [],
      sKey = "",
      sName = "",
      curName = "";

    if (
      Utils.isEmpty(protocol.id)
      || !hasProtocolId(protocol.id)
      || !hasRunEnvGetter(protocol)
      || Utils.isEmpty(getDataWithRunEnv(protocol, "key"))
    ){
      return false;
    }

    try {
      if(hasRunEnvGetter(protocol)){
        sKey = getDataWithRunEnv(protocol, "key");
        sName = getDataWithRunEnv(protocol, "name");
      }
      if(hasRunEnvGetter(instance)){
        protocolNameList = getDataWithRunEnv(instance, "protocol_name");
      }
    }catch (e){}

    Utils.each(protocolNameList, (key, obj) => {
      const id = Utils.getDefaultVal(obj, "id"),
        name = Utils.getDefaultVal(obj, "name");

      let curKey = convertCode(id);
      if (curKey === sKey) {
        curName = name;
        return false;
      }
    });

    return (curName === sName);
  };
};

/**
 * 验证当前协议是否继承某个协议
 * @param protocol
 * @return {function(*)}
 */
export const extendOfProtocol = (protocol) => {
  return (extend) => {
    let protocolNameList = [],
      sKey = "",
      sName = "",
      curName = "";

    if (
      Utils.isEmpty(extend.id)
      || !hasProtocolId(extend.id)
      || !hasRunEnvGetter(extend)
      || Utils.isEmpty(getDataWithRunEnv(extend, "key"))
    ){
      return false;
    }

    try {
      if(hasRunEnvGetter(extend)){
        sKey = getDataWithRunEnv(extend, "key");
        sName = getDataWithRunEnv(extend, "name");
      }
      if(hasRunEnvGetter(protocol)){
        protocolNameList = getDataWithRunEnv(protocol, "protocol_name");
      }
    }catch (e){}

    Utils.each(protocolNameList, (key, obj) => {
      const id = Utils.getDefaultVal(obj, "id"),
        name = Utils.getDefaultVal(obj, "name");

      let curKey = convertCode(id);
      if (curKey === sKey) {
        curName = name;
        return false;
      }
    });

    return (curName === sName);
  };
};

/**
 * 验证某个类实例是否实现了当前的协议
 * @param protocol
 * @return {function(*)}
 */
export const protocolOfInstance = (protocol) => {
  return (instance) => {
    let protocolNameList = [],
      sKey = "",
      sName = "",
      curName = "";

    if (
      Utils.isEmpty(instance.id)
      || !hasInstanceId(instance.id)
      || !hasRunEnvGetter(instance)
      || Utils.isEmpty(getDataWithRunEnv(instance, "key"))
    ){
      return false;
    }

    try {
      if(hasRunEnvGetter(instance)){
        protocolNameList = getDataWithRunEnv(instance, "protocol_name");
      }

      if(hasRunEnvGetter(protocol)){
        sKey = getDataWithRunEnv(protocol, "key");
        sName = getDataWithRunEnv(protocol, "name");
      }
    }catch (e){}

    Utils.each(protocolNameList, (key, obj) => {
      const id = Utils.getDefaultVal(obj, "id"),
        name = Utils.getDefaultVal(obj, "name");

      let curKey = convertCode(id);
      if (curKey === sKey) {
        curName = name;
        return false;
      }
    });

    return (curName === sName);
  };
};



/**
 * __get__
 * @param oVhData
 * @return {function(*, *)}
 * @private
 */
export const __get__ = (oVhData) => {
  return (pk, attr) => {
    let res = null;
    if (pk === getRunEnvId()) {
      res = oVhData[attr] ? oVhData[attr] : null;
    }
    return res;
  }
};

/**
 * 设置静态区
 * @param oStatic
 * @return {function(*, *)}
 */
export const setStatic = (oStatic) => {
  return (name, value) => {
    oStatic[name] = value;
  }
};

/**
 * 获取静态区
 * @param oStatic
 * @return {function(*=, *)}
 */
export const getStatic = (oStatic) => {
  return (name, defaultVal) => {
    if (Utils.isEmpty(name)) {
      return Utils.freeze(Utils.extend([true, {}, oStatic]));
    }
    return oStatic[name] ? oStatic[name] : defaultVal;
  }
};


/**
 * 获取常量区
 * @param oConst
 * @return {function(*=, *)}
 */
export const getConst = (oConst) => {
  return (name, defaultVal) => {
    if (Utils.isEmpty(name)) {
      return Utils.freeze(Utils.extend([true, {}, oConst]));
    }
    return oConst[name] ? oConst[name] : defaultVal;
  }
};

/**
 * 从环境Getter获取对应属性
 * @param obj
 * @param attr
 * @return {*}
 */
export const getDataWithRunEnv = (obj, attr) => {
  let res = {};
  try {
    if (hasRunEnvGetter(obj)) {
      const getter = obj[getRunEnvName()];
      res = getter(getRunEnvId(), attr);
    }
  } catch (e) {
  }

  return res;
};

/**
 * 检测是否存在环境Getter
 * @param obj
 * @return {*}
 */
export const hasRunEnvGetter = (obj) => {
  let res = false;
  try {
    const getter = obj[getRunEnvName()];
    res = Functions.isFunction(getter);
  } catch (e) {
  }

  return res;
};

/**
 * toString
 * @param id
 * @param name
 * @return {function()}
 */
export const toClassString = (id, name) => {
  return function () {
    return name + "@@" + id;
  }
};

/**
 * remake 创建类实例
 * @param klass
 * @return {function()}
 */
export const remakeInstance = (klass) => {
  return function () {
    let instance = Object.create(klass.prototype),
      args = Arrays.convertArgsToArray(arguments);
    args.push(getRemakeInstanceTag());
    klass.apply(instance, args);
    return instance;
  }
};

/**
 * make 创建类实例
 * @param klass
 * @return {function()}
 */
export const makeInstance = (klass) => {
  return function () {
    let instance = Object.create(klass.prototype);
    klass.apply(instance, Array.prototype.slice.apply(arguments));
    return instance;
  }
};


/**
 * toString
 * @param id
 * @param name
 * @return {function()}
 */
export const toProtocolString = (id, name) => {
  return () => {
    return name + "@@" + id;
  }
};

/**
 * toInstanceString
 * @param instanceId
 * @param classId
 * @param name
 * @return {function()}
 */
export const toInstanceString = (instanceId, classId, name) => {
  return () => {
    return instanceId + "@@" + name + "@@" + classId;
  }
};


/**
 * toJson
 * @return {function()}
 */
export const toInstanceJson = () => {
  return function () {
    let name = "";
    try {
      if(hasRunEnvGetter(this)){
        name = getDataWithRunEnv(this, "name");
      }
    }catch (e){}
    if (!Functions.isFunction(this["_encoder"])) {
      Console.exit(`<${name}> 类请实现 sl._encoder=[function]`);
    }
    return this["_encoder"]();
  }
};

/**
 * 格式getter
 * @param name
 * @return {*}
 */
export const formatGetterName = (name) => {
  if(Utils.isEmpty(name)) return name;
  return "_get" + Strings.initialsToUpperCase(name);
};

/**
 * 格式setter
 * @param name
 * @return {*}
 */
export const formatSetterName = (name) => {
  if(Utils.isEmpty(name)) return name;
  return "_set" + Strings.initialsToUpperCase(name);
};