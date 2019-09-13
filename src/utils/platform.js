/**!
 @Title: MicroAppOS
 @Description: 类
 @Site: www.microappos.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */

/**
 * 是否是window
 * @param obj
 * @return {boolean}
 */
export const isWindow = (obj)=> {
  return typeof obj !== "undefined" && obj === obj.window;
};

/**
 * 判断是否是浏览器环境
 * @return {boolean}
 */
export const isBrowserSide = ()=>{
   return (typeof window !=="undefined")
};
