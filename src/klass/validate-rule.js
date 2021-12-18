/**!
 @Title: JsKlass
 @Description: Class
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: wengaolng@gmail.com
 */

import {
  Utils
} from "../utils/index";
import * as Console from "../console/index";
import {KeyWord,KeyWord2} from "./constant";

/**
 * 验证类的规范
 * @param _name
 * @param collect
 * @returns {boolean}
 */
export const validateRule = (_name, collect) => {
  const uppercaseRep = /^[a-zA-Z0-9_$]+$/i,
    constructorKeyWord = "$_construct",
    nonsupportKeyWord = "_construct";

  let cacheFinalNames = [],
    cacheConstFinalNames = [],
    cacheStaticFinalNames = [],
    curName = "",
    curType = "prototype",
    isExcludeConstructor = false,
    isNonSupportKeyWord = false,
    isKeyWord = false,
    isLowercase = false,
    isOverwrite = false;

  let tmpSelf = collect.self,
    tmpPrototype = collect.prototype,
    tmpStatic = collect.static,
    tmpConst = collect.const;

  //处理prototype
  Utils.each(tmpPrototype, function (name, value) {
    if (nonsupportKeyWord === name) {
      curName = name;
      curType = "prototype";
      isNonSupportKeyWord = true;
      return false;
    }else if (constructorKeyWord === name) {
      curName = name;
      curType = "prototype";
      isExcludeConstructor = true;
      return false;
    }else if (KeyWord.indexOf(name)  > -1) {
      curName = name;
      curType = "prototype";
      isKeyWord = true;
      return false;
    }else if(hasFinalName(name)){
      let reName = filterFinalName(name);//过滤$
      if(cacheFinalNames.indexOf(reName) > -1){
        curName = reName;
        curType = "prototype";
        isOverwrite = true;
        return false;
      }
      cacheFinalNames.push(reName);
    }else if(cacheFinalNames.indexOf(name) > -1){
      curName = name;
      curType = "prototype";
      isOverwrite = true;
      return false;
    }
  });

  //处理self
  if(!isOverwrite && !isKeyWord && !isExcludeConstructor && !isNonSupportKeyWord){
    Utils.each(tmpSelf, function (name, value) {
      if (constructorKeyWord === name) {
        curName = name;
        curType = "self";
        isExcludeConstructor = true;
        return false;
      }else if (KeyWord.indexOf(name) > -1) {
        curName = name;
        curType = "self";
        isKeyWord = true;
        return false;
      }else if(hasFinalName(name)){
        let reName = filterFinalName(name);//过滤$
        if(cacheFinalNames.indexOf(reName) > -1){
          curName = reName;
          curType = "self";
          isOverwrite = true;
          return false;
        }
        cacheFinalNames.push(reName);
      }else if(cacheFinalNames.indexOf(name) > -1){
        curName = name;
        curType = "self";
        isOverwrite = true;
        return false;
      }
    });
  }

  //处理const
  if(!isOverwrite && !isKeyWord && !isExcludeConstructor && !isNonSupportKeyWord){
    Utils.each(tmpConst, function (name, value) {
      if(!uppercaseRep.test(name)){
        curName = name;
        curType = "const";
        isLowercase = true;
        return false;
      }else if (KeyWord2.indexOf(name) > -1) {
        curName = name;
        curType = "const";
        isKeyWord = true;
        return false;
      }else if(cacheConstFinalNames.indexOf(name) > -1){
        curName = name;
        curType = "const";
        isOverwrite = true;
        return false;
      }
    });
  }

  //处理static
  if(!isOverwrite && !isKeyWord && !isExcludeConstructor && !isNonSupportKeyWord && !isLowercase){
    Utils.each(tmpStatic, function (name, value) {
      if (KeyWord2.indexOf(name) > -1) {
        curName = name;
        curType = "static";
        isKeyWord = true;
        return false;
      }else if(cacheStaticFinalNames.indexOf(name) > -1){
        curName = name;
        curType = "static";
        isOverwrite = true;
        return false;
      }
    });
  }

  if(isNonSupportKeyWord){
    Console.exit(`${_name} 类中的 [${curType}] 成员名称不允许是：${curName}`);
    return false
  } else if(isKeyWord){
    Console.exit(`${_name} 类中的 [${curType}] 成员名称不可是关键词：${curName}`);
    return false
  }else if(isOverwrite){
    Console.exit(`${_name} 类中的 [${curType}]: ${curName} 是final类型不可覆写`);
    return false
  }else if (isExcludeConstructor) {
    Console.exit(`${_name} 类中的 [${curType}]: ${curName} 构造函数不允许设置为final类型！`);
    return false
  }else if(isLowercase){
    Console.exit(`${_name} 类中的 [${curType}]: ${curName} 名称必须[a-zA-Z0-9_$]方式命名`);
    return false
  }

  return true;
};

/**
 * 判断是否是Final的“$”修饰符
 * @param name
 * @return {XML|string|void|*}
 */
export const hasFinalName = (name)=>{
  let rep = "$";
  return (name !== "_construct" && name.indexOf(rep) === 0);
};

/**
 * 过滤Final的“$”修饰符
 * @param name
 * @return {XML|string|void|*}
 */
export const filterFinalName = (name)=>{
  let rep = "$";
  name = (name !== "_construct" && name.indexOf(rep) === 0)? name.replace(rep, ""): name;
  return name;
};
