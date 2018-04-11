/**
 * @author rubyisapm
 */
module.exports = {
    '/api/api1': {
        $params:['a1'],
        $method:'post',
        $contentType:'application/json',
        $specParams:{
            a1:1
        },
        $res:{
            data: 3
        }
    },
    '/api/api4': {
        $res:{
            data: 4
        }
    }
};
