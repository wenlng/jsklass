/**!
 @Title: MicroAppOS
 @Description: JSON处理
 @Site: www.microappos.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */

import * as Utils from "./utils";

/**
 * 是否是数组
 * @param value
 * @return {boolean}
 */
export const isNumber = (value) => {
  return Utils.getType(value) === "number";
};