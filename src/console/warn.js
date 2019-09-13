/**!
 @Title: JsKlass
 @Description: WARN
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */
import {Utils} from '../utils/index';

/**
 * 输出异常信息
 * @param info1
 * @param info2
 * @return {*}
 */
export const warn = (info1, info2)=>{
  if(!Utils.isEmpty(info1) && !Utils.isEmpty(info2)){
    console.warn(info1, info2);
  }else{
    console.warn(info1);
  }
};