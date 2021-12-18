/**!
 @Title: MicroAppOS
 @Description: 字符串处理
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
export const isString = (value) => {
  return Utils.getType(value) === "string";
};

/**
 * 首字母大写
 * @param str
 * @return {string}
 */
export const initialsToUpperCase = (str)=> {
  let array = str.toLowerCase().split(" ");
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  return array.join(" ");
};