/**!
 @Title: MicroAppOS
 @Description: 字符串处理
 @Site: www.microappos.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
 */
import * as Utils from "./utils";
import * as Console from "../console/index"

/**
 * 是否是方法
 * @param value
 * @return {boolean}
 */
export const isFunction = (value) => {
  return Utils.getType(value) === "function";
};

/**
 * 解析js字符串Code代码
 * @param fn
 * @return {*}
 */
export const evil =(fn) => {
  try{
    return new Function("return " + fn)();
  }catch(e){
    Console.exit(e);
  }
};