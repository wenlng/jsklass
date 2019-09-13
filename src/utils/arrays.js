/**!
 @Title: MicroAppOS
 @Description: 数组处理
 @Site: www.microappos.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */
import * as Utils from "./utils";
import * as Platform from "./platform";

/**
 * 是否是数组
 * @param value
 * @return {boolean}
 */
export const isArray = (value) => {
  return Utils.getType(value) === "array";
};

/**
 * 是否是数组结构
 */
export const isArrayLike = (value) => {
  let length = !!value && "length" in value && value.length,
    type = Utils.getType(value);

  if (type === "function" || Platform.isWindow(value)) {
    return false;
  }

  return type === "array" || length === 0 ||
    typeof length === "number" && length > 0 && (length - 1) in value;
};

/**
 * 合并数组
 * @param arr1
 * @param arr2
 * @return {*}
 */
export const mergeArray = (arr1, arr2) => {
  // Utils.each(arr2, (key, value) => {
  //   arr1.push(value);
  // });
  isArray(arr1) && (arr1 = arr1.concat(arr2));
  return arr1;
};


/**
 * arguments转换array
 * @return {Array}
 */
export const convertArgsToArray = (args) => {
  return Array.prototype.slice.apply(args);
};
