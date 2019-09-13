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

const
  /**
   * HexDigits
   */
  sHexDigits = "0123456789abcdef",
  /**
   * 当前类ID集合<24>
   */
  oClassIdLength = 24,

  /**
   * 当前协议ID集合<24>
   */
  oProtocolIdLength = 24,

  /**
   * 当前实例ID集合<32>
   */
  oInstanceIdLength = 32,

  /**
   * 当前运行环境ID<12>
   */
  sRunEnvIdLength = 12,

  /**
   * 当前运行环境NAME<8>
   */
  sRunEnvNameLength = 8,

  /**
   * 当前恢复类实例的标识<8>
   */
  sRemakeInstanceTagLength = 8
;


let
  /**
   * 当前类ID集合
   * @type {Array}
   */
  oClassIds = [],

  /**
   * 当前协议ID集合
   * @type {Array}
   */
  oProtocolIds = [],

  /**
   * 当前实例ID集合
   * @type {Array}
   */
  oInstanceIds = [],

  /**
   * 当前运行环境ID
   * @type {string}
   */
  sRunEnvId = "",

  /**
   * 当前运行环境NAME
   * @type {string}
   */
  sRunEnvName = "",

  /**
   * 当前恢复类实例的标识
   * @type {string}
   */
  sRemakeInstanceTag = ""
;

/**
 * 生成类的ID <16>
 * @returns {string}
 */
export const generateClassId = function () {
  let s = ["0x"],
    id = "",
    start = Math.max(Math.ceil(oClassIdLength / 3), s.length),
    end = Math.min(start * 2, oClassIdLength);

  for (let i = 0; i < oClassIdLength; i++) {
    s.push(sHexDigits.substr(Math.floor(Math.random() * 0x10), 1));
  }

  s[start] = sHexDigits.substr(Math.ceil(Math.random() * sHexDigits.length), 1);
  s[end] = sHexDigits.substr((s[end] & 0x3) | 0x8, 1);
  id = s.join("");

  if(oClassIds.indexOf(id) > -1){
    return generateClassId();
  }

  oClassIds.push(id);
  return id;
};

/**
 * 验证类的id是否存在
 * @param id
 * @return {*}
 */
export const hasClassId = function (id) {
  return (oClassIds.indexOf(id) > -1);
};

/**
 * 生成协议的ID <16>
 * @returns {string}
 */
export const generateProtocolId = function () {
  let s = ["0x"],
    id = "",
    start = Math.max(Math.ceil(oProtocolIdLength / 3), s.length),
    end = Math.min(start * 2, oProtocolIdLength);

  for (let i = 0; i < oProtocolIdLength; i++) {
    s.push(sHexDigits.substr(Math.floor(Math.random() * 0x10), 1));
  }

  s[start] = sHexDigits.substr(Math.ceil(Math.random() * sHexDigits.length), 1);
  s[end] = sHexDigits.substr((s[end] & 0x3) | 0x8, 1);
  id = s.join("");

  if(oProtocolIds.indexOf(id) > -1){
    return generateProtocolId();
  }

  oProtocolIds.push(id);
  return id;
};

/**
 * 验证协议的id是否存在
 * @param id
 * @return {*}
 */
export const hasProtocolId = function (id) {
  return (oProtocolIds.indexOf(id) > -1);
};

/**
 * 生成实例的ID <16>
 * @returns {string}
 */
export const generateInstanceId = function () {
  let s = ["0x"],
    id = "",
    start = Math.max(Math.ceil(oInstanceIdLength / 3), s.length),
    end = Math.min(start * 2, oInstanceIdLength);

  for (let i = 0; i < oInstanceIdLength; i++) {
    s.push(sHexDigits.substr(Math.floor(Math.random() * 0x10), 1));
  }

  s[start] = sHexDigits.substr(Math.ceil(Math.random() * sHexDigits.length), 1);
  s[end] = sHexDigits.substr((s[end] & 0x3) | 0x8, 1);
  id = s.join("");

  if(oInstanceIds.indexOf(id) > -1){
    return generateInstanceId();
  }

  oInstanceIds.push(id);
  return id;
};

/**
 * 验证实例的id是否存在
 * @param id
 * @return {*}
 */
export const hasInstanceId = function (id) {
  return (oInstanceIds.indexOf(id) > -1);
};

/**
 * 获取当前运行环境的ID
 * @returns {string}
 */
export const getRunEnvId = function () {
  if(Utils.isEmpty(sRunEnvId)){
    let s = ["0x"];

    for (let i = 0; i < sRunEnvIdLength; i++) {
      s.push(sHexDigits.substr(Math.floor(Math.random() * 0x10), 1));
    }
    sRunEnvId = s.join("");
  }
  return sRunEnvId;
};


/**
 * 获取当前运行环境的ID
 * @returns {string}
 */
export const getRunEnvName = function () {
  if(Utils.isEmpty(sRunEnvName)){
    let s = ["_0x"];

    for (let i = 0; i < sRunEnvNameLength; i++) {
      s.push(sHexDigits.substr(Math.floor(Math.random() * 0x10), 1));
    }
    sRunEnvName = s.join("");
  }
  return sRunEnvName;
};


/**
 * 获取当前恢复类实例的标识
 * @returns {string}
 */
export const getRemakeInstanceTag = function () {
  if(Utils.isEmpty(sRemakeInstanceTag)){
    let s = ["_0x"];

    for (let i = 0; i < sRemakeInstanceTagLength; i++) {
      s.push(sHexDigits.substr(Math.floor(Math.random() * 0x10), 1));
    }
    sRemakeInstanceTag = s.join("");
  }
  return sRemakeInstanceTag;
};













