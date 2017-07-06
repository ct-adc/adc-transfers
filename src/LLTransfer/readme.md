# list-list穿梭框组件

## 使用

从npm安装`ct-adc-transfers`
```
npm install ct-adc-transfers
```
在代码中引用
```
import transfers from 'ct-adc-transfers';
var LLTransfer=transfers.LLTransfer;
Vue.component(LLTransfer.name,LLTransfer);
```
## 参数说明

参数|描述|类型|默认值
--- | --- | --- | --- |
dataSource | 原始数据 | Array | []
selectedItems | 已选择的列表(右边的数据) | Array | []
matchKey | 自动匹配输入时可被匹配的key | Array | ['Id']
showKey | 显示在单个列表项中的key，如果key有多个,组件采用'-'进行分割内容 | Array | ['Name']
leftListTitle | 左侧列表的title | String | '全部列表'
rightListTitle | 右侧列表中的title | String | '已选择列表'

## 事件说明

### change事件

当穿梭框的'向左'/'向右'被执行后触发该事件。
