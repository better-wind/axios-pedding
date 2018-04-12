import axios from 'axios';

// 重复请求拦截处理
let _fetchConf = {}
let CancelToken = axios.CancelToken
// 拦截当前条
let removeFetch = (config,fn)=>{
    let _url = config.url
    if(_fetchConf[_url]){
        if(fn) fn()
        else delete _fetchConf[_url]
    } else {
        if(fn) _fetchConf[_url] = true
    }
}
axios.interceptors.request.use( config =>{
    config.cancelToken = new CancelToken((c)=>{
        removeFetch(config,c)
    })
return config;
},
error => Promise.reject(error)
);

axios.interceptors.response.use( response => {
    removeFetch(response.config)
return response;
},
error=>Promise.reject(error)
);
// 拦截前一条
let removeFetch2 = (config,fn)=>{
    let _url = config.url
    if(_fetchConf[_url]){
        if(fn) _fetchConf[_url]()
        else  delete _fetchConf[_url]
    }
}
axios.interceptors.request.use( config =>{
    removeFetch2(config,true)
config.cancelToken = new CancelToken((c)=>{
        _fetchConf2[config.url] = c
    })
return config;
},
error => Promise.reject(error)
);

axios.interceptors.response.use( response => {
    removeFetch2(response.config)
return response;
},
error=>Promise.reject(error)
);
