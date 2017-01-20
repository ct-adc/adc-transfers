<template>
    <div class="form-group autoComplete">
        <div class="col-lg-8 col-sm-8">
            <div class="dropdown">
                <input type="text" ref="input" class="form-control" v-model="input" @focus="focus"/>
                <template v-if="listVisible">
                    <ul class="dropdown-menu" v-show="matched.length>0">
                        <li v-for="item in matched"
                            @click="select(item)">
                            <a>
                            <span v-for="(key,index) in keys">
                                {{item[key]}}
                                <span v-if="index!=keys.length-1">|</span>
                            </span>
                            </a>
                        </li>
                    </ul>
                    <ul class="dropdown-menu" v-show="matched.length===0">
                        <li class="noResult">{{info}}</li>
                    </ul>
                </template>
            </div>
        </div>
    </div>
</template>
<script type="es6">
    export default{
        name: 'auto-complete',
        props: {
            allForEmpty: {
                type: Boolean,
                default: true
            },
            list: {
                type: [Array],
                default(){
                    return []
                }
            },
            keys: {
                type: Array,
                default(){
                    return ['Id', 'Name'];
                }
            },
            matchKeys: {
                type: Array,
                default(){
                    return ['Id', 'Name'];
                }
            },
            showKeys: {
                type: Array,
                default(){
                    return ['Id', 'Name'];
                }
            },
            value:{
                type:Object,
                default(){
                    return {};
                }
            }
        },
        data(){
            return {
                input: '',
                listVisible: false
            }
        },
        mounted(){
            this.input=this.selectedContent;
            window.addEventListener('click', this.clickHandler);
        },
        beforeDestroy(){
            window.removeEventListener('click',this.clickHandler);
        },
        computed: {
            matched(){
                var that = this;
                if (that.input != '') {
                    return that.list.filter(function (item) {
                        return that.matchKeys.some(function (key) {
                            return (item[key] + '').indexOf(that.input) > -1;
                        })
                    })
                } else if (that.allForEmpty) {
                    return that.list;
                } else {
                    return [];
                }
            },
            info(){
                if (this.matched.length !== 0) return;
                if (this.input === '' && !this.allForEmpty) {
                    return '请输入内容进行匹配！';
                } else {
                    return '没有匹配的内容！';
                }
            },
            selectedContent(){
                var content = [];
                var that=this;
                that.showKeys.map(function (key) {
                    content.push(that.value[key]);
                })
                return content.join('|');
            }
        },
        methods: {
            clickHandler(event){
                var that=this;
                if(that.listVisible){
                    if (event.target != that.$refs.input) {
                        that.listVisible = false;
                    }
                    if (that.input === '') {
                        that.$emit('select',{});
                    } else {
                        that.input = that.selectedContent;
                    }
                }
            },
            focus(){
                this.listVisible = true;
            },
            select(item){
                this.$emit('select',JSON.parse(JSON.stringify(item)));
                this.$nextTick(function(){
                    this.input = this.selectedContent;
                })

            },
            completeValue(){
                var that=this;
                var value=that.value;
                var valueKeysCount=Object.keys(value).length;
                var listIsNotEmpty=that.list.length>0;
                if(valueKeysCount>0 && listIsNotEmpty){
                    var simpleKeysCount=Object.keys(that.list[0]).length;
                    var valueIsBroken=listIsNotEmpty && simpleKeysCount>valueKeysCount;
                    if(valueIsBroken){
                        //当value相比list是不完整对象时，根据list修正这个对象
                        var targetItems=that.list.filter(function(item){
                            var keysInSelected=Object.keys(value);
                            var matchItems=keysInSelected.filter(function(i){
                                return value[i]===item[i];
                            })
                            return matchItems.length>0;
                        });
                        this.$emit('select',JSON.parse(JSON.stringify(targetItems[0])));
                        that.$nextTick(function(){
                            that.input=that.selectedContent;
                        })
                        return targetItems[0];
                    }
                }else{
                    return that.value;
                }
            }
        },
        watch:{
            list(){
                this.completeValue();
            },
            value(){
                this.completeValue();
            }
        }
    };
</script>
<style scoped>
    .autoComplete .dropdown-menu {
        width: 100%;
        max-height: 400px;
        overflow-y: scroll;
        display: block;
    }

    .autoComplete .dropdown-menu li {
        cursor: pointer;
    }

    .autoComplete .noResult {
        padding: 3px 20px;
    }
</style>