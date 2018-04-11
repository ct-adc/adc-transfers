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
                    <div class="pull-right">{{leftListTitle}}</div>
                </div>
                <div class="transfer-container-bottom">
                    <div class="loading" v-if="leftLoading"></div>
                    <template v-else>
                        <div class="transfer-container-autoC">
                            <input type="text" class="form-control" v-model="leftAutoCompleteInput"
                                   placeholder="请输入内容进行搜索">
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
                    </template>
                </div>

            </div>
        </div>
        <div class="col-sm-2 text-center buttons">
            <button type="button"
                    class="btn btn-default"
                    :class="{disabled:!toRightBtnStatus}"
                    :disabled="!toRightBtnStatus"
                    @click="toRight" style="margin-bottom:10px" v-html="button.toRight">
            </button>
            <button type="button"
                    class="btn btn-default"
                    :class="{disabled:!toLeftBtnStatus}"
                    :disabled="!toLeftBtnStatus"
                    @click="toLeft" v-html="button.toLeft">
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
                    <div class="pull-right">
                        {{rightListTitle}}
                    </div>
                </div>
                <div class="transfer-container-bottom">
                    <div class="loading" v-if="rightLoading" style="margin-top:-44px;height:254px;"></div>
                    <template v-else>
                        <div class="transfer-container-autoC">
                            <input type="text" class="form-control" v-model="rightAutoCompleteInput"
                                   placeholder="请输入内容进行搜索">
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
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const objEqual = (obj1, obj2)=>{
        for (const i in obj1) {
            if (obj1.hasOwnProperty(i) && JSON.stringify(obj2[i]) !== JSON.stringify(obj1[i])) {
                return false;
            }
        }
        return true;
    };

    export default {
        name: 'transfer',
        props: {
            dataSource: {
                //原始数据源
                type: Array,
                default() {
                    return [];
                }
            },
            selectedItems: {
                //右侧的数据列表
                type: Array,
                default() {
                    return [];
                }
            },
            matchKey: {
                //匹配的key，可以单个或多个key
                type: Array,
                default() {
                    return ['Id'];
                }
            },
            showKey: {
                //显示的key，可以单个或多个key
                type: Array,
                default() {
                    return ['Name'];
                }
            },
            leftLoading: {
                type: Boolean,
                default: false
            },
            rightLoading: {
                type: Boolean,
                default: false
            },
            button: {
                type: Object,
                default() {
                    return {
                        toLeft: '<span class="glyphicon glyphicon-chevron-left"></span>',
                        toRight: '<span class="glyphicon glyphicon-chevron-right"></span>'
                    };
                }
            },
            leftListTitle: {
                type: String,
                default: '全部列表'
            },
            rightListTitle: {
                type: String,
                default: '已选择列表'
            }
        },
        data() {
            return {
                leftAutoCompleteInput: '',
                rightAutoCompleteInput: '',
                leftList: [],
                rightList: [],
                leftAllChecked: false,
                rightAllChecked: false
            };
        },
        created() {
            this.initRightList();
            this.initLeftList();
        },
        computed: {
            matchedLeftList() {
                const that = this;

                if (that.leftAutoCompleteInput !== '') {
                    return that.leftList.filter(function(item) {
                        const matched = that.matchKey.filter(function(key) {
                            return (item[key] + '').indexOf(that.leftAutoCompleteInput) > -1;
                        });

                        return matched.length > 0;
                    });
                }
                return that.leftList;
            },
            leftMatchedCheckedItems() {
                const checked = this.matchedLeftList.filter(function(item) {
                    return item.checked;
                });

                this.leftAllChecked = checked.length > 0 && checked.length === this.matchedLeftList.length;
                return checked;
            },
            matchedRightList() {
                const that = this;

                if (that.rightAutoCompleteInput !== '') {
                    return that.rightList.filter(function(item) {
                        const matched = that.matchKey.filter(function(key) {
                            return (item[key] + '').indexOf(that.rightAutoCompleteInput) > -1;
                        });

                        return matched.length > 0;
                    });
                }
                return that.rightList;
            },
            rightMatchedCheckedItems() {
                const checked = this.matchedRightList.filter(function(item) {
                    return item.checked;
                });

                this.rightAllChecked = checked.length > 0 && checked.length === this.matchedRightList.length;
                return checked;
            },
            toRightBtnStatus() {
                return this.leftMatchedCheckedItems.length > 0;
            },
            toLeftBtnStatus() {
                return this.rightMatchedCheckedItems.length > 0;
            }
        },
        methods: {
            initRightList() {
                let selectedItems = JSON.parse(JSON.stringify(this.selectedItems));

                if (this.selectedItems.length > 0 && this.dataSource.length > 0) {
                    const isBroken = Object.keys(this.selectedItems[0]).length < Object.keys(this.dataSource[0]).length;

                    if (isBroken) {
                        selectedItems = this.selectedItems.map(item1 => {
                            const matched = this.dataSource.filter(item2 => {
                                //item1和item2中的每一个matchkey对应的值都相等(不匹配的matchkey为0)
                                return this.matchKey.filter(key => {
                                    return item1[key] !== item2[key];
                                }).length === 0;
                            });

                            return matched[0];
                        });
                    }
                    this.rightList = selectedItems;
                } else {
                    //当list为空数组时,右侧即使有数据也会变为空;当list有数据时才会置rightlist的状态
                    this.rightList = [];
                }
            },
            initLeftList() {
                //处理leftList和matchedRightList
                const that = this;
                const dataSource = this.dataSource;

                this.leftList = dataSource.filter(function(item1) {
                    const selected = that.rightList.filter(function(item2) {
                        return objEqual(item1, item2);
                    }).length > 0;

                    return !selected;
                });
            },
            toRight() {
                const that = this;
                const leftMatchedCheckedItems = JSON.parse(JSON.stringify(this.leftMatchedCheckedItems));

                leftMatchedCheckedItems.map(function(item) {
                    item.checked = false;
                });
                this.leftList = this.leftList.filter(function(item1) {
                    return that.leftMatchedCheckedItems.filter(function(item2) {
                        return objEqual(item1, item2);
                    }).length === 0;
                });

                this.rightList.unshift(...leftMatchedCheckedItems);
                this.leftAllChecked = false;
                this.rightAllChecked = false;
                this.$emit('change', JSON.parse(JSON.stringify(this.rightList)));
            },
            toLeft() {
                const that = this;
                const rightMatchedCheckedItems = JSON.parse(JSON.stringify(this.rightMatchedCheckedItems));

                rightMatchedCheckedItems.map(function(item) {
                    item.checked = false;
                });
                this.rightList = this.rightList.filter(function(item1) {
                    return that.rightMatchedCheckedItems.filter(function(item2) {
                        return objEqual(item1, item2);
                    }).length === 0;
                });
                this.leftList.unshift(...rightMatchedCheckedItems);
                this.rightAllChecked = false;
                this.leftAllChecked = false;
                this.$emit('change', JSON.parse(JSON.stringify(this.rightList)));
            },
            toggleLeft(event, index) {
                const clone = JSON.parse(JSON.stringify(this.leftList));

                clone[index].checked = event.target.tagName === 'INPUT' ? clone[index].checked : !clone[index].checked;
                this.leftList = [];
                this.leftList = clone;
            },
            toggleRight(event, index) {
                const clone = JSON.parse(JSON.stringify(this.rightList));

                clone[index].checked = event.target.tagName === 'INPUT' ? clone[index].checked : !clone[index].checked;
                this.rightList = [];
                this.rightList = clone;
            },
            listContent(item) {
                const showItems = [];

                this.showKey.map(function(key) {
                    showItems.push(item[key]);
                });
                return showItems.join('-');
            },
            getRightList() {
                return JSON.parse(JSON.stringify(this.rightList));
            },
            changeLeftAll(event) {
                const checked = event.target.checked;
                const matchedLeftList = JSON.parse(JSON.stringify(this.matchedLeftList));

                if (this.leftAutoCompleteInput !== '' && matchedLeftList.length > 0) {
                    // 匹配项为leftList的真子集且不为空集时，需要结合matchedLeftList处理数据
                    this.leftList = this.leftList.map(item => {
                        const isSameItem = matchedLeftList.filter(matchedItem => {
                            const allMatched = this.matchKey.filter(key => {
                                return item[key] !== matchedItem[key];
                            }).length === 0;

                            return allMatched;
                        }).length > 0;

                        if (isSameItem) {
                            item.checked = checked;
                        }
                        return item;
                    });
                } else if (this.leftAutoCompleteInput === '') {
                    // 匹配项和leftList相等时，无需结合matchedLeftList做处理
                    this.leftList = this.leftList.map(item => {
                        item.checked = checked;
                        return item;
                    });
                }
            },
            changeRightAll(event) {
                const checked = event.target.checked;
                const matchedRightList = JSON.parse(JSON.stringify(this.matchedRightList));

                if (this.rightAutoCompleteInput !== '' && matchedRightList.length > 0) {
                    // 匹配项为rightList的真子集且不为空集时，需要结合matchedRightList处理数据
                    this.rightList = this.rightList.map(item => {
                        const isSameItem = matchedRightList.filter(matchedItem => {
                            const allMatched = this.matchKey.filter(key => {
                                return item[key] !== matchedItem[key];
                            }).length === 0;

                            return allMatched;
                        }).length > 0;

                        if (isSameItem) {
                            item.checked = checked;
                        }
                        return item;
                    });
                } else if (this.rightAutoCompleteInput === '') {
                    // 匹配项和rightList相等时，无需结合matchedRightList做处理
                    this.rightList = this.rightList.map(item => {
                        item.checked = checked;
                        return item;
                    });
                }
            }
        },
        watch: {
            dataSource() {
                this.initRightList();
                this.initLeftList();
            },
            selectedItems() {
                this.initRightList();
                this.initLeftList();
            }
        }
    };
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

    .transfer-container-bottom {
        padding-top: 44px;
        height: 254px;
        position: relative;
    }

    .transfer-container-autoC {
        position: absolute;
        top: 0;
        left: 0;
        padding: 5px;
        height: 34px;
        width: 100%;
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

    .loading {
        margin-top: -44px;
        height: 254px;
    }
</style>
