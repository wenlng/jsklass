/**!
 @Title: JsKlass
 @Description: BROWSER
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */

import {DefClass, DefProtocol, ProtocolType} from '../klass/index';
import {
  Utils,
  Objects,
} from "../utils/index";
import * as Console from "../console/index";

if(Objects.checkDefineProperty()){

  Object.defineProperty(window, "JsKlass", {
    value: Utils.freeze({
      DefClass : Utils.freeze(DefClass),
      DefProtocol : Utils.freeze(DefProtocol),
      ProtocolType : Utils.freeze(ProtocolType),
      Global : {}
    }),
    writable: false,
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(window, "JK", {
    value: Utils.freeze({
      DefClass : Utils.freeze(DefClass),
      DefProtocol : Utils.freeze(DefProtocol),
      ProtocolType : Utils.freeze(ProtocolType),
      Global : {}
    }),
    writable: false,
    enumerable: false,
    configurable: false
  });
}else{
  Console.exit("当前版本不支持JsKlass，请使用IE8版本以上的平台");
}

