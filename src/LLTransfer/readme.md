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
dataSource | 按钮文字 | String | '导入文件'
selectedItems | 上传接口地址 | String | ''
matchKey | 可以接受的文件后缀，以‘,’隔开 如 jpg,png,gif | String | ''
showKey | 可以接受的文件大小(单位为B) | Number | undefined


## 事件说明

