## JsKlass简介
>JsKlass是基于Javascript实现的OOP代码结构，一个完全实现OOP编程的JS库，具有类、继承、接口、类常量、类静态、final类型修饰、原生prototype支持、内置类安全机制等功能特征。
##### website: www.jsklass.com

##使用前言
>JsKlass不依懒任何第三方库，它是一个独立的JS库，兼容IE8+以上的所有主流浏览器（即与jQuery2.0+所支持的浏览器同级）；在使用它前需要有Javascript基础并且对OOP有所了解。

##### Browser version: https://github.com/liangwengao/jsklass
##### Import version: https://github.com/liangwengao/jsklass-import
##### Require version: https://github.com/liangwengao/jsklass-require

## Install
### bower module
```shell
bower install liangwengao/jsklass --save
```
### node import module
```shell
npm install jsklass-import --save

------------------or------------------

npm install liangwengao/jsklass-import --save
```
### node require module
```shell
npm install jsklass-require --save

------------------or------------------

npm install liangwengao/jsklass-require --save
```

## JsKlass API: 
```text
DefClass: Define class
DefInterface: Define interface
InterfaceType: Define interface to implement type
Global: Save module, "Browser version" has api 
```

### Syntax
>定义类语法
``` js
var 类名 = DefClass("类名", function (sl, co, st, su, po) {
    //...
  });
```
>定义接口
``` js
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
``` js
var 类名 = DefClass("类名", function (sl, co, st, su, po) {
    //...
  }, 继承的基类);
```
>类实现接口语法
``` js
var 类名 = DefClass("类名", function (sl, co, st, su, po) {
    //...
  }, null, 实现的接口);
```

### Creating a Class in "browser version"
``` js
<script type="text/javascript" src="/bower_components/jsklass/lib/jsklass.js"></script>

<script type="text/javascript">
  /**
   * @description Demo类
   * @class Demo
   */
  var Demo = Jsklass.DefClass("Demo", function (sl, co, st, su, po) {
    //todo ...
  });
  
------------------or------------------

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
``` js
const Jsklass = require('jsklass-require');

/**
* @description Demo类
* @class Demo
*/
const Person = Jsklass.DefClass("Person", function (sl, co, st, su, po) {
  //todo ...
});
```

### Creating a Class in "import version"
``` js
import {
    DefClass,
    Interfaces,
    InterfaceType
} from 'jsklass-import';

/**
* @description Demo类
* @class Demo
*/
const Person = DefClass("Person", function (sl, co, st, su, po) {
  //todo ...
});
  
------------------or------------------

import * as JsKlass from 'jsklass-import';

/**
* @description Demo类
* @class Demo
*/
const Person = JsKlass.DefClass("Person", function (sl, co, st, su, po) {
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

``` js
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
>一个类在定义时可以去继承另一个类的属性或方法，但不支持多重继承，一个类只允许继承一个基类，也允许无限级继承。
``` js
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

*Tip: Extends *

### Interface

``` js

```


### Implement

because sometimes you want to overwrite OR mixin an instance method

``` js

```

### Const

``` js

```

### Static

``` js

```

### Super

``` js

```

### Prototype

``` js

```

### Final type symbol

``` js

```

Please read the development document to www.jsklass.com/document

## LICENSE
    MIT
