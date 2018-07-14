<template>
    <span
        class="input_keyboard"
        @click="showKeyboard"
        :class="{input_disabled:isDisabled,input_readonly:isReadonly}"
    >{{value!==null?value:(placeholder!=''?placeholder:'...')}}<keyboardbg v-if="visible" :value="value" v-show="visible" :visible.sync="visible" v-bind="$attrs" v-on="$listeners"/>
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
        'value'      :{type:Number,default:0},
        'placeholder':{type:String,default:''},
        'disabled'   :{type:[String,Boolean,Number],default:false},
        'readonly'   :{type:[String,Boolean,Number],default:false},
    },
    data(){
        return {
            visible:false,
        }
    },
    computed:{
        isDisabled(){
            if (this.disabled && this.disabled!=='false' && this.disabled!=='0')
            {
                return true;
            }
            return false;
        },
        isReadonly(){
            if (this.readonly && this.readonly!=='false' && this.readonly!=='0')
            {
                return true;
            }
            return false;
        },
    },
    methods:{
        showKeyboard:function(){
            if (this.isDisabled || this.isReadonly)
            {
                return false;
            }
            this.visible = true;
        },
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
