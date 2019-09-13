/**!
 @Title: JsKlass
 @Description: Error
 @Site: www.jsklass.com
 @Author: Wengao Liang
 @Email: 871024608@qq.com
 */
import {Utils} from '../utils/index';

/**
 * 输出错误信息
 * @param info1
 * @param info2
 * @return {*}
 */
export const error = (info1, info2) => {
  if (!Utils.isEmpty(info1) && !Utils.isEmpty(info2)) {
    console.error(info1, info2);
  } else {
    console.error(info1);
  }
};