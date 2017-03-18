<template>
    <div class="clearfix">
        <div class="col-sm-5">
            <div class="panel panel-default transfer-container">
                <div class="panel-heading">
                    <input type="checkbox" v-model="leftAllChecked" @change="changeLeftAll">
                    <template v-if="leftMatchedCheckedItems.length>0">
                        {{leftMatchedCheckedItems.length}} / {{matchedLeftList.length}} 项
                    </template>
                    <template v-else>
                        {{matchedLeftList.length}} 项
                    </template>
                </div>
                <div class="transfer-container-autoC">
                    <input type="text" class="form-control" v-model="leftAutoCompleteInput" placeholder="请输入内容进行搜索">
                </div>
                <div class="list" :class="{'scroll-y': matchedLeftList.length > 7}">
                    <ul class="list-group">
                        <template v-for="(item,index) in matchedLeftList">
                            <li class="list-group-item" @click="toggleLeft($event,index)">
                                <input type="checkbox" v-model="item.checked" :key="index">
                                {{ listContent(item) }}
                            </li>
                        </template>
                        <li class="list-group-item text-muted" v-if="matchedLeftList.length === 0">暂无数据</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-sm-2 text-center buttons">
            <button type="button"
                    class="btn btn-default"
                    :class="{disabled:!toRightBtnStatus}"
                    :disabled="!toRightBtnStatus"
                    @click="toRight" style="margin-bottom:10px">向右
            </button>
            <button type="button"
                    class="btn btn-default"
                    :class="{disabled:!toLeftBtnStatus}"
                    :disabled="!toLeftBtnStatus"
                    @click="toLeft">向左
            </button>
        </div>
        <div class="col-sm-5 col-sm-offset-2">
            <div class="panel panel-default transfer-container">
                <div class="panel-heading">
                    <input type="checkbox" v-model="rightAllChecked" @change="changeRightAll">
                    <template v-if="rightMatchedCheckedItems.length>0">
                        {{rightMatchedCheckedItems.length}} / {{matchedRightList.length}} 项
                    </template>
                    <template v-else>
                        {{matchedRightList.length}} 项
                    </template>
                </div>
                <div class="transfer-container-autoC">
                    <input type="text" class="form-control" v-model="rightAutoCompleteInput" placeholder="请输入内容进行搜索">
                </div>
                <div class="list" :class="{'scroll-y': matchedRightList.length > 7}">
                    <ul class="list-group">
                        <template v-for="(item,index) in matchedRightList">
                            <li class="list-group-item" @click="toggleRight($event,index)">
                                <input type="checkbox" v-model="item.checked">
                                {{ listContent(item) }}
                            </li>
                        </template>
                        <li class="list-group-item text-muted" v-if="matchedRightList.length === 0">暂无数据</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="es6">
    import utility from 'ct-utility';
    function objEqual(obj1, obj2) {
        for (var i in obj1) {
            if (obj1.hasOwnProperty(i) && JSON.stringify(obj2[i]) !== JSON.stringify(obj1[i])) {
                return false;
            }
        }
        return true;
    }

    export default{
        name: 'transfer-ll',
        props: {
            dataSource: {
                //原始数据源
                type: Array,
                default(){
                    return [];
                }
            },
            selectedItems: {
                //右侧的数据列表
                type: Array,
                default(){
                    return [];
                }
            },
            matchKey: {
                //匹配的key，可以单个或多个key
                type: Array,
                default(){
                    return ['Id']
                }
            },
            showKey: {
                //显示的key，可以单个或多个key
                type: Array,
                default: ['Name']
            }
        },
        data(){
            return {
                leftAutoCompleteInput: '',
                rightAutoCompleteInput: '',
                leftList: [],
                rightList: [],
                leftAllChecked: false,
                rightAllChecked: false
            };
        },
        created(){
            this.getLeftRightList();
        },
        computed: {
            matchedLeftList(){
                var that = this;
                if (that.leftAutoCompleteInput != '') {
                    return that.leftList.filter(function (item) {
                        var matched = that.matchKey.filter(function (key) {
                            return (item[key] + '').indexOf(that.leftAutoCompleteInput) > -1;
                        });
                        return matched.length > 0;
                    })
                } else {
                    return that.leftList;
                }
            },
            leftMatchedCheckedItems(){
                var checked = this.matchedLeftList.filter(function (item) {
                    return item.checked;
                });
                this.leftAllChecked = checked.length > 0 && checked.length === this.matchedLeftList.length;
                return checked;
            },
            matchedRightList(){
                var that = this;
                if (that.rightAutoCompleteInput != '') {
                    return that.rightList.filter(function (item) {
                        var matched = that.matchKey.filter(function (key) {
                            return (item[key] + '').indexOf(that.rightAutoCompleteInput) > -1;
                        });
                        return matched.length > 0;
                    })
                } else {
                    return that.rightList;
                }
            },
            rightMatchedCheckedItems(){
                var checked = this.matchedRightList.filter(function (item) {
                    return item.checked;
                });
                this.rightAllChecked = checked.length > 0 && checked.length === this.matchedRightList.length;
                return checked;
            },
            toRightBtnStatus(){
                return this.leftMatchedCheckedItems.length > 0;
            },
            toLeftBtnStatus(){
                return this.rightMatchedCheckedItems.length > 0;
            }
        },
        methods: {
            getLeftRightList(){
                //处理leftList和matchedRightList
                var that = this;
                var dataSource = this.dataSource;
                this.leftList = dataSource.filter(function (item1) {
                    var selected;
                    that.selectedItems.map(function (item2) {
                        selected = objEqual(item1, item2);
                    })
                    return !selected;
                })
                this.rightList = JSON.parse(JSON.stringify(this.selectedItems));
            },
            toRight(){
                var that = this;
                var leftMatchedCheckedItems = JSON.parse(JSON.stringify(this.leftMatchedCheckedItems));
                leftMatchedCheckedItems.map(function (item) {
                    item.checked = false;
                });
                this.leftList = this.leftList.filter(function (item1) {
                    return that.leftMatchedCheckedItems.filter(function (item2) {
                                return objEqual(item1, item2);
                            }).length === 0;
                });
                this.rightList.unshift(...leftMatchedCheckedItems);
                this.leftAllChecked = false;
                this.rightAllChecked = false;
                this.$emit('change', JSON.parse(JSON.stringify(this.rightList)));
            },
            toLeft(){
                var that = this;
                var rightMatchedCheckedItems = JSON.parse(JSON.stringify(this.rightMatchedCheckedItems));
                rightMatchedCheckedItems.map(function (item) {
                    item.checked = false;
                });
                this.rightList = this.rightList.filter(function (item1) {
                    return that.rightMatchedCheckedItems.filter(function (item2) {
                                return objEqual(item1, item2);
                            }).length === 0;
                })
                this.leftList.unshift(...rightMatchedCheckedItems);
                this.rightAllChecked = false;
                this.leftAllChecked = false;
                this.$emit('change', JSON.parse(JSON.stringify(this.rightList)));
            },
            toggleLeft(event, index){
                var clone = JSON.parse(JSON.stringify(this.leftList));
                clone[index].checked = event.target.tagName === 'INPUT' ? clone[index].checked : !clone[index].checked;
                this.leftList = [];
                this.leftList = clone;
            },
            toggleRight(event, index){
                var clone = JSON.parse(JSON.stringify(this.rightList));
                clone[index].checked = event.target.tagName === 'INPUT' ? clone[index].checked : !clone[index].checked;
                this.rightList = [];
                this.rightList = clone;
            },
            listContent(item){
                var showItems = [];
                this.showKey.map(function (key) {
                    showItems.push(item[key]);
                })
                return showItems.join('-');
            },
            getRightList(){
                return JSON.parse(JSON.stringify(this.rightList));
            },
            changeLeftAll(event){
                var checked = event.target.checked;
                var matchedLeftList = JSON.parse(JSON.stringify(this.matchedLeftList));
                matchedLeftList.map(function (item, index, arr) {
                    arr[index].checked = checked;
                })
                var target=[];
                utility.base.extend(true,target,this.leftList, matchedLeftList);
                this.leftList=target;
            },
            changeRightAll(event){
                var checked = event.target.checked;
                var matchedRightList = JSON.parse(JSON.stringify(this.matchedRightList));
                matchedRightList.map(function (item, index, arr) {
                    arr[index].checked = checked;
                })
                var target=[];
                utility.base.extend(true,target,this.rightList, matchedRightList);
                this.rightList=target;
            }
        },
        watch: {
            dataSource(){
                this.getLeftRightList();
            },
            selectedItems(){
                this.getLeftRightList();
            }
        }
    }
</script>

<style scoped>
    .buttons {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .buttons .btn {
        display: block;
        margin: 0 auto;
    }

    .transfer-container {
        overflow: hidden;
    }

    .transfer-container-autoC {
        padding: 5px;
    }

    .scroll-y {
        overflow-y: scroll !important;
    }

    .list {
        overflow: hidden;
        height: 210px;
    }

    .list-group {
        padding: 0;
        margin: 0;
    }

    .list-group-item {
        margin: 0;
        padding: 0 15px 0 30px;
        line-height: 30px;
        border: none;
    }

    .list-group-item:hover {
        background: #f5f5f5;
        cursor: pointer;
    }

    .list-group-item input[type="checkbox"] {
        margin-left: -15px;
    }

    input[type="checkbox"] {
        vertical-align: text-top;
    }
</style>

