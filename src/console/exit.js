/**!
 @Title: JsKlass
 @Description: exit
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */

/**
 * @description 执行错误并终止执行
 * @name Console#exit
 * @param info
 * @return {*}
 */
export const exit = (info) => {
  throw new Error(info);
};