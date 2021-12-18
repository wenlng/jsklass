/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
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
