<template>
    <div class="keyboard_bg" v-show="visible" @touchstart="preventEvent($event)">
        <div class="keyboard_overlay" @mouseup.self="hide" @touchend.self="hide"></div>
        <div class="keyboard_body"
            :style="{'width':bodyWidth+'px','margin-left':(0-bodyWidth/2)+'px'}"
            :class="{keyboard_unvalid:!isCurrentValueValid}"
            @mouseup="numberTouchCancel()"
        >
            <div class="keyboard_header">
                <div
                    class="keyboard_numbers"
                    @mouseup.self="cursorTouchBefore()" @touchend.self="cursorTouchBefore($event)"
                    :class="{li_cursor_after:(numbers.length == 0)}"
                >
                    <div
                        class="li_bg"
                        v-for="(num,index) in numbers"
                        @mousedown="numberTouch(index)" @touchstart="numberTouch(index,$event)"
                        @mouseover="numberMouseOverInTouch(index)" @touchmove="numberTouchMoveInTouch(index,$event)"
                        @touchend="numberTouchEndInTouch(index,$event)"
                        :index="index"
                    >
                        <div
                            class="li_number"
                            :class="{li_touch:(index==number_touch)
                                     ,li_cursor_after:(index-cursor_index == numbers.length)
                                     ,li_cursor_before:(index==0 && index-cursor_index > numbers.length)
                                    }"
                            :index="index"
                        >{{num}}</div>
                    </div>
                </div>
                <div
                    class="btn_clear"
                    @mouseup="clear()" @touchend="clear($event)"
                    :class="{li_disable:(numbers.length==0)}"
                >{{tt('clear')}}</div>
            </div>
            <div
                class="keyboard_frame"
                @mouseout="key_touch=null"
            >
                <div
                    class="keyboard_keys"
                >
                    <div
                        class="li_bg"
                        v-for="num in [7,8,9,4,5,6,1,2,3,'+/-',0,'.']"
                    >
                        <div
                            class="li_key"
                            :class="{li_touch:(num==key_touch && !isLiDisable(num)),li_disable:(isLiDisable(num))}"
                            @mousedown="keyTouchOver(num)" @mouseover="keyTouchOver(num)" @touchstart="keyTouchOver(num,$event)"
                            @touchmove="keyTouchMove(num,$event)"
                            @mouseup="keyMouseUp(num)" @touchend="keyTouchEnd(num,$event)"
                            :num="num"
                        >{{isILoveYou&&[5,2,0].indexOf(num)>=0?{5:'I',2:'LOVE',0:'U'}[num]:num}}</div>
                    </div>
                </div>
                <div class="keyboard_btns">
                    <div
                        class="li_bg"
                        v-for="num in ['delete','return']"
                    >
                        <div
                            class="li_btn"
                            :class="{li_touch:(num==key_touch && !isLiDisable(num)),li_disable:(isLiDisable(num))}"
                            @mousedown="keyTouchOver(num)" @mouseover="keyTouchOver(num)" @touchstart="keyTouchOver(num,$event)"
                            @touchmove="keyTouchMove(num,$event)"
                            @mouseup="keyMouseUp(num)" @touchend="keyTouchEnd(num,$event)"
                            :num="num"
                        ><span>{{tt(num)}}</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const messages = {
    'delete':{'zh':'删除','en':'delete'},
    'return':{'zh':'确认','en':'return'},
    'clear' :{'zh':'清除','en':'clear'},
}

export default {
    name: 'keyboardbg',
    components:{
    },
    props:
    {
        'value'    :{type:Number,default:0},
        'maxlength':{type:[String,Number],default:11,validator:function(v){return v>=1 && v<=11;}},//最大长度
        'max'      :{type:[String,Number],default:99999999999,validator:function(v){return v>=-99999999999 && v<=99999999999;}},//最大值
        'min'      :{type:[String,Number],default:-99999999999,validator:function(v){return v>=-99999999999 && v<=99999999999;}},//最小值
        'decimals' :{type:[String,Number],default:2,validator:function(v){return v>=0 && v<=9;}},//保留小数位数
        'visible'  :{type:[Boolean],default:false},
    },
    data(){
        return {
            numbers:[],
            number_touch:-1,
            cursor_index:-1,
            key_touch:null,
        }
    },
    computed:{
        // 根据body宽度决定当前键盘宽度
        bodyWidth(){
            // return 640;
            return Math.min(document.body.offsetWidth,750);
        },
        // 将字符串转为数字
        maxValue(){
            return parseFloat(this.max);
        },
        // 将字符串转为数字
        minValue(){
            return parseFloat(this.min);
        },
        // 获取最大值的最大长度
        maxValueLength(){
            return  Math.min((parseInt(this.maxValue)+'').length + (this.maxValue<0&&parseInt(this.maxValue)==0?1:0) + (this.decimals>0?parseInt(this.decimals)+1:0),this.maxlength);
        },
        // 获取最小值的最大长度
        minValueLength(){
            return  Math.min((parseInt(this.minValue)+'').length + (this.minValue<0&&parseInt(this.minValue)==0?1:0) + (this.decimals>0?parseInt(this.decimals)+1:0),this.maxlength);
        },
        // 获得真实的最大字符长度(注意，最小值的长度和最大值的长度谁长谁短可不一定哦。)
        realMaxLength(){
            return Math.max(this.maxValueLength,this.minValueLength)
        },
        // 获得真实的最短字符长度（简单说就是0在有效方位内，则为1，否则就是整数部分的长度，和默认长度中的最小值）
        realMinLength(){
            return (0<=this.maxValue && 0>=this.minValue)?1:Math.min((parseInt(this.maxValue)+'').length,(parseInt(this.minValue)+'').length,this.maxlength)
        },
        currentValue(){
            if (this.numbers.length>0)
            {
                return parseFloat(this.numbers.join(''));
            }
            return null;
        },
        //当前值是否有效
        isCurrentValueValid(){
            return this.currentValue===null || this.isValValid(this.currentValue);
        },
        isILoveYou(){
            return this.currentValue=='5201314';
        },
        isCnLanguage(){
            if (navigator.language)
            {
                return navigator.language=='zh-CN' || navigator.language=='zh';
            }
            return true;
        },
    },
    methods:{
        tt:function(str){
            if (messages[str])
            {
                if (this.isCnLanguage)
                {
                    return messages[str]['zh'];
                }
                return messages[str]['en'];
            }
            return str;
        },
        // 尝试将文本区内容转化成数字，返回 false 或 数字值
        numsToFloat(nums){
            if (nums===false)
            {
                return false;
            }
            if (nums.length==0)
            {
                return 0;
            }
            else if (nums.length==1 && nums[0]=='-')
            {
                return 0;
            }
            //字符不可以超出最大有效长度，超出长度是肯定不行的
            if (nums.length>this.realMaxLength)
            {
                return false;
            }
            //不可以超出小数位数
            var indexOfPoint = nums.indexOf('.');
            if (indexOfPoint>=0 && nums.length-(indexOfPoint+1) > this.decimals)
            {
                return false;
            }
            //转换成浮点型
            var val = parseFloat(nums.join(''));
            if (isNaN(val))
            {
                return false;
            }
            return val;
        },
        // 判断一个值是否有效
        isValValid:function(val){
            if (val===false)
            {//如果不是有效数字，那肯定无效
                return false;
            }

            if ((val+'').length<this.realMinLength)
            {//如果字符数太少，那也无效
                return false;
            }

            // 只有在数字范围内的才有效
            return  val>=this.minValue && val<=this.maxValue;
        },
        // 判断临时数字组有效性（如果无效，一般后续会放弃该数组）
        isDataValid:function(nums){

            var val = this.numsToFloat(nums);

            return this.isValValid(val);
        },
        // 判断一个数字组是否有可能有效，虽然现在无效，但将来有效呢
        isDataMaybeValid:function(nums){
            if (nums.length==0)
            {//空数组总是可能有效的，未来无限可能
                return true;
            }

            var val = this.numsToFloat(nums);

            if (this.isValValid(val))
            {// 如果确实有效，那肯定有效
                return true;
            }

            if (val===false)
            {//如果不是有效数字，那也肯定无效
                return false;
            }

            // 因为字符数超过最大字符是肯定无效的，所以当前字符应该小于最大字符数。
            // 这一步就是尝试补齐0或9到最大字符数，看看当前值在补齐后在未来是否有效
            if (nums.length < this.realMaxLength)
            {
                if (this.maxValue>0 && val>this.maxValue)
                {//大于最大正数，肯定无效
                    return false;
                }
                if (this.minValue<0 && val<this.minValue)
                {//小于最小负数，肯定无效
                    return false;
                }
                // 只有当前正数小于最小正数 或 当前负数大于最大负数，才可能在未来有效
                if ((val>=0 && val<this.minValue) || (val<=0 && val>this.maxValue))
                {
                    if (nums.length < this.maxValueLength)
                    {
                        if (nums.indexOf('.')>=0)
                        {//如果已经有小数存在，则尝试无脑补齐9，看能否超过最小值，因为无脑补9是其变为最大值的唯一机会了。
                            var decimalsCount = nums.length - (nums.indexOf('.')+1);
                            if (this.decimals > decimalsCount)
                            {
                                var fillCount = this.decimals - decimalsCount;
                                var tmp = parseFloat(nums.concat(Array(fillCount + 1).join('9').split('')).join(''));
                                if (!isNaN(tmp))
                                {//如果无脑补了9之后，新正数大于最小正数，或新负数小于最大值，则说明新数有效
                                    if ((tmp>0 && tmp>=this.minValue && this.minValue>=0) || (tmp<0 && tmp<=this.maxValue && this.maxValue<=0))
                                    {
                                        return true;
                                    }
                                }
                            }
                        }
                        else
                        {//如果当前值是整数，则尝试粘贴补齐末尾，看能否进入有效值区间
                            var tmpStr,tmpVal;
                            tmpStr = nums.join('') + (this.maxValue+'').substr(nums.length);
                            if (!tmpStr.match(/^(-|)0[^\.]/))
                            {
                                tmpVal = parseFloat(tmpStr);
                                if (!isNaN(tmpVal) && tmpVal<=this.maxValue && tmpVal>=this.minValue)
                                {
                                    return true;
                                }
                            }
                            tmpStr = nums.join('') + (this.minValue+'').substr(nums.length);
                            if (!tmpStr.match(/^(-|)0[^\.]/))
                            {
                                tmpVal = parseFloat(tmpStr);
                                if (!isNaN(tmpVal) && tmpVal<=this.maxValue && tmpVal>=this.minValue)
                                {
                                    return true;
                                }
                            }
                        }
                    }
                }
                else
                {
                    return false;
                }
            }

            return false;
        },
        // 更新当前数字
        updateNumbers:function(nums,focusdUpdate=0){
            if (focusdUpdate || this.isDataMaybeValid(nums))
            {//只要数字有可能正常值，或强制更新，就暂时接受吧。比如 10-100范围的数字，你总要先输入个位数再输入十位数的。
                this.numbers = nums;
                if (this.numbers.length + this.cursor_index<0)
                {
                    this.cursor_index = 0 - Math.max(this.numbers.length) - 1;
                }
            }
        },
        // 从父路由给的值更新数字
        updateValue:function(val){
            var nums = (val+'').split('');
            this.updateNumbers(nums,1);
        },
        //触发按键
        append:function(num){
            if (num=='return')
            {//回车按键永远可点击
                return this.submit();
            }
            else if (num=='delete' && this.numbers.length>0)
            {//有数字存在则可以点击回退
                return this.delete();
            }
            else
            {
                var index = this.numbers.length + this.cursor_index + 1;
                this.updateNumbers(this.numsOfSplice(index,0,num));
            }
        },
        // 回退一格
        delete:function(){
            var index = this.numbers.length + this.cursor_index;
            if (index<0)
            {
                index = 0;
            }
            this.updateNumbers(this.numsOfSplice(index,1),1);
        },
        // 替换数字
        replace:function(index,num)
        {
            this.updateNumbers(this.numsOfSplice(index,1,num));
            this.number_touch = null;
        },
        //判断按键是否可点击
        isLiDisable:function(num){
            var nums;
            if (num=='return')
            {
                if (this.number_touch>=0)
                {// 替换状态下，不可点击回车。
                    return true;
                }
                else if (!this.isCurrentValueValid)
                {// 当前值无效，不可点击回车
                    return true;
                }
                //回车按键永远可点击
                return false;
            }
            if (num=='delete' && this.numbers.length>0)
            {//有数字存在则可以点击回退
                return false;
            }
            if (num=='+/-' && this.minValue>=0)
            {//如果最小值不是负数，则负号不可用
                return true;
            }

            if (this.number_touch>=0)
            {//替换状态是否可替换
                nums = this.numsOfSplice(this.number_touch,1,num);
            }
            else
            {//或是否可插入
                var index = this.numbers.length + this.cursor_index + 1;
                nums = this.numsOfSplice(index,0,num);
            }
            return nums===false || nums.join('')==this.numbers.join('') || (!this.isDataMaybeValid(nums));
        },
        //获得替换或追加指定位后的临时值
        numsOfSplice:function(index,howmany,num){
            var nums = this.numbers.slice();
            if (num != undefined)
            {
                if (num>=0)
                {
                    if (index==0 && howmany==0 && nums.length>0 && nums[0]=='-')
                    {//负号左侧不可添加数字
                        return false;
                    }
                    nums.splice(index,howmany,num);
                }
                else if (num=='.')
                {
                    if (nums.indexOf('.')>=0 || this.decimals==0)
                    {//已有小数点被选中或不保留小数位数的情况下，不可点击
                        return false;
                    }
                    nums.splice(index,howmany,num);
                }
                else if (num=='+/-')
                {
                    if (howmany>0)
                    {//替换状态下，只有首字母可以替换正负号
                        if (index!=0)
                        {
                            return false;
                        }
                    }
                    if (nums.indexOf('-')==0)
                    {
                        nums.shift();
                    }
                    else
                    {
                        nums.splice(0,howmany,'-');
                    }
                }
                else if (num=='delete')
                {
                    nums.splice(index,howmany);
                }
                else if (num=='return')
                {
                    return false;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                nums.splice(index,howmany);
            }
            if (nums.length>0)
            {
                //移除首位0的情况
                if (nums.length>=2 && nums[0]==0 && nums[1]!='.')
                {
                    nums.splice(0,1);
                }
                else if (nums.length>=3 && nums[0]=='-' && nums[1]==0 && nums[2]!='.')
                {
                    nums.splice(1,1);
                }
                // 优化首位为.的情况
                if (nums.length>=1 && nums[0]=='.')
                {
                    nums.splice(0,0,0);
                }
                else if (nums.length>=2 && nums[0]=='-' && nums[1]=='.')
                {
                    nums.splice(1,0,0);
                }
            }
            return nums;
        },
        // 禁止事件冒泡
        preventEvent($event){
            if ($event){$event.preventDefault();$event.stopPropagation();}
        },
        // 触控左侧空白区域
        cursorTouchBefore:function($event){
            this.preventEvent($event);
            this.cursor_index = 0 - (this.numbers.length) - 1;
        },
        // 触控当前数字
        numberTouch:function(index,$event){
            this.preventEvent($event);
            this.number_touch = index;
            this.cursor_index = 0 - (this.numbers.length - index);
        },
        // 触控效果下的手指在转换替换状态下的触屏移动，分为移动到其他数字和移动到其他按键两种情况
        numberTouchMoveInTouch:function(index,$event){
            this.preventEvent($event);
            if (this.number_touch>=0)
            {
                var changedTouch = $event.changedTouches[0];
                var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
                var elemIndex = elem.getAttribute('index');
                if (elemIndex>=0 && elemIndex!=null)
                {
                    this.numberMouseOverInTouch(elemIndex,$event);
                }
                else
                {
                    var elemNum = elem.getAttribute('num');
                    if (elemNum || elemNum=='0')
                    {
                        this.keyTouchOver(elemNum,$event);
                    }
                }
            }
        },
        // 触控效果下的手指在转换替换状态下的触屏释放，分为其他数字和其他按键两种情况
        numberTouchEndInTouch:function(index,$event){
            this.preventEvent($event);
            if (this.number_touch>=0)
            {
                var changedTouch = $event.changedTouches[0];
                var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
                var elemIndex = elem.getAttribute('index');
                if (elemIndex>=0 && elemIndex!=null)
                {
                }
                else
                {
                    var elemNum = elem.getAttribute('num');
                    if (elemNum || elemNum=='0')
                    {
                        this.keyMouseUp(elemNum,$event);
                    }
                }
                this.numberTouchCancel($event);
            }
        },
        //替换状态下，移动鼠标到其他数字，等于点击其他数字
        numberMouseOverInTouch:function(index,$event){
            this.preventEvent($event);
            if (this.number_touch>=0 && this.number_touch!=index)
            {
                // console.log($event);
                // if ($event && $event.movementY && $event.movementY>2)
                // {
                    setTimeout(()=>{
                        if (this.key_touch)
                        {
                            return false;
                        }
                        this.numberTouch(index,$event);
                    },160);
                    // this.$nextTick(()=>{
                    //     if (this.key_touch)
                    //     {
                    //         return false;
                    //     }
                    //     this.numberTouch(index);
                    // })
                //     return false;
                // }
                // this.numberTouch(index);
            }
        },
        // 数字触控效果取消
        numberTouchCancel:function($event){
            this.preventEvent($event);
            this.number_touch = -1;
        },
        // 触控效果下的手指在按键上的移动
        keyTouchMove:function(num,$event){
            this.preventEvent($event);
            var changedTouch = $event.changedTouches[0];
            var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            var elemNum = elem.getAttribute('num');
            if (elemNum || elemNum=='0')
            {
                this.keyTouchOver(elemNum,$event);
            }
        },
        // 触控效果下的手指在按键上释放
        keyTouchEnd:function(num,$event){
            this.preventEvent($event);
            var changedTouch = $event.changedTouches[0];
            var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            var elemNum = elem.getAttribute('num');
            if (elemNum || elemNum=='0')
            {
                this.keyMouseUp(elemNum,$event);
            }
        },
        // 按键被点击或触控
        keyTouchOver:function(num,$event){
            this.preventEvent($event);
            this.key_touch = num;
        },
        // 键盘按键上释放触控有两种情况，替换或追加
        keyMouseUp:function(num,$event){
            this.preventEvent($event);
            if (this.number_touch>=0)
            {
                this.replace(this.number_touch,num);
            }
            else
            {
                this.append(num);
            }
            this.key_touch = null;
        },
        submit:function(){
            if (this.isCurrentValueValid)
            {
                this.$emit('input',this.currentValue);
                this.hide();
            }
        },
        clear:function($event){
            this.preventEvent($event);
            this.updateNumbers([]);
        },
        hide:function(){
            this.$emit('update:visible',false);
        },
    },
    watch:{
        visible:function(v){
            if (v)
            {

            }
            else
            {

            }
        },
        value:function(val){
            this.updateValue(val);
        }
    },
    mounted() {
        if (this.maxValue<this.minValue)
        {
            alert('vue-input-keyboard: error! the prop of min or max is wrong! ');
            return false;
        }
        document.body.appendChild(this.$el);
        document.body.classList.add('body-prevent-class');
        this.$emit('open');
        this.updateValue(this.value);
    },
    destroyed() {
        if (document.body.classList.contains('body-prevent-class')) {
            document.body.classList.remove('body-prevent-class');
            /*document.body.removeEventListener('touchmove', preventEventFun, {
                passive: false
            });*/
        }
        if (this.$el.parentNode)
        {
            this.$el.parentNode.removeChild(this.$el);
        }
        this.$emit('closed');
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.keyboard_bg >>> *{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box
}
.keyboard_bg{
    position: fixed;
    /*top: 0;*/
    /*right: 0;*/
    bottom:0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    user-select: none;
    -moz-user-select: none;
}
.keyboard_bg .keyboard_overlay{
    background-color: gray;
    opacity: 0.9;
    width:100%;
    height: 100%;
}
.keyboard_bg .keyboard_body{
    position: absolute;
    left:50%;
    bottom: 0;
    background-color: white;
}
.keyboard_bg .keyboard_body .keyboard_header{
    position: relative;
    height: 84px;
    background-color: #f0f1f2;
}
.keyboard_header .keyboard_numbers{
    width: 70%;
    white-space: nowrap;
    text-align: right;
    height: 84px;
    position: relative;
}
.keyboard_unvalid .keyboard_numbers{
    color:#fc1520;
}
.keyboard_header .keyboard_numbers .li_bg{
    display: inline-block;
    width: 9%;
    height: 100%;
    text-align: center;
}
.keyboard_header .keyboard_numbers .li_number{
    width: 95%;
    margin-top:7px;
    line-height: 70px;
    display: inline-block;
    border:1px solid #f0f1f2;
    position: relative;
}
.keyboard_header .li_cursor_before:before{
    content: " ";
    width: 2px;
    height: 100%;
    background-color: #0081f9;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
}
.keyboard_header .li_cursor_after:after{
    content: " ";
    width: 2px;
    height: 100%;
    background-color: #0081f9;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
}
.keyboard_unvalid .li_cursor_before:before,.keyboard_unvalid .li_cursor_after:after{
    background-color:#fc1520;
}
.li_touch{
    position: relative;
    top: -3px;
}
.btn_clear{
    position: absolute;
    top:0;
    right: 0;
    line-height: 80px;
    width: 25%;
    text-align: center;
    color:#0089f8;
}
.keyboard_frame{
    position: relative;
    color:#000000;
    background-color:#d1d5db;
}
.keyboard_frame .keyboard_keys{
    width:70%;
    text-align: center;
}
.keyboard_frame .keyboard_keys .li_bg{
    display: inline-block;
    width: 33%;
    height: 84px;
    text-align:center;
}
.keyboard_frame .keyboard_keys .li_bg .li_key{
    display: inline-block;
    background-color: #ffffff;
    width: 95%;
    margin-top:7px;
    line-height: 70px;
    border-radius: 5px;
    box-shadow: 0px 1px 2px gray;
}
.keyboard_frame .keyboard_btns{
    position: absolute;
    right: 0;
    top: 0;
    width: 30%;
    height: 100%;
}
.keyboard_frame .keyboard_btns .li_bg{
    width: 100%;
    height: 50%;
    padding: 7px;
}
.keyboard_frame .keyboard_btns .li_bg .li_btn{
    background-color: #acb3bd;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    box-shadow: 0px 1px 2px gray;
    position: relative;
}
.keyboard_frame .keyboard_btns .li_bg .li_btn span{
    position: absolute;
    right: 10px;
    bottom: 10px;
}
.li_disable{
    pointer-events: none;
    color: #a7a7a7;
}
</style>
