/**
 * @author rubyisapm
 */
import Vue from 'vue';
import transfers from '../../../index';
Vue.component(transfers.LLTransfer.name, transfers.LLTransfer);
var list = [
    {Id: 1, Name: 'one'},
    {Id: 2, Name: 'two'},
    {Id: 3, Name: 'three'},
    {Id: 4, Name: 'four'},
    {Id: 5, Name: 'five'},
    {Id: 6, Name: 'six'},
    {Id: 7, Name: 'seven'},
    {Id: 8, Name: 'eight'},
    {Id: 9, Name: 'nine'},
    {Id: 10, Name: 'ten'},
    {Id: 11, Name: 'eleven'},
    {Id: 12, Name: 'twelve'},
    {Id: 13, Name: 'thirteen'}
];
new Vue({
    el: '#transfer',
    data: {
        list: list,
        showKey: ['Id', 'Name'],
        selectedItems: [
            {Id: 3, Name: 'three'},
            {Id: 4, Name: 'four'},
            {Id: 5, Name: 'five'}
        ],
        rightList: [],
        leftLoading: false,
        rightLoading: false
    },
    methods: {
        change (rightList) {
            this.rightList = JSON.stringify(rightList,null,4);
        },
        setList(){
            this.leftLoading = true;
            this.rightLoading = true;
            setTimeout(()=> {
                this.selectedItems = [
                    {Id: 3},
                    {Id: 4},
                    {Id: 5}
                ];
                this.rightLoading = false;
            }, 1000);

            setTimeout(()=> {
                this.list = list;
                this.leftLoading = false;
            }, 5000);
        }
    }
});