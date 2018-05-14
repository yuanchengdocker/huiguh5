let wx = {
    isWx: !!wx,
    audio:{
        start: function(){
            wx.startRecord();
        },
        stop:function(){
            return new Promise((resolve,reject)=>{
                wx.stopRecord({
                    success: function (res) {
                        var localId = res.localId;
                        resolve(res)
                    }
                })
            })
        },
        cancel:function(){

        }
    }
}

export default wx