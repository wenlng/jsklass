## JsKlass简介
>JsKlass是基于Javascript实现的OOP代码结构的JS库；具有类、继承、协议、类常量、类静态、final类型修饰、property特性、内置安全校验等功能特征

##### website: www.jsklass.com

## 使用前言
>JsKlass不依懒任何第三方库，是一个独立基于Javascript的库，兼容IE8+以上的所有主流浏览器；在使用它前仅仅只需要有Javascript基础并且对OOP有所了解

##### Browser版本: https://github.com/liangwengao/jsklass
##### Import版本: https://github.com/liangwengao/jsklass-import
##### Require版本: https://github.com/liangwengao/jsklass-require

## 安装方式
### Bower模块
```shell
bower install liangwengao/jsklass-browser --save
```

### Import模块
```shell
npm install liangwengao/jsklass-import --save dev
```
或者
```shell
npm install jsklass-import --save dev
```

### Require模块
```shell
npm install liangwengao/jsklass-require --save dev
```
或者
```shell
npm install jsklass-require --save dev
```

## JsKlass特性: 
```text
支持无入侵式定义类
支持类继承/多继承
支持类构造
支持类实例化多个独立的类对象
支持类对象encoder/decoder
支持类、类对象、协议的安全校验
支持属性setter/getter
支持属性final类型修饰
支持协议的遵循约束/多重实现/多重继承
支持类常量定义
支持类静态数据共享
支持类原型与其他Function类型进行绑定
兼容浏览器环境(major)，兼容node环境
```


## JsKlass 全局API: 
```text
JK.DefClass: 定义类
JK.DefProtocol: 定义协议
JK.ProtocolType: 指定协议对应的类型，用于约束类定义属性的类型
JK.Global: 用于保存全局模块，只有浏览器版本才拥有
```

### 一、JsKlass的语法
#### 1.定义类语法

```js
const 类名 = DefClass('类名', function (sl) {
// ...
})
```
  
  
#### 2.类继承语法

```js
const 类名 = DefClass('类名', function (sl) {
  // ...
}, 被继承的类)
```


#### 3.定义协议

```js
const 协议名 = DefProtocol('协议名', {
  // 对self指向约束
  'self': {
    // 例如：在类遵循此协议时，对username属性进行“字符串”类型的约束
    username: ProtocolType.string()  
  },
  // 对const指向约束
  'const': {
     
  },
  // 对static指向约束
  'static': {
     
  }
})
```


#### 4.类遵循协议语法

```js
const 类名 = DefClass('类名', function (sl) {
  // ...
}, null, 被遵循的协议)
```


### 二、使用JsKlass
#### < Script > 标签式使用JsKlass
>在浏览器版本中使用 'JsKlass' 或 'JK' 两者是等价的 

```html
<script type='text/javascript' src='/bower_components/jsklass-browser/lib/jsklass.js'></script>
<script type='text/javascript'>
  
  /**
   * @description Demo类
   * @class Demo
   */
const Demo = JK.DefClass('Demo', function (sl) {
    // todo...
  })
  
</script>  
```
或使用自动执行匿名函数包装简化

```html
<script type='text/javascript' src='/bower_components/jsklass-browser/lib/jsklass.js'></script>
<script type='text/javascript'>
  (function(DefClass, DefProtocol, ProtocolType, Global){
    
    /**
     * @description Demo类
     * @class Demo
     */
    const Demo = DefClass('Demo', function (sl) {
      // todo...
    })
    
  })(JK.DefClass, 
  JK.DefProtocol, 
  JK.ProtocolType,
  JK.Global)  
</script>
```

#### Require方式使用JsKlass
```js
const JK = require('jsklass-require')

/**
* @description Demo类
* @class Demo
*/
const Demo = JK.DefClass('Demo', function (sl) {
// todo...
})
```


#### Import方式使用JsKlass
```js
import * as JK from 'jsklass-import'

/**
* @description Demo类
* @class Demo
*/
const Demo = JK.DefClass('Demo', function (sl) {
  // todo...
})
  
```
或者

```js
import {
    DefClass,
    DefProtocol,
    ProtocolType
} from 'jsklass-import'

/**
* @description Demo类
* @class Demo
*/
const Demo = DefClass('Demo', function (sl) {
  // todo...
})
```


### 三、类的指向
>DefClass(..., function (sl, co, st, su, po) { ... })

| Name | Pointer | Describe |
| :-------------: |:-------------:| :-----:|
| sl | self或this | 实例指向 |
| co | const | 常量指向 |
| st | static | 静态指向 |
| st | super | 父类指向 |
| po | prototype | 原型指向 |


### 四、类实例
>在定义一个类时，如果在类中的 'sl' 指向声名了 '_construct' 构造函数，在类实例化对象时则会自动调用一次

```js
/**
* @description Demo类
* @class Demo
*/
const Demo = DefClass('Demo', function (sl) {
  /**
   * @description 构造函数
   * @function _construct
   */
  sl._construct = function (name) {
    console.log('Demo._construct():' + name)
  }
  
  /**
   * @description show方法
   * @function Demo#show
   */
  sl.show = function () {
    console.log('Demo.show()')
  }
  
  /**
   * @description hide方法
   * @function Demo#hide
   */
  sl.hide = function () {
    console.log('Demo.hide()')
  }
})

let demo = new Demo('awen')
demo.show()
demo.hide()

/**运行结果：
> Demo._construct():awen
> Demo.show()
> Demo.hide()
*/
```


### 五、类继承
>一个类在定义时可以去继承另一个类的属性或方法，支持多态继承（即一次只可继承一个类），不支持多重继承

```js
/**
 * @description DemoA类
 * @class DemoA
 */
const DemoA = DefClass('DemoA', function (sl) {
  /**
   * @description show方法
   * @function DemoA#show
   */
  sl.show = function () {
    console.log('DemoA.show()')
  }
})


/**
 * @description DemoB类
 * @class DemoB
 */
const DemoB = DefClass('DemoB', function (sl) {
  sl._construct = function () {
    console.log('DemoB._construct()')
  }

  /**
   * @description hide方法
   * @function DemoB#hide
   */
  sl.hide = function () {
    console.log('DemoB.hide()')
  }
}, DemoA)

let demo = new DemoB
demo.show()
demo.hide()

/**运行结果：
 > DemoB._construct()
 > DemoA.show()
 > DemoB.hide()
 */
```


### 六、类覆写
>当一个类去继承另外一个类时，父类的方法或属性可以在子类中使用相同的名称去声明覆写

```js
/**
 * @description DemoA类
 * @class DemoA
 */
const DemoA = DefClass('DemoA', function (sl) {
  /**
   * @description show方法
   * @function DemoA#show
   */
  sl.show = function () {
    console.log('DemoA.show()')
  }

  /**
   * @description hide方法
   * @function DemoA#hide
   */
  sl.hide = function () {
    console.log('DemoA.hide()')
  }
})


/**
 * @description DemoB类
 * @class DemoB
 */
const DemoB = DefClass('DemoB', function (sl) {
  sl._construct = function () {
    console.log('DemoB._construct()')
  }

  /**
   * @description hide方法
   * @function DemoB#hide
   */
  sl.hide = function () {
    console.log('DemoB.hide()')
  }

  /**
   * @description display方法
   * @function DemoB#display
   */
  sl.display = function () {
    console.log('DemoB.display()')
  }
}, DemoA)

let demo = new DemoB()
demo.show()
demo.hide()
demo.display()

/**运行结果：
 > DemoB._construct()
 > DemoA.show()
 > DemoB.hide()
 > DemoB.display()
 */
```


### 七、super父类
>子类继承父类时被覆盖的方法或属性，子类可通过 'su' 指向去访问

```js
/**
 * @description DemoA类
 * @class DemoA
 */
const DemoA = DefClass('DemoA', function (sl) {
  sl._construct = function () {
    console.log('DemoA._construct()')
  }

  /**
   * @description show方法
   * @function DemoA#show
   */
  sl.show = function () {
    console.log('DemoA.show()')
  }

  /**
   * @description hide方法
   * @function DemoA#hide
   */
  sl.hide = function () {
    console.log('DemoA.hide()')
  }
})


/**
 * @description DemoB类
 * @class DemoB
 */
const DemoB = DefClass('DemoB', function (sl, co, st, su) {
  sl._construct = function () {
    console.log('DemoB._construct()')
    su._construct()
  }

  /**
   * @description hide方法
   * @function DemoB#hide
   */
  sl.hide = function () {
    console.log('DemoB.hide()')
    su.hide()
  }

}, DemoA)

let demo = new DemoB()
demo.show()
demo.hide()

/**运行结果：
 > DemoB._construct()
 > DemoA._construct()
 > DemoA.show()
 > DemoB.hide()
 > DemoA.hide()
 */
```


### 八、Final受保护类型修饰符 '$'
>在继承时，如果父类声明的方法或属性前缀使用了 '$' 进行修饰，则该方法或属性就会变成final受保护类型，子类 或 类实例都将不可被覆写

>注：'$' 修饰符只对 'sl' 或 'po' 指向有效

```js
/**
 * @description DemoA类
 * @class DemoA
 */
const DemoA = DefClass('DemoA', function (sl) {
  /**
   * @description show方法
   * @function DemoA#show
   */
  sl.$show = function () {
    console.log('DemoA.show()')
  }

  /**
   * @description hide方法
   * @function DemoA#hide
   */
  sl.hide = function () {
    console.log('DemoA.hide()')
  }
})


/**
 * @description DemoB类
 * @class DemoB
 */
const DemoB = DefClass('DemoB', function (sl) {
  sl._construct = function () {
    console.log('DemoB._construct()')
  }

  /******由于父类的show使用了 '$' 修饰符，此处show会报ERROR******/
  /**
   * @description show方法
   * @function DemoB#show
   */
  //sl.show = function () {
  //  console.log('DemoB.show()')
  //}

  /**
   * @description hide方法
   * @function DemoB#hide
   */
  sl.hide = function () {
    console.log('DemoB.hide()')
  }

}, DemoA)

let demo = new DemoB()

/******由于父类的show使用了 '$' 修饰符，此处覆写show不生效******/
demo.show = function () {
  console.log('demo.rewire.show()')
}

demo.show()
demo.hide()

/**运行结果：
 > DemoB._construct()
 > DemoA.show()
 > DemoB.hide()
 */
```


### 九、类协议约束
>协议是类的约束，是指定一个类的基本功能实现
 
>在声明一个类时如果遵循了类协议，那么该类必须实现协议中的方法或属性，并且约束对应的类型；如不实现协议中的方法或属性，则会抛出一个声明级别的Error

```js
const DemoPTL = DefProtocol('DemoPTL', {
  self: {
    // 约束属性是字符串类型
    name: ProtocolType.string(),
    // 约束属性是数字类型
    age: ProtocolType.number(),
    // 约束方法不带参数
    eat: ProtocolType.function(),
    // 约束方法不带参数，并且可实现的
    eat1: ProtocolType.function('@optional'),
    // 约束方法带参数，并且可实现的
    eat2: ProtocolType.function('@optional', 'name')
  },
  const: {
    // ...
  },
  static: {
    // ...
  }
})
```


### 十、约束类型列表
| ProtocolType | Describe |
| :------------- | :--------- |
| ProtocolType.function() | 方法类型 |
| ProtocolType.string() | 字符串类型 |
| ProtocolType.number() | 数字类型 |
| ProtocolType.array() | Array类型 |
| ProtocolType.objects() | Object类型 |
| ProtocolType.class() | DefClass定义的Class类型 |
| ProtocolType.own() | 所有类型 |


### 十一、约束类型中的单一参数
>在指定协议类型时，每个类型都会默认隐藏一个 '@required' 参数：ProtocolType.function('@required') 代表必须要实现该方法或属性

>注：如 ProtocolType.function('@required','name', ...) 此时在类定义时需要省略带 '@' 符号的约束类型的参数：sl.xxx = function(name, ...)

| ProtocolTypeParameter | Describe |
| :------------- | :--------- |
| @optional | 可实现的 |
| @required | 必须实现的 |


### 十二、协议与协议继承
>协议支持多重继承，支持多层继承

```js
//DemoA协议
const DemoAPTL = DefProtocol('DemoAPTL', {
  self: {
    name: ProtocolType.string()
  }
})

//DemoB协议，继承了DemoA协议
const DemoBPTL = DefProtocol('DemoBPTL', {
  self: {
    age: ProtocolType.number(),
    eat: ProtocolType.function()
  }
}, DemoAPTL)
```


### 十三、类遵循协议
>一个类在遵循协议时，即支持单一实现，也支持多重实现，在多重实现时需要传入协议数组

```js
//DemoA协议
const DemoAPTL = DefProtocol('DemoAPTL', {
  self: {
    show: ProtocolType.function()
  }
})

//DemoB协议
const DemoBPTL = DefProtocol('DemoBPTL', {
  self: {
    hide: ProtocolType.function()
  }
})

/**
 * @description DemoImpl类，使用协议数组多重实现
 * @class DemoImpl
 */
const DemoImpl = DefClass('DemoImpl', function (sl) {
  sl._construct = function () {
    console.log('DemoImpl._construct()')
  }

  /**
   * @description show方法
   * @function DemoImpl#show
   */
  sl.show = function () {
    console.log('DemoImpl.show()')
  }

  /**
   * @description hide方法
   * @function DemoImpl#hide
   */
  sl.hide = function () {
    console.log('DemoImpl.hide()')
  }
}, null, [DemoAPTL, DemoBPTL])

let demoImpl = new DemoImpl
demoImpl.show()
demoImpl.hide()

/**运行结果：
 > DemoImpl._construct()
 > DemoImpl.show()
 > DemoImpl.hide()
 */
```


### 十四、property特性 <需要结合类协议使用>
>property特性是把prototype定义的属性都编译成 getter/setter 的方法，调用时会调用_getter方法，赋值时会调用_setter方法

```js

/**
 * @description Demo类
 * @class Demo
 */
const Demo = DefClass('Demo', function (sl, co, st, su, po) {
  /**
   * @description 实例username属性
   * @function Demo#username
   */
  po.username = 'jsklass'
  
  /**
   * @description 实例username属性getter
   * @function Demo#username
   */
  po._getUsername = function(val) {
    console.log('call getUsername()...')
    return val + ':get'
  }
  
  /**
   * @description 实例username属性setter
   * @function Demo#username
   */
  sl._setUsername = function(val) {
    console.log('call setUsername()...')
    return val + '-set'
  }
  
})

let demo = new Demo
console.log(demo.username)
demo.username = 'jsklass-browser'
console.log(demo.username)

/**运行结果：
 > call getUsername()...
 > jsklass
 > call setUsername()...
 > call getUsername()...
 > jsklass-browser
 */
```


### 十五、类常量
>常量是值不可变的量，它不属于类的任何一个实例，而是属于类本身；常量被定义后，无论在什么地方都不可改变它的值

```js
/**
 * @description Demo类
 * @class Demo
 */
const Demo = DefClass('Demo', function (sl, co) {
  co.VERSION = '1.0.1';
  /**
   * @description 常量show方法
   * @function Demo.show
   */
  co.show = function () {
    console.log('Demo.show()->const')
  }
  
  /**
   * @description 实例show方法
   * @function Demo#show
   */
  sl.show = function () {
    console.log('Demo.show()->self')
  }
})

Demo.show()
let demo = new Demo
demo.show()

/**运行结果：
 > Demo.show()->const
 > Demo.show()->self
 */
```


### 十六、类静态
>静态与普通的成员属性不同，静态属性属于类本身而不属于类的任何实例；静态属性可以理解是存储在类当中的全局变量，可以在任何地方通过 '自身类' 或 '实例' 来进行修改或访问

```js
/**
 * @description Demo类
 * @class Demo
 */
const Demo = DefClass('Demo', function (sl, co, st) {
  st.name = 'jsklass';
  /**
   * @description 静态show方法
   * @function Demo.show
   */
  st.show = function () {
    console.log('Demo.show()->static')
  }
  
  /**
   * @description 实例show方法
   * @function Demo#show
   */
   sl.show = function () {
     console.log('Demo.show()->self')
   }
})

Demo.show()
let demo = new Demo
demo.show()

/**运行结果：
 > Demo.show()->static
 > Demo.show()->self
 */
```


### 十七、类常量与类静态默认访问优先级问题
> 类常量的默认优先级高于类静态，如果常量与静态中都定义同名的变量或属性，使用 '.' 点方式访问会优先访问常量再访问静态
，这时你可以使用类预置的 getStatic(name) 来获取访问


### 十八、Prototype原型
>在javascript中每个函数就是一个对象（Function），函数对象都有一个子对象 prototype对象，类是以函数的形式来定义的prototype表示该函数的原型，也表示一个类的成员的集合

>在JsKlass中，prototype就是一个实例化对象的原型对象，当前实例化的对象中存在与原型对象中的一致的属性或方法时，会优先读取实例化对象中的属性或方法

```js
/**
 * @description Demo类
 * @class Demo
 */
const Demo = DefClass('Demo', function (sl, co, st, su, po) {
  po.username = 'jsklass';
  /**
   * @description 实例show方法
   * @function Demo#show
   */
  po.show = function () {
    console.log('Demo.show()->prototype')
  }
  
  /**
   * @description 实例show方法
   * @function Demo#show
   */
  sl.show = function () {
    console.log('Demo.show()->self')
  }
})

let demo = new Demo()
console.log(demo.username)
demo.show()

/**运行结果：
 > jsklass
 > Demo.show()->self
 */
```


### 十九、encoder与decoder
> 使用JsKlass定义的类，而类实例化的对象都具有encoder编码与decoder解码操作

```js
const Demo = JK.DefClass('Demo', function (sl, co, st, su) {
  let name = null
  let age = null

  sl._construct = function () {
    name = "jsklass"
    age = 18
  }

  /**
   * @description show方法
   * @function Demo#_decoder
   */
  sl._decoder = function (decoder) {
    name = decoder.name
    age = decoder.age
    su._decoder(decoder.super)
  }
  
  /**
   * @description show方法
   * @function Demo#_encoder
   */
  sl._encoder = function () {
    return {"name": name, "age": age, "super": su._encoder()}
  }

  /**
   * @description get方法
   * @function Demo#get
   */
  sl.get = function () {
    return "name = "+name+"; age = "+age
  }
})

let demo = new Demo
console.log(demo.get())
console.log(demo._encoder())

let coderStr = '{ "name": "jsklass-reset", "age": 20, "super": {} }'
let demo2 = Demo.renew(coderStr)
console.log(demo2.get())

/**运行结果：
 > name = jsklass; age = 18
 > { name: "jsklass", age: 18, super: {} }
 > name = jsklass-reset; age = 20
 */
```


### 二十、JsKlass类原型与其他Function类型进行绑定
> JsKlass提供一个类原型能与其他Function类型进行绑定的功能

```js
/**
 * @description 例如：Demo类原型需要绑定Error类
 * @class Demo
 */
const Demo = DefClass('Demo', function (sl) {
  
}, null, null, Error)

let demo = new Demo()
console.log(demo.stack)

/**运行结果：
 > Class@http://localhost/jsklass-dev/dist/klass.js:1907:67
   DefClass@http://localhost/jsklass-dev/dist/klass.js:3203:11
   @http://localhost/jsklass-dev/dist/klass.html:333:15
   ....
 */
```


### 二十一、类剖析
>当定义一个类后，类自身会固定内置有一些属性与方法，以下说明：

```js
/**
 * @description Demo类
 * @class Demo
 */
const Demo = DefClass('Demo', function (sl, co, st) {
  co.VERSION = '1.0.1'

  st.username = 'awen'
  
  po.user = 'jsklass'
  
  /**
   * @description show方法
   * @function Demo#show
   */
  sl.show = function () {
    console.log('Demo.show()')
  }
})

console.log(Demo)

/*
|-Demo()                      //Demo类
  |-id                        //类的唯一标识
  |-getConst                  //获取常量
  |-getStatic                 //获取静态属性
  |-setStatic                 //设置静态属性
  |-extendOf                  //校验是否继承某个类
  |-instanceOf                //校验某个实例对象是否是该类实例
  |-protocolOf                //校验是否遵循某个协议
  |-protocol_name             //所有协议的名称集合
  |-new                       //预置 xxx.new() ,与 new xxx 等价
  |-renew                     //预置 xxx.renew(),在decoder还原一个类实例时使用
  |-name                      //类名称
  |-super_name                //所有父类名称
  |-toString                  //把该类转成code
  |->>>>>const_pro<<<<<       //常量区
    |-VERSION: '1.0.1'
    |-...
      |->>>>>static_pro<<<<<  //静态区
        |-username: 'awen'    
        |-...
  |-...
*/
```


### 二十二、类实例剖析
>当一个类被实例化对象后，对象自身也会固定内置有一些属性与方法，以下说明：

```js
const Demo = JK.DefClass('Demo', function (sl, co, st, su, po) {
  co.VERSION = '1.0.1'
  
  st.username = 'awen'
  
  po.user = 'jsklass'
  
  /**
   * @description show方法
   * @function Demo#show
   */
  sl.show = function () {
    console.log('Demo.show()')
  }
})

console.log(new Demo)

/*
|-{}                              //实例化的对象
  |-show: function()              //sl指向中的show方法
  |-...
​  |->>>>>prototype<<<<<           //类中prototype原型对象
    |-user: 'jsklkass'            //po实例原型指向的属性与方法
    |-...
    |->>>>>prototype<<<<<
      |-id                        //实例唯一标识
      |-classOf                   //检验该实例是否属于某个类
      |-class_name                //类名
      |-getConst                  //获取常量
      |-getStatic                 //获取静态属性
      |-setStatic                 //设置静态属性
      |-protocolOf                //校验是否遵循某个协议
      |-toString                  //把该实例转成code
*/

```


### 二十三、浏览器版本的Global
>JsKlass在浏览器版本中提供了一个额外的Global，它的作用是使得闭包里的类定义或实例对象变成全局，在运行环境中任何一个地方都可访问使用

demo-a.js 模块
```js
(function (DefClass, DefProtocol, ProtocolType, Global) {

  Global.DemoA = DefClass('DemoA', function (sl, co, st, su, po) {
    sl.show = function () {
      console.log('DemoA.show()')
    }
  })

})(
  JK.DefClass,
  JK.DefProtocol,
  JK.ProtocolType,
  JK.Global
)
```

demo-b.js 模块
```js
(function (DefClass, DefProtocol, ProtocolType, Global) {

  // 继承demo-a.js模块的DemoA类
  const DemoB = DefClass('DemoB', function (sl, co, st, su, po) {
    sl.show = function () {
      console.log('DemoB.show()')
    }
  }, Global.DemoA)

  Global.demo = new DemoB;
})(
  JK.DefClass,
  JK.DefProtocol,
  JK.ProtocolType,
  JK.Global
)
```

demo.js
```js
(function (DefClass, DefProtocol, ProtocolType, Global) {
  console.log(new Global.DemoA)
  console.log(Global.demo)
})(
  JK.DefClass,
  JK.DefProtocol,
  JK.ProtocolType,
  JK.Global
)
```


### 二十四、JsKlass类内置API

| Api | Parameter | Describe |
| :-------------: |:-------------:| :-----:|
| getConst | (name) | 获取常量，不传name获取所有 |
| getStatic | (name) | 获取静态，不传name获取所有 |
| setStatic | (name, value) | 设置静态属性 |
| extendOf | (Class) | 校验是否继承某个类 |
| instanceOf | (Instance) | 校验某个实例对象是否是该类实例 |
| protocolOf | (Protocol) | 校验是否遵循某个协议 |
| new | (...) | 与 new xxx 等价 |
| renew | (...) | 在decoder还原一个类实例时使用 |


### 二十五、JsKlass类的实例内置API

| Api | Parameter | Describe |
| :-------------: |:-------------:| :-----:|
| getConst | (name) | 获取常量，不传name获取所有 |
| getStatic | (name) | 获取静态，不传name获取所有 |
| setStatic | (name, value) | 设置静态属性 |
| classOf | (Class) | 校验当前实例对象是否是属性某个类实例 |
| protocolOf | (Protocol) | 校验当前实例的类是否遵循某个协议 |


### 二十六、JsKlass协议内置API

| Api | Parameter | Describe |
| :-------------: |:-------------:| :-----:|
| extendOf | (Class) | 校验是否继承某个协议 |
| instanceOf | (Instance) | 校验某个实例对象是否是遵循该协议 |


### 二十七、JsKlass关键词
>JsKlass自身保留一些关键词，而在声名属性或方法时不可以使用关键词，具体如下：

CLASS(const/static)常量与静态关键词：
```text
'class_name',
'protocol_name',
'super_name',
'prototype',
'constructor',
'id',
'setStatic',
'getStatic',
'getConst',
'instanceOf',
'extendOf',
'classOf',
'protocolOf',
'apply',
'bind',
'call',
'caller',
'hasOwnProperty',
'isPrototypeOf',
'propertyIsEnumerable',
'toLocaleString',
'valueOf',
'__proto__',
```

CLASS(self、prototype)关键词：
```text
'class_name',
'protocol_name',
'super_name',
'prototype',
'constructor',
'id',
'setStatic',
'getStatic',
'getConst',
'instanceOf',
'extendOf',
'classOf',
'protocolOf',
'apply',
'bind',
'call',
'caller',
'toSource',
'toString',
'hasOwnProperty',
'isPrototypeOf',
'propertyIsEnumerable',
'toLocaleString',
'valueOf',
'__proto__',
```


###官方文档: www.jsklass.com/document

## LICENSE
    MIT
