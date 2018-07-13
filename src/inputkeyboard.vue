<template>
    <span class="input_keyboard" @click="visible=true">{{value!==null?value:(placeholder!=''?placeholder:'...')}}<keyboardbg v-if="visible" :value="value" v-show="visible" :visible.sync="visible" v-bind="$attrs" v-on="$listeners"/>
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
        'placeholder':{type:String,default:''},
    },
    data(){
        return {
            visible:false,
        }
    },

};
</script>

<style scoped>
.input_keyboard{
    display: inline-block;
    min-width: 100px;
    padding: 0 10px;
}
</style>
