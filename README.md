# vue-input-keyboard
A keyboard of input with validator, for: numbers, telephone, IDs...  以数字为主的键盘模拟组件，且内置有效性验证，优化输入互动逻辑，提高用户的输入效率。

[demo](http://jsfiddle.net/wanyaxing/41mzw0Ly/embedded/result,html,js/)

## NPM
```
#install
npm install vue-input-keyboard

# main.js
import Vue from 'vue'

import inputkeyboard from 'vue-input-keyboard'
Vue.component(inputkeyboard.name, inputkeyboard)

# example.vue
<inputkeyboard v-model="item.age" min="0" max="110" decimals="0" placeholder="??"/>
```

## Browser
```
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

* init
```
    npm install
```
* code & build
```
    npm run build
```
* publish the code to npm if you want to do it.
```
    npm config set registry=http://registry.npmjs.org

    npm publish
```
## License

MIT

