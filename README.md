## ct-adc-transfers

list-list穿梭框组件

## 组件示例图

![img](https://github.com/ct-adc/adc-transfers/tree/master/transfer.png)

## 在线demo

[在线demo](https://codepen.io/rubyisapm/pen/vmQRVa)

## 功能点

1. 从一个集合中选出子集合

## 使用

从npm安装ct-adc-transfers

```
npm install ct-adc-transfers --save
```
在代码中使用

```
import transfer from 'ct-adc-transfers';

Vue.component(transfer.name, transfer);

或

new Vue({
    el: '#app',
    components: {
        transfer
    }
})
```

## props

参数 | 说明 | 类型 | 默认值 | 可选值 | 描述 |
--- | --- | --- | --- | ---- | ---
dataSource | 原始数据 | Array | [] |  | 即数据集合
selectedItems | 已选择的列表(右边的数据) | Array | [] | | 没有时请传[]，有值的情况下每一项需和dataSource中的一致(key可以少，但matchKey必须要有)
matchKey | 自动匹配输入时可被匹配的key | Array | ['Id'] | | 
showKey | 数据列表中显示哪些key  | Array | ['Name'] | | 显示在单个列表项中的key，如果key有多个,组件采用'-'进行分割内容
leftLoading | 左侧列表加载状态 | Boolean | false | | 
rightLoading | 右侧列表加载状态 | Boolean | false | | 
button | 按钮的html内容 | Object(button.toLeft / button.toRight) | 左右箭头图标 | | 
leftListTitle | 左侧列表的title | String | '全部列表' | | 
rightListTitle | 右侧列表中的title | String | '已选择列表' | | 

## 事件

### 事件列表

事件名称 | 说明 | 回调参数 | 描述
change | 选中值发生改变 | 右边的列表数据 | 当穿梭框的'向左'/'向右'被执行后触发该事件。

## 更新日志

[更新日志](https://github.com/ct-adc/adc-transfers/blob/master/changeLog.md)

## 外部资源依赖列表

无

