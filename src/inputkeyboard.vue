<template>
    <span class="input_keyboard" >
        <span class="input_label" @click="visible=true">
            {{value!==null?value:placeholder}}
        </span>
        <keyboardbg v-if="visible" :value="value" v-show="visible" :visible.sync="visible" v-bind="$attrs" v-on="$listeners">
        </keyboardbg>
    </span>
</template>

<script>
import keyboardbg from './keyboardbg.vue';

export default {
    name: 'inputkeyboard',
    inheritAttrs: false,
    components:{
        keyboardbg,
    },
    props:
    {
        'value':{type:Number,default:0},
        'placeholder':{type:String,default:'请选择'},
    },
    data(){
        return {
            visible:false,
        }
    },

};
</script>

<style>
.body-prevent-class {
    overflow: hidden;
}
.body-prevent-class {
    touch-action: none;
}
</style>
