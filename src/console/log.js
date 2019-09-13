/**!
 @Title: JsKlass
 @Description: LOG
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */
import {Utils} from '../utils/index';

/**
 * 输出日志
 * @param info1
 * @param info2
 * @return {*}
 */
export const log = (info1, info2)=>{
  if(!Utils.isEmpty(info1) && !Utils.isEmpty(info2)){
    console.log(info1, info2);
  }else{
    console.log(info1);
  }
};