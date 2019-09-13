/**!
 @Title: JsKlass
 @Description: INFO
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */
import {Utils} from '../utils/index';

/**
 * 输出信息
 * @param info1
 * @param info2
 * @return {*}
 */
export const info = (info1, info2)=>{
  if(!Utils.isEmpty(info1) && !Utils.isEmpty(info2)){
    console.info(info1, info2);
  }else{
    console.info(info1);
  }
};