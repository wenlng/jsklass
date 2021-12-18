/**!
 @Title: MicroAppOS
 @Description: 类
 @Site: www.microappos.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
 */

import * as Array from "./arrays";
import * as Function from "./functions";
import * as Objects from "./objects";

let class2type = {
    "[object Boolean]": "boolean"
    , "[object Number]": "number"
    , "[object String]": "string"
    , "[object Function]": "function"
    , "[object Array]": "array"
    , "[object Date]": "date"
    , "[object RegExp]": "regexp"
    , "[object Object]": "object"
    , "[object Error]": "error"
    , "[object Symbol]": "symbol"
  }
  , sToString = class2type.toString
  , sHasOwn = class2type.hasOwnProperty
  , oProto = Object.getPrototypeOf
  , sFnToString = sHasOwn.toString
  , sObjectFunctionString = sFnToString.call(Object)
;

//======================================//

/**
 * 递归获取属性
 * @param params
 * @param nameArr
 * @return {*}
 */
const recursionGetAttr = (params, nameArr) => {
  try {
    nameArr = (nameArr ? nameArr : []);
    if (!params || !nameArr || nameArr.length <= 0) return params;

    let curKey = nameArr.shift();
    let curParams = params[curKey];
    if (nameArr.length > 0) {
      return recursionGetAttr(curParams, nameArr);
    }
    return curParams
  } catch (e) {
    return "";
  }
};

//======================================//

/**
 * 获取类型
 * @param obj
 * @return {*}
 */
export const getType = (obj) => {
  if (obj === null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function" ?
    class2type[sToString.call(obj)] || "object" :
    typeof obj;
};

/**
 * 判断是否空
 * @param value
 * @return {boolean}
 */
export const isEmpty = (value) => {
  if (typeof value === "undefined" || value === null || value === "" || value === undefined) {
    return true;
  }

  if (Array.isArray(value) || Objects.isObject(value)) {
    let count = 0;
    for (let key in value) {
      count++;
    }

    if (count <= 0) return true;
  }

  return false;
};

/**
 * 获取属性，不存在取默认值
 * @param curParameterBag
 * @param name
 * @param defaultVal
 * @return {*}
 */
export const getDefaultVal = (curParameterBag, name, defaultVal) => {
  defaultVal = (defaultVal ? defaultVal : "");
  curParameterBag = (Objects.isObject(curParameterBag)) ? curParameterBag : {};

  if (isEmpty(name) || Objects.isObject(name)) {
    return defaultVal;
  }

  let nameArr = name.split(".");
  let res = recursionGetAttr(curParameterBag, nameArr);
  if (isEmpty(res)) return defaultVal;
  return res;
};


/**
* 遍历
 * @param obj
 * @param callback
 * @returns {*}
 */
export const each = (obj, callback) => {
  let length, i = 0;
  if (Array.isArrayLike(obj)) {
    length = obj.length;
    for (; i < length; i++) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break;
      }
    }
  } else {
    for (i in obj) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break;
      }
    }
  }

  return obj;
};


/**
 * 倒序遍历
 * @param obj
 * @param callback
 * @returns {*}
 */
export const reverseEach = (obj, callback) => {
  let length, i = 0;
  if (Array.isArrayLike(obj)) {
    length = obj.length;
    for (let i = (length-1); i >= 0; i--) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break;
      }
    }
  } else {
    //组装keyArr
    let keyArr = [];
    each(obj, function (k, v) {
      keyArr.push(k);
    });

    //排序
    keyArr.sort(function (val1, val2) {
      return val2 - val1;
    });

    //获取对象
    let getObjByKey = function (key) {
      let _res = {};
      each(obj, function (k, v) {
        if(k.toString() === key.toString()){
          _res = v;
          return false;
        }
      });
      return _res;
    };
    each(keyArr, function (ak, av) {
      if (callback.call(getObjByKey(av), av, getObjByKey(av)) === false) {
        return false;
      }
    });
  }

  return obj;
};

/**
 * 不可增加， 可修改  不可删除
 * @param o
 * @return {Object|*}
 */
export const seal = (o)=>{
  try{
    return Object.seal(o);
  }catch (e){
    return o;
  }
};

/**
 * 不可增加， 不可修改  不可删除
 * @param o
 * @return {Object|*}
 */
export const freeze = (o)=>{
  try{
    return Object.freeze(o);
  }catch (e){
    return o;
  }
};

/**
 * 不可增加， 可修改  可删除
 * @param o
 * @return {Object|*}
 */
export const preventExtension = (o)=>{
  try{
    return Object.preventExtensions(o);
  }catch (e){
    return o;
  }
};
/**
 * 深度冻结
 * @param o
 * @return {Object|*}
 */
export const deepFreeze = (o)=>{
  each(freeze(o), function (propKey, v) {
    let prop = o[propKey];
    if(!o.hasOwnProperty(propKey) || !(typeof prop === "object") || Object.isFrozen(prop)){
      return false;
    }
    deepFreeze(prop);
  });
  return o;
};


/**
 * 判断指定参数是否是通过"{}"或"new Object"创建的
 * @param obj
 * @return {boolean}
 */
export const isPlainObject = function (obj) {
  let proto, Ctor;
  if (!obj || sToString.call(obj) !== "[object Object]") {
    return false;
  }
  proto = oProto(obj);
  if (!proto) {
    return true;
  }

  Ctor = sHasOwn.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && sFnToString.call(Ctor) === sObjectFunctionString;
};


/**继承扩展
 * extend([result,item1,item2….])     //合并到result，会改变原始结构
 * extend([{},item1,item2,……])        //合并在{}中，不会改变原始结构
 * extend([bool,{},item1,item2….])    //bool是否深拷贝
 * @return {*}
 */
export const extend = (args)=> {
    let options, name, src, copy, copyIsArray, clone,
        target = args && args[0] || {},
        i = 1,
        length = args.length,
        deep = false;

    if (typeof target === "boolean") {
        deep = target;
        target = args[i] || {};
        i++;
    }

    if (!Objects.isObject(target) && !Function.isFunction(target)) {
        target = {};
    }
    if (i === length) {
        target = this;
        i--;
    }
    for (; i < length; i++) {
        if (( options = args[i] ) !== null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue;
                }
                if (deep && copy && ( isPlainObject(copy) ||
                    ( copyIsArray = Array.isArray(copy) ) )) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[name] = extend([deep, clone, copy]);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
};


