/**!
 @Title: JsKlass
 @Description: exit
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
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