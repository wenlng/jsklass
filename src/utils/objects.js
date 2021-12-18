/**!
 @Title: MicroAppOS
 @Description: 对象处理
 @Site: www.microappos.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
 */
import * as Utils from "./utils";

/**
 * 是否是字符串
 * @param value
 * @return {boolean}
 */
export const isObject = (value) => {
  return Utils.getType(value) === "object";
};

/**
 * 判断key是否存在对象中
 * @param obj
 * @param key
 * @return {*}
 */
export const inObject = (obj, key)=>{
  return (Object.keys(obj).indexOf(key) > -1);
};

/**
 * 合并对象
 * @param json1
 * @param json2
 * @return {*}
 */
export const mergeObject = (json1, json2) => {
  Utils.each(json2, (key, value) => {
    json1[key] = value;
  });
  return json1;
};

/**
 * 检测是否支持defineProperty
 * @return {boolean}
 */
export const checkDefineProperty = ()=>{
  return (typeof Object.defineProperty === "function");
};
