<template>
    <div class="row">
        <div class="col-sm-3">
            <div class="panel panel-default transfer-container">
                <div class="panel-heading">
                    <input type="checkbox" v-model="leftAllChecked"/>
                    <template>
                        <span>{{leftCheckedCount}}</span> items
                    </template>
                </div>
                <div class="transfer-container-autoC">
                    <input type="text"
                           class="form-control"
                           placeholder="请输入内容进行搜索"
                           v-model="leftAutoCompleteInput"/>
                </div>
                <div class="list">
                    <tree :data="matchedLeftList"
                          show-checkbox
                          default-expand-all
                          :node-key="nodeKey"
                          ref="leftTree"
                          @check-change="leftCheck"
                          :filter-node-method="filterNodeMethod">
                    </tree>
                </div>
            </div>
        </div>
        <div class="col-sm-1">
            <div class="buttons">
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
        </div>
        <div class="col-sm-3">
            <div class="panel panel-default transfer-container">
                <div class="panel-heading">
                    <input type="checkbox" v-model="rightAllChecked"/>
                    <span>{{rightCheckedCount}}</span> items
                </div>
                <div class="transfer-container-autoC">
                    <input type="text"
                           class="form-control"
                           placeholder="请输入内容进行搜索"
                           v-model="rightAutoCompleteInput"/>
                </div>
                <div class="list">
                    <tree :data="matchedRightList"
                          :node-key="nodeKey"
                          show-checkbox
                          default-expand-all
                          ref="rightTree"
                          :filter-node-method="filterNodeMethod"
                          @check-change="rightCheck">
                    </tree>
                </div>
            </div>
        </div>
    </div>


</template>


<script type="es6">
    import Tree from './tree';

    function isEmpty(obj) {
        for (var i in obj) {
            return false;
        }
        return true;
    }

    function treeFilter(tree, filter) {
        var children = tree.children;
        var newTree = JSON.parse(JSON.stringify(tree));
        if (typeof  children !== 'undefined' && children.length > 0) {
            var filteredChildren = children.filter(function (child) {
                return !isEmpty(treeFilter(child, filter));
            });
            if (filteredChildren.length > 0) {
                newTree.children = filteredChildren;
                return newTree;
            } else if (filter(tree)) {
                return newTree;
            } else if (!filter(tree)) {
                return {};
            }

        } else if (!filter(tree)) {
            return {};
        } else if (!filter(tree)) {
            return newTree;
        }
    }

    function getAllNodes(tree) {
        var keys = [];
        if (typeof tree.children !== 'undefined' && tree.children.length > 0) {
            tree.children.map(function (item) {
                keys = keys.concat(getAllNodes(item));
            })
            keys.push({key: tree.label, isLeaf: false});
        } else {
            keys.push({key: tree.label, isLeaf: true});
        }
        return keys;
    }

    function getAllLeaves(tree) {
        var allNodes = getAllNodes(tree);
        var leaves=allNodes.filter(function (item) {
            return item.isLeaf;
        })
        return leaves.map(function(item){
            return item.key;
        })
    }

    function getAllKeys(tree){
        var allNodes=getAllNodes(tree);
        return allNodes.map(function(item){
            return item.key;
        })
    }


    export default{
        name: 'transfer-tt',
        components: {
            Tree
        },
        props: {
            dataSource: {
                type: Array,
                default(){
                    return [];
                }
            },
            selectedData: {
                type: Array,
                default(){
                    return [];
                }
            },
            nodeKey: {
                type: String,
                default: 'label'
            },
            filterNodeMethod: {
                type: Function,
                default: function (value, data, node) {
                    if (value) {
                        return node.checked;
                    } else {
                        return !node.checked;
                    }
                }
            }
        },
        data() {
            return {
                rightAutoCompleteInput: '',
                leftAutoCompleteInput: '',
                leftList: [],
                rightList: [],
                toLeftBtnStatus: false,
                toRightBtnStatus: false,
                leftCheckedKeys: [],
                rightCheckedKeys: [],
                leftCheckedCount: 0,
                rightCheckedCount: 0,
                leftAllChecked: false,
                rightAllChecked: false
            }
        },
        computed: {
            matchedLeftList(){
                var leftAutoCompleteInput = this.leftAutoCompleteInput;
                if (leftAutoCompleteInput === '') {
                    return this.leftList;
                } else {
                    var matchedList = this.leftList.map(function (item) {
                        return treeFilter(item, function (val) {
                            return val.label.indexOf(leftAutoCompleteInput) > -1;
                        });
                    });
                    matchedList = matchedList.filter(function (item) {
                        return !isEmpty(item);
                    })
                    return matchedList;
                }
            },
            matchedRightList(){
                var rightAutoCompleteInput = this.rightAutoCompleteInput;
                if (rightAutoCompleteInput === '') {
                    return this.rightList;
                } else {
                    var matchedList = this.rightList.map(function (item) {
                        return treeFilter(item, function (val) {
                            return val.label.indexOf(rightAutoCompleteInput) > -1;
                        });
                    });
                    matchedList = matchedList.filter(function (item) {
                        return !isEmpty(item);
                    })
                    return matchedList;
                }
            }
        },
        mounted(){
            this.getLeftAndRightList();
        },
        methods: {
            getLeftAndRightList(){
                this.leftList = JSON.parse(JSON.stringify(this.dataSource));
                this.rightList = JSON.parse(JSON.stringify(this.dataSource));
                this.$nextTick(function () {
                    this.$refs.rightTree.setCheckedKeys([]);
                    this.$refs.rightTree.filter(true);
                })
            },
            toLeft(){
                var checkedKeys = JSON.parse(JSON.stringify(this.$refs.rightTree.getCheckedKeys()));
                this.leftCheckedKeys = this.leftCheckedKeys.filter(function (item) {
                    return checkedKeys.indexOf(item) === -1;
                });
                this.rightCheckedKeys = this.rightCheckedKeys.filter(function (item) {
                    return checkedKeys.indexOf(item) === -1;
                })
                this.setListStatus();
            },
            toRight(){
                var checkedKeys = JSON.parse(JSON.stringify(this.$refs.leftTree.getCheckedKeys()));
                this.rightCheckedKeys = checkedKeys.concat(this.rightCheckedKeys);
                this.leftCheckedKeys = checkedKeys.concat(this.leftCheckedKeys);
                this.setListStatus();
            },
            leftCheck(){
                var checked = JSON.parse(JSON.stringify(this.$refs.leftTree.getCheckedNodes(true)));
                this.leftCheckedCount = checked.length;
                this.toRightBtnStatus = checked.length > 0;
            },
            rightCheck(){
                var checked = JSON.parse(JSON.stringify(this.$refs.rightTree.getCheckedNodes(true)));
                this.rightCheckedCount = checked.length;
                this.toLeftBtnStatus = checked.length > 0;
            },
            getSelectedKeys(){
                return this.$refs.rightTree.getCheckedKeys();
            },
            getSelectedNodes(){
                return this.$refs.rightTree.getCheckedNodes();
            },
            setListStatus(){
                this.$refs.leftTree.setCheckedKeys(this.leftCheckedKeys);
                this.$refs.rightTree.setCheckedKeys(this.rightCheckedKeys);
                this.$refs.leftTree.filter(false);
                this.$refs.rightTree.filter(true);
                this.$refs.rightTree.setCheckedKeys([]);
                this.$refs.leftTree.setCheckedKeys([]);
                this.toLeftBtnStatus = false;
                this.toRightBtnStatus = false;
                this.leftAllChecked = false;
                this.rightAllChecked = false;
            }

        },
        watch: {
            matchedRightList(){
                this.$refs.rightTree.setCheckedKeys(this.rightCheckedKeys);
                this.$nextTick(function () {
                    this.$refs.rightTree.filter(true);
                })
            },
            matchedLeftList(){
                var checked = this.$refs.leftTree.getCheckedKeys();
                this.$refs.leftTree.setCheckedKeys(this.leftCheckedKeys);
                this.$nextTick(function () {
                    this.$refs.leftTree.filter(false);
                    this.$refs.leftTree.setCheckedKeys(checked);
                })
            },
            leftAllChecked(checked){
                if (checked) {
                    var allKeys = [];
                    this.matchedLeftList.map(function (tree) {
                        allKeys = allKeys.concat(getAllKeys(tree));
                    })
                    this.$refs.leftTree.setCheckedKeys(allKeys);
                } else {
                    this.$refs.leftTree.setCheckedKeys(this.leftCheckedKeys);
                }

            },
            rightAllChecked(checked){
                if (checked) {
                    var allKeys = [];
                    this.matchedRightList.map(function (tree) {
                        allKeys = allKeys.concat(getAllKeys(tree));
                    })
                    this.$refs.rightTree.setCheckedKeys(allKeys);
                } else {
                    this.$refs.rightTree.setCheckedKeys([]);
                }
            }
        }
    }
</script>

<style scoped>

    .row {
        height: 300px;
        width: 900px;
    }

    .row .col-sm-1 {
        height: 100%;
    }

    .buttons {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .transfer-container {
        height: 300px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .transfer-container-autoC {
        padding: 5px;
    }

    .list {
        overflow: hidden;
        overflow-y: scroll;
    }
</style>