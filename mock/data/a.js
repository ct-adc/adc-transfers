/**
 * @author rubyisapm
 */
module.exports = {
    '/api/api1': {
        $params:['a1','a2','a3'],
        $res:{
            data: 1
        }
    },
    '/api/ConstList': {
        Status:false,
        Data:[
            {
                Id:1,
                Val:'常量1'
            },
            {
                Id:2,
                Val:'常量2'
            },{
                Id:3,
                Val:'常量3'
            }
        ]
    }
};