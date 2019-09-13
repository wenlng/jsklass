/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */

import {
  Utils
} from "../utils/index";
import * as Console from "../console/index";
import {
  formatSyntaxWidthPlatform,
  validateTypeRule,
  parseTypeRule,
  setProtocolTypeRuleValue
} from "./validate-type-rule";

/**
 * 验证协议的实现
 * @param _name
 * @param _protocol
 * @param _self
 * @param _superSelf
 * @param _prototype
 * @param _superPrototype
 * @param _const
 * @param _static
 * @return {boolean}
 */
export const ImplementProtocol = function (_name, _protocol, _self, _superSelf,_prototype, _superPrototype, _const, _static) {
  const selfRule = Utils.getDefaultVal(_protocol, "self", {}),
        constRule = Utils.getDefaultVal(_protocol, "const", {}),
        staticRule = Utils.getDefaultVal(_protocol, "static", {});

  let isAbort = false,
    abortSelfSyntax = null,
    abortStaticSyntax = null,
    abortConstSyntax = null;

  //验证self<_self、_superSelf、_prototype、_superPrototype>
  Utils.each(selfRule, function (name, rule) {
    let typeRule = parseTypeRule(rule);
    if(typeRule.check){

      if(!Utils.isEmpty(_self[name])){
        abortSelfSyntax = validateTypeRule(_self, name, typeRule);
      }else if(!Utils.isEmpty(_prototype[name])){
        abortSelfSyntax = validateTypeRule(_prototype, name, typeRule);
      }else if(!Utils.isEmpty(_superSelf[name])){
        abortSelfSyntax = validateTypeRule(_superSelf, name, typeRule);
      }else if(!Utils.isEmpty(_superPrototype[name])){
        abortSelfSyntax = validateTypeRule(_superPrototype, name, typeRule);
      }else{
        abortSelfSyntax = validateTypeRule(_self, name, typeRule);
      }

      if (abortSelfSyntax){
        isAbort = true;
        return false;
      }
    }
  });

  //验证const<_const>
  !isAbort && Utils.each(constRule, function (name, rule) {
    let typeRule = parseTypeRule(rule);
    if(typeRule.check){
      abortConstSyntax = validateTypeRule(_const, name, typeRule);

      if (abortConstSyntax){
        isAbort = true;
        return false;
      }
    }
  });

  //验证static<_static>
  !isAbort && Utils.each(staticRule, function (name, rule) {
    let typeRule = parseTypeRule(rule);
    if(typeRule.check){
      abortStaticSyntax = validateTypeRule(_static, name, typeRule);

      if (abortStaticSyntax){
        isAbort = true;
        return false;
      }

      setProtocolTypeRuleValue(_static, name, typeRule, "static");
    }
  });

  if (abortSelfSyntax) {
    Console.exit(`<${_name}> 类必须实现协议: self.${formatSyntaxWidthPlatform(abortSelfSyntax)}`);
  }

  if (abortConstSyntax) {
    Console.exit(`<${_name}> 类必须实现协议: const.${formatSyntaxWidthPlatform(abortConstSyntax)}`);
  }

  if (abortStaticSyntax) {
    Console.exit(`<${_name}> 类必须实现协议: static.${formatSyntaxWidthPlatform(abortStaticSyntax)}`);
  }

  return !isAbort;
};


