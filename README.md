# vue-input-keyboard
以数字为主的键盘模拟组件，且内置有效性验证，优化输入互动逻辑，提高用户的输入效率。

[demo](http://jsfiddle.net/wanyaxing/41mzw0Ly/embedded/result,html,js/)

## 基础特性：
* 支持输入常规的数字值，支持负数，支持小数。
* 支持触控屏操作
* 支持 delete（回退一格）、clear（清空文本区）、 return（提交）
## 高级特性：
* 替换指定位数字：按住文本区字符后鼠标（或手指）移动到按键区的按键上释放，则使用目标按键的字符替换当前字符。
    * 如果是在 delete 键上释放，则为删除当前字符。（和直接点击删除键效果一致）
    ![feature_replace](./examples/images/feature_replace.gif)
* 支持光标锚点移动：
    * 点击文本区字符则光标定位到改字符右侧（此时点击删除会删除光标左侧的字符即当前字符）
        * 按住文本区字符鼠标（或手指）在文本区滑动，光标也会随之移动。
    * 点击文本区左侧的空白区域则光标定位到首位字符左侧（当光标左侧没有字符时，点击删除键会删除首位字符）
    ![feature_cursor_move](./examples/images/feature_cursor_move.gif)
* 预测数值有效性并动态展示按键的可点击状态
* 点击小数点自动补充首位字符为0


## 待完成的更多特性：
    □ 支持初始值超出有效性的情况警告
    □ 支持键盘快捷键
    □ 支持手机号码输入和验证
    □ 支持身份证号码输入和验证（注：还要支持特殊字符X的处理）
    □ 支持自定义字符输入和验证
    □ 支持基础的计算功能，如加减乘除
    □ 支持自定义 return / delete / clear 按钮的文字
    □ 支持自定义高级按钮（如自定义增加步进增减按钮）
    □ 支持自定义指令v-inputkeyboard应用于任意元素或组件
    □ 支持PC网页里键盘动态位置展示
    □ ...

## props

| property         |            type             | default      | description                                     |
| ---------------- | :-------------------------: | :----------: | ----------------------------------------------- |
|  min             |   String,Number             | -99999999999 |                                                 |
|  max             |   String,Number             |  99999999999 |                                                 |
|  maxlength       |   String,Number             |  11          |  (1-11)                                         |
|  decimals        |   String,Number             |  0           |  (0-9)                                          |
|  disabled        |   String,Boolean,Number     |  false       |                                                 |
|  readonly        |   String,Boolean,Number     |  false       |                                                 |
|  placeholder     |   String                    |  '...'       |                                                 |
|  v-model         |   Number                    |  0           |                                                 |
|  value           |   Number                    |  0           |                                                 |


## NPM
```html
#install

npm install vue-input-keyboard --save

# main.js

import Vue from 'vue'
Vue.use(require('vue-input-keyboard'))

# example.vue

<inputkeyboard v-model="item.age" min="0" max="110" decimals="0" placeholder="??"/>
```

## Browser
```html
<body>
<div id="app">
<div>[HOME]</div>
<center>
    number:<inputkeyboard v-model="number" :decimals="2" placeholder="click to enter"/>
</center>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="https://npmcdn.com/vue-input-keyboard/dist/index.min.js"></script>

<script>
new Vue({
    el: '#app',
    data() {
        return {
            number: -12345,
        }
    },
    methods: {

    }
})

</script>
</body>
```

## DEVELOP

* git clone & init
```
    npm install
```
* code & build
```
    npm run build
```
## License

MIT

