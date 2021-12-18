/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
 */

import {Class} from "./class";
import {Protocol} from "./protocol";

/**
 * 定义类
 * @param _name
 * @param _constructor
 * @param _extends
 * @param _protocol
 * @param _prototype
 * @return {Class|*}
 * @constructor
 */
export const DefClass = (_name, _constructor, _extends, _protocol, _prototype) => {
  return Class(_name, _constructor, _extends, _protocol, _prototype);
};

/**
 * 定义协议
 * @param _name
 * @param definition
 * @param _extends
 * @return {Object}
 * @constructor
 */
export const DefProtocol = (_name, definition, _extends) => {
  return Protocol(_name, definition, _extends);
};

/**
 * 导出协议类型
 */
export * from "./protocol-type";