/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */

export const ProtocolTypeRule = function (type, mode, args) {
  const modes = [
    "@optional",
    "@required"
  ];

  return {
    type : type,
    args : args,
    mode : (modes.indexOf(mode) < 0) ? "@required" : mode
  }
};
