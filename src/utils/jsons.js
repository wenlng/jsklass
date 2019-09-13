/**!
 @Title: MicroAppOS
 @Description: JSON处理
 @Site: www.microappos.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */

import * as String from "./string";
import * as Objects from "./objects";

/**
 * 验证一个值是否是json格式
 * @param value
 * @returns {boolean}
 */
export const isJson = (value) => {
  try {
    if (Objects.isObject(value)) {
      let str = JSON.stringify(value);
      if (String.isString(str) && str) {
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    return false;
  }
};

/**
 * 验证一个值是否是json字符串格式
 * @param value
 * @returns {boolean}
 */
export const isJsonStr = (value) => {
  try {
    if (String.isString(value)) {
      let obj = JSON.parse(value);
      if (Objects.isObject(obj) && obj) {
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    return false;
  }
};


/**
 * 转换json对象
 * @param jsonStr
 * @return {*}
 */
export const parseJson = (jsonStr) => {
  let res = {};
  try {
    if(isJsonStr(jsonStr)){
      res = JSON.parse(jsonStr);
    }else{
      res = jsonStr;
    }
  }catch (e){}
  return res;
};

/**
 * 对象转成json字符串
 * @param jsonData
 * @returns {*}
 */
export const stringify = (jsonData) => {
  if (isJson(jsonData)) {
    return JSON.stringify(jsonData);
  }
  return jsonData;
};