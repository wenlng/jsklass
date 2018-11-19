## JsKlass简介
>JsKlass是基于Javascript实现的OOP代码结构，一个完全实现OOP编程的JS库，具有类、继承、接口、类常量、类静态、final类型修饰、原生prototype支持、内置类安全机制等功能特征。
##### website: www.jsklass.com

## 使用前言
>JsKlass不依懒任何第三方库，它是一个独立的JS库，兼容IE8+以上的所有主流浏览器（即与jQuery2.0+所支持的浏览器同级）；在使用它前需要有Javascript基础并且对OOP有所了解。

##### Browser version: https://github.com/liangwengao/jsklass
##### Import version: https://github.com/liangwengao/jsklass-import
##### Require version: https://github.com/liangwengao/jsklass-require

## Install
### bower module
```shell
bower install liangwengao/jsklass --save
```

### es import module
```shell
npm install jsklass-import --save
```
or
```shell
npm install liangwengao/jsklass-import --save
```

### node require module
```shell
npm install jsklass-require --save
```
or
```shell
npm install liangwengao/jsklass-require --save
```


## JsKlass API: 
```text
JsKlass.DefClass: Define class
JsKlass.DefInterface: Define interface
JsKlass.InterfaceType: Define interface to implement type
JsKlass.Global: Save module, "Browser version" has api 
```

### Syntax
>定义类语法
```js
var 类名 = DefClass("类名", function (sl, co, st, su, po) {
    //...
  });
```
>定义接口
```js
//第二个参数是对self指向的约定规范
  var 接口名 = DefInterface("接口名", {
     //...
  });

  //第三个参数是对const指向的约定规范
  var 接口名 = DefInterface("接口名", null, {
     //...
  });

  //第四个参数是对static指向的约定规范
  var 接口名 = DefInterface("接口名", null, null, {
     //...
  });

  //第五个参数是接口继承
  var 接口名 = DefInterface("接口名", null, null, null, 继承的基接口);
```
>类继承语法
```js
var 类名 = DefClass("类名", function (sl, co, st, su, po) {
    //...
  }, 继承的基类);
```
>类实现接口语法
```js
var 类名 = DefClass("类名", function (sl, co, st, su, po) {
    //...
  }, null, 实现的接口);
```

### Creating a Class in "browser version"
```html
<script type="text/javascript" src="/bower_components/jsklass/lib/jsklass.js"></script>

<script type="text/javascript">
  /**
   * @description Demo类
   * @class Demo
   */
  var Demo = JsKlass.DefClass("Demo", function (sl, co, st, su, po) {
    //todo ...
  });
```
or

```html
<script type="text/javascript" src="/bower_components/jsklass/lib/jsklass.js"></script>

<script type="text/javascript">
  (function(DefClass, DefInterface, InterfaceType, Global){
    /**
     * @description Demo类
     * @class Demo
     */
    var Demo = DefClass("Demo", function (sl, co, st, su, po) {
      //todo ...
    });
  })(JsKlass.DefClass, 
  JsKlass.DefInterface, 
  JsKlass.InterfaceType,
  JsKlass.Global);  
</script>
```

### Creating a Class in "require version"
```js
const JsKlass = require('jsklass-require');

/**
* @description Demo类
* @class Demo
*/
const Demo = JsKlass.DefClass("Demo", function (sl, co, st, su, po) {
  //todo ...
});
```

### Creating a Class in "import version"
```js
import * as JsKlass from 'jsklass-import';

/**
* @description Demo类
* @class Demo
*/
const Demo = JsKlass.DefClass("Demo", function (sl, co, st, su, po) {
  //todo ...
});
```
or

```js
import {
    DefClass,
    Interfaces,
    InterfaceType
} from 'jsklass-import';

/**
* @description Demo类
* @class Demo
*/
const Demo = DefClass("Demo", function (sl, co, st, su, po) {
  //todo ...
});
```

### Class Pointer
>在定义一个类时，把属性或方法绑定到 sl 即“self”的指向中，该属性或方法就会属于实例化后对象的，如果在类中声名了_construct构造函数，在实例化对象时则会自动调用

| Name | Pointer | Describe |
| :-------------: |:-------------:| :-----:|
| sl | self或this | 对象的指向 |
| co | const | 常量的指向 |
| st | static | 静态的指向 |
| st | super | 父类的指向 |
| po | prototype | 原型的指向 |

```js
/**
* @description Demo类
* @class Demo
*/
var Demo = DefClass("Demo", function (sl, co, st, su, po) {
  sl._construct = function () {
    console.log("Demo._construct()");
  };
  
  /**
   * @description show方法
   * @function Demo#show
   */
  sl.show = function () {
    console.log("Demo.show()");
  };
  
  /**
   * @description hide方法
   * @function Demo#hide
   */
  sl.hide = function () {
    console.log("Demo.hide()");
  };
});

var demo = new Demo();
demo.show();
demo.hide();

/**运行结果：
> Demo._construct()
> Demo.show()
> Demo.hide()
*/
```

### Extends
>一个类在定义时可以去继承另一个类的属性或方法，但不支持多重继承，一个类只允许继承一个基类。
```js
/**
 * @description DemoA类
 * @class DemoA
 */
var DemoA = DefClass("DemoA", function (sl, co, st, su, po) {
  /**
   * @description show方法
   * @function DemoA#show
   */
  sl.show = function () {
    console.log("DemoA.show()");
  };
});


/**
 * @description DemoB类
 * @class DemoB
 */
var DemoB = DefClass("DemoB", function (sl, co, st, su, po) {
  sl._construct = function () {
    console.log("DemoB._construct()");
  };

  /**
   * @description hide方法
   * @function DemoB#hide
   */
  sl.hide = function () {
    console.log("DemoB.hide()");
  };
}, DemoA);

var demo = new DemoB();
demo.show();
demo.hide();

/**运行结果：
 > DemoB._construct()
 > DemoA.show()
 > DemoB.hide()
 */
```

### Overwrite
>当一个类去继承另外一个类时，被继承的方法或属性可以使用相同的名称去声明覆盖。
```js
/**
 * @description DemoA类
 * @class DemoA
 */
var DemoA = DefClass("DemoA", function (sl, co, st, su, po) {
  /**
   * @description show方法
   * @function DemoA#show
   */
  sl.show = function () {
    console.log("DemoA.show()");
  };

  /**
   * @description hide方法
   * @function DemoA#hide
   */
  sl.hide = function () {
    console.log("DemoA.hide()");
  };
});


/**
 * @description DemoB类
 * @class DemoB
 */
var DemoB = DefClass("DemoB", function (sl, co, st, su, po) {
  sl._construct = function () {
    console.log("DemoB._construct()");
  };

  /**
   * @description hide方法
   * @function DemoB#hide
   */
  sl.hide = function () {
    console.log("DemoB.hide()");
  };

  /**
   * @description display方法
   * @function DemoB#display
   */
  sl.display = function () {
    console.log("DemoB.display()");
  };
}, DemoA);

var demo = new DemoB();
demo.show();
demo.hide();
demo.display();

/**运行结果：
 > DemoB._construct()
 > DemoA.show()
 > DemoB.hide()
 > DemoB.display()
 */
```

### super父类
>在继承时被覆盖后的方法或属性可以通过 su 即“super”的指向去访问。
```js
/**
 * @description DemoA类
 * @class DemoA
 */
var DemoA = DefClass("DemoA", function (sl, co, st, su, po) {
  sl._construct = function () {
    console.log("DemoA._construct()");
  };

  /**
   * @description show方法
   * @function DemoA#show
   */
  sl.show = function () {
    console.log("DemoA.show()");
  };

  /**
   * @description hide方法
   * @function DemoA#hide
   */
  sl.hide = function () {
    console.log("DemoA.hide()");
  };
});


/**
 * @description DemoB类
 * @class DemoB
 */
var DemoB = DefClass("DemoB", function (sl, co, st, su, po) {
  sl._construct = function () {
    console.log("DemoB._construct()");
    su._construct();
  };

  /**
   * @description hide方法
   * @function DemoB#hide
   */
  sl.hide = function () {
    console.log("DemoB.hide()");
    su.hide();
  };

}, DemoA);

var demo = new DemoB();
demo.show();
demo.hide();

/**运行结果：
 > DemoB._construct()
 > DemoA._construct()
 > DemoA.show()
 > DemoB.hide()
 */
```

### “$” Final type symbol
>在继承时如果父类声明的方法或属性使用了“$”修饰，则该方法或属性就会变成“final”类型将不可被覆盖，强行覆盖会直接抛出类声明级别的致命错误。

>注：“$”修饰符只对 sl 指向, po 指向生效。
```js
/**
 * @description DemoA类
 * @class DemoA
 */
var DemoA = DefClass("DemoA", function (sl, co, st, su, po) {
  /**
   * @description show方法
   * @function DemoA#show
   */
  sl.$show = function () {
    console.log("DemoA.show()");
  };

  /**
   * @description hide方法
   * @function DemoA#hide
   */
  sl.hide = function () {
    console.log("DemoA.hide()");
  };
});


/**
 * @description DemoB类
 * @class DemoB
 */
var DemoB = DefClass("DemoB", function (sl, co, st, su, po) {
  sl._construct = function () {
    console.log("DemoB._construct()");
  };

  /******因为父类的show使用了"$"修饰符，此处如果覆写show会报ERROR******/
  /**
   * @description show方法
   * @function DemoB#show
   */
  //sl.show = function () {
  //  console.log("DemoB.show()");
  //};

  /**
   * @description hide方法
   * @function DemoB#hide
   */
  sl.hide = function () {
    console.log("DemoB.hide()");
  };

}, DemoA);

var demo = new DemoB();

/******因为父类的show使用了"$"修饰符，此处即使覆写了show会不生效******/
sl.show = function () {
  console.log("demo.rewire.show()");
};

demo.show();
demo.hide();

/**运行结果：
 > DemoB._construct()
 > DemoA.show()
 > DemoB.hide()
 */
```

### Interface
>接口是一种类规范，是指定一个类的基本功能实现。
 
>在声明一个类时指定了一个接口，那么该类必须实现接口中的一系列方法或属性；如果没有实现接口中指定的方法或属性，则会抛出一个声明级别的致命错误。

| Function | Describe |
| :------------- | :-----|
| InterfaceType.function()： | 方法类型 |
| InterfaceType.string() | 字符串类型 |
| InterfaceType.number() | 数字类型 |
| InterfaceType.objects() | Object类型 |
| InterfaceType.all | 所有类型 |

```js
//DemoA接口: 对将实现的类“self”指向进行规范
var DemoA = DefInterface("DemoA", {
  name: InterfaceType.string(),
  age: InterfaceType.number(),
  eat: InterfaceType.function()
});

//DemoB接口: 对将实现的类“const”指向进行规范
var DemoB = DefInterface("DemoB", null, {
  VERSION: InterfaceType.string()
});

//DemoC接口: 对将实现的类“static”指向进行规范
var DemoC = DefInterface("DemoC", null, null, {
  common: InterfaceType.object()
});
```

### Interface and Interface extends
>接口继承与类继承一样，也是不支持多重继承，一个接口只允许继承一个基接口，也允许无限级继承。

```js
//DemoA接口
var DemoA = DefInterface("DemoA", {
  name: InterfaceType.string()
});

//DemoB接口，继承了DemoA接口
var DemoB = DefInterface("DemoB", {
  age: InterfaceType.number(),
  eat: InterfaceType.function()
}, null, null, DemoA);
```

### Class implementation interface
>一个类在实现接口时，即支持单一实现，也支持实现多重实现，在多重实现时需要传入接口数组。
```js
//DemoA接口
var DemoA = DefInterface("DemoA", {
  show: InterfaceType.string()
});

//DemoB接口
var DemoB = DefInterface("DemoB", {
  show: InterfaceType.number()
});

/**
 * @description DemoImpl类，使用接口数组多重实现
 * @class DemoImpl
 */
var DemoImpl = DefClass("DemoImpl", function (sl, co, st, su, po) {
  sl._construct = function () {
    console.log("DemoImpl._construct()");
  };

  /**
   * @description show方法
   * @function DemoImpl#show
   */
  sl.show = function () {
    console.log("DemoImpl.show()");
  };

  /**
   * @description hide方法
   * @function DemoImpl#hide
   */
  sl.hide = function () {
    console.log("DemoImpl.hide()");
  };
}, null, [DemoA,DemoB]);

var demoImpl = new DemoImpl();
demoImpl.show();
demoImpl.hide();

/**运行结果：
 > DemoImpl._construct()
 > DemoImpl.show()
 > DemoImpl.hide()
 */
```

### Const
>常量是值不可变的量，它不属于类的任何一个实例，而是属于类本身。

>常量被定义后，无论在什么地方都不可改变它的值。
```js
/**
 * @description Demo类
 * @class Demo
 */
var Demo = DefClass("Demo", function (sl, co, st, su, po) {
  co.VERSION = "1.0.1";
  co.show = function () {
    console.log("Demo.show()->const");
  };
  sl.show = function () {
    console.log("Demo.show()->self");
  }
});

Demo.show();
var demo = new Demo();
demo.show();

/**运行结果：
 > Demo.show()->const
 > Demo.show()->self
 */
```

### Static
>静态与普通的成员属性不同，静态属性属于类本身而不属于类的任何实例。

>静态属性可以理解是存储在类当中的全局变量，可以在任何地方通过类或实例来进行修改或访问。
```js
/**
 * @description Demo类
 * @class Demo
 */
var Demo = DefClass("Demo", function (sl, co, st, su, po) {
  st.name = "jsklass";
  st.show = function () {
    console.log("Demo.show()->static");
  };
  sl.show = function () {
    console.log("Demo.show()->self");
  }
});

Demo.static.show();
var demo = new Demo();
demo.show();

/**运行结果：
 > Demo.show()->static
 > Demo.show()->self
 */
```

### Prototype
>在javascript中每个函数就是一个对象（Function），函数对象都有一个子对象 prototype对象，类是以函数的形式来定义的。prototype表示该函数的原型，也表示一个类的成员的集合。

>在JsKlass中，prototype就是一个实例化对象的原型对象，当前实例化的对象中存在与原型对象中的一致的属性或方法时，会优先读取实例化对象中的属性或方法
```js
/**
 * @description Demo类
 * @class Demo
 */
var Demo = DefClass("Demo", function (sl, co, st, su, po) {
  po.username = "jsklass";
  po.show = function () {
    console.log("Demo.show()->prototype");
  };
  sl.show = function () {
    console.log("Demo.show()->self");
  }
});

var demo = new Demo();
console.log(demo.username);
demo.show();

/**运行结果：
 > jsklass
 > Demo.show()->self
 */
```

### 类剖析
>当定义一个类后，类自身会固定内置有一些属性与方法，以下说明：
```js
/**
 * @description Demo类
 * @class Demo
 */
var Demo = DefClass("Demo", function (sl, co, st, su, po) {
  co.VERSION = "1.0.1";

  /**
   * @description show方法
   * @function Demo#show
   */
  sl.show = function () {
    console.log("Demo.show()");
  };
});

console.log(Demo);

/*
|-Demo()                //Demo类
  |-VERSION: "1.0.1"    //常量
  |-...
​  |-_vd_                //JsKlass内部使用
  |-lifetime_uid: "..." //运行环境里动态并且唯一的UID标识
  |-class_name          //类名
  |-instanceOfClass     //检测某个实例是否属于该类的
  |-instanceOfInterface //检测某个接口是否属于该类实现的
  |-interface_name      //保存的接口名称对象
  |-static              //静态区
  |-super_class_name    //保存的父类名称对象
  |-toString            //把该类转成code
*/
```


### 实例剖析
>当一个类被实例化对象后，对象自身也会固定内置有一些属性与方法，以下说明：
```js
(function (DefClass, DefInterface, InterfaceType, Global) {
  /**
   * @description Demo类
   * @class Demo
   */
  var Demo = DefClass("Demo", function (sl, co, st, su, po) {
    co.VERSION = "1.0.1";

    /**
     * @description show方法
     * @function Demo#show
     */
    sl.show = function () {
      console.log("Demo.show()");
    };

    /**
     * @description hide方法
     * @function Demo#hide
     */
    po.hide = function () {
      console.log("Demo.hide()");
    };
  });

  console.log(new Demo);

  /*
  |-{}                        //实例化对象
    |-show: function()        //sl指向中的show方法
    |-...
  ​  |->prototype<             //类中prototype原型对象
      |-hide: function()      //po指向的属性与方法
      |-...
      |->prototype<
        |-_vd_:               //JsKlass内部使用
        |-lifetime_uid: "..." //运行环境里动态并且唯一的UID标识
        |-class_name          //类名
        |-instanceOfClass     //检测该实例是否属于某个类的
        |-instanceOfInterface //检测某个接口是否属于该实例实现的
        |-interface_name      //保存的接口名称对象
        |-super_class_name    //保存的父类名称对象
        |-toString            //把该类转成code
  */

})(window.JsKlass.DefClass,
  window.JsKlass.DefInterface,
  window.JsKlass.InterfaceType,
  window.JsKlass.Global);
```

### Browser version Global
>JsKlass提供了四个对象，其中包括了Global，它的作用是使得闭包里的类定义或实例对象变成全局，在运行环境中任何一个地方都可访问使用，同时也为app提供了模块化功能

demo-a.js 模块
```js
(function (DefClass, DefInterface, InterfaceType, Global) {

  Global.DemoA = DefClass("DemoA", function (sl, co, st, su, po) {
    sl.show = function () {
      console.log("DemoA.show()");
    };
  });

})(
  JsKlass.DefClass,
  JsKlass.DefInterface,
  JsKlass.InterfaceType,
  JsKlass.Global
);
```

demo-b.js 模块
```js
(function (DefClass, DefInterface, InterfaceType, Global) {

  var DemoB = DefClass("DemoB", function (sl, co, st, su, po) {
    sl.show = function () {
      console.log("DemoB.show()");
    };
  }, Global.DemoA);

  Global.demo = new DemoB;
})(
  JsKlass.DefClass,
  JsKlass.DefInterface,
  JsKlass.InterfaceType,
  JsKlass.Global
);
```

demo.js
```js
(function (DefClass, DefInterface, InterfaceType, Global) {
  console.log(new Global.DemoA);
  console.log(Global.demo);
})(
  JsKlass.DefClass,
  JsKlass.DefInterface,
  JsKlass.InterfaceType,
  JsKlass.Global
);
```

### 安全机制
>JsKlass具有自身防范安全机制，能防止恶意类的侵入，保证一个类的完整性。
 
>在定义一个类时，类安全机制核心会自动生成一个唯一可读不可写的lifetime_uid，它是运行时的环境有效，随着类的消失而消失。

类内置的instanceOfClass：  
语法1：[class].instanceOfClass([instance])  
语法2：[instance].instanceOfClass([class])

```js
/**
 * @description Demo类
 * @class Demo
 */
var Demo = DefClass("Demo", function (sl, co, st, su, po) {
  po.username = "jsklass";
  po.show = function () {
    console.log("Demo.show()->prototype");
  };
  sl.show = function () {
    console.log("Demo.show()->self");
  }
});

var DemoA = DefClass("DemoA", function (sl, co, st, su, po) {

});

var demo = new Demo();
console.log(Demo.instanceOfClass(demo));
console.log(demo.instanceOfClass(Demo));

console.log(DemoA.instanceOfClass(demo));
console.log(demo.instanceOfClass(DemoA));

/**运行结果：
 > true
 > true
 >
 > false
 > false
 */
```


类内置的instanceOfInterface：  
语法1：[class].instanceOfInterface([instance])  
语法2：[instance].instanceOfInterface([interface])
```js
//DemoA接口
var DemoA = DefInterface("DemoA", {
  show: InterfaceType.function()
});

//DemoB接口
var DemoB = DefInterface("DemoB", {
  show: InterfaceType.function()
});

/**
 * @description Demo类
 * @class Demo
 */
var Demo = DefClass("Demo", function (sl, co, st, su, po) {
  po.username = "jsklass";
  po.show = function () {
    console.log("Demo.show()->prototype");
  };
  sl.show = function () {
    console.log("Demo.show()->self");
  }
}, null, DemoA);

var demo = new Demo();
console.log(Demo.instanceOfInterface(DemoA));
console.log(demo.instanceOfInterface(DemoA));

console.log(Demo.instanceOfInterface(DemoB));
console.log(demo.instanceOfInterface(DemoB));

/**运行结果：
 > true
 > true
 >
 > false
 > false
 */
```

### JsKlass关键词
>JsKlass自身保留一些关键词，而在声名属性或方法时不可以使用关键词，具体如下：

CLASS(const)常量关键词：
```text
class_name
super_class_name
interface_name
static
super
prototype
constructor
lifetime_uid
_vd_
instanceOfInterface
instanceOfClass
$class_name
$super_class_name
$interface_name
$static
$super
```

CLASS(self、prototype)关键词：
```text
class_name
super_class_name
interface_name
super
prototype
constructor
lifetime_uid
_vd_
instanceOfInterface
instanceOfClass
$class_name
$super_class_name
$interface_name
$super
$prototype
$constructor
$lifetime_uid
$_vd_
$instanceOfInterface
$instanceOfClass
```

###Please read the development document: www.jsklass.com/document

## LICENSE
    MIT
