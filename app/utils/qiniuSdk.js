const qiniu = require('qiniu-js')
import axios from '../service/service'
import utils from './index';
import myAxios from 'axios'
//上传七牛文件
export function uploadFile(file) {
    return new Promise( async (resolve)=>{
        let data = await axios('post','getQiniuToken',{})
        let qiniuDownUrl = data.data.domainName+'/'
        qiniuUpload(file, data.data.authToken, resolve,qiniuDownUrl);
    })
}

function qiniuUpload(file, token, resolve, qiniuDownUrl){
	var config = {
			useCdnDomain : true,
			region : qiniu.region.z0,
			checkByMD5:true
		},putExtra = {
			  fname: "",
			  params: {},
			  mimeType: null
		};
		
    var key = file.name;

    var observable = qiniu.upload(file, null, token, putExtra, config);
    var observer = {
        next : function(res) {
            var percent = parseInt(res.total.percent); //上传百分比
        },
        error : function(err) {
            resolve()
        },
        complete : async function(data) { //上传结束
            let result = {}
            if(data && data.hash){
                result['qiniuDownUrl'] = qiniuDownUrl+data.hash
                result['cover'] = qiniuDownUrl+data.hash + '?vframe/jpg/offset/1'
            }
            let getDurationUrl = qiniuDownUrl+data.hash+'?avinfo'
            let data2=await myAxios.get(getDurationUrl)
            if(data2 && data2.data && data2.data.format){
                let duration = data2.data.format['duration']
                result['duration'] = duration
            }
            resolve(result)
        }
    };
    var subscription = observable.subscribe(observer);
    // subscription.unsubscribe() // 上传取消
} 