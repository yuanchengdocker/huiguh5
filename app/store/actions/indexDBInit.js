import store2 from '../'
import cookie from '../../utils/cookie'

var dbName = 'huiguChat',     // 数据库名
    daVer = 160,              // 数据库版本号
    db = '',               // 用于数据库对象
    pageSize = 20,
    IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange

// 连接数据库
export function openDB(callback){
    dbName = cookie.readLocal('patientAccid')
    if(!dbName){
        console.log('无历史登录记录，请重新登录', 'login')
        return
    }
    var request = indexedDB.open(dbName, daVer);
    // indexedDB.deleteDatabase(dbName)
    // return 
    request.onsuccess = function(e){
        db = e.target.result;
        console.time('indexdb')

        let promise1 = new Promise((resolve,reject)=>{
            searchData((dbData)=>{
                store2.commit('updateSessions',dbData)
                resolve()
            },'Sessions')
        })
        let promise2 = new Promise((resolve,reject)=>{
            searchData((dbData)=>{
                store2.commit('updateUserInfo',dbData)
                resolve()
            },'Users')
        })
        Promise.all([promise1,promise2]).then(()=>{
            callback&&callback()
        })
        
    }
    request.onerror = function(){
    }
    request.onupgradeneeded = function(e){
        db = e.target.result;

        if(db.objectStoreNames.contains("Users")){  
            db.deleteObjectStore("Users");  
        }

        // 如果不存在Session对象仓库则创建
        if(!db.objectStoreNames.contains('Sessions')){
            let store=db.createObjectStore('Sessions',{keyPath: 'id'});
            store.createIndex('index','id',{unique:true}); 
        }
       
        if(!db.objectStoreNames.contains('Users')){
            let store=db.createObjectStore('Users',{keyPath: 'userAccid'});
            store.createIndex('index','userAccid',{unique:true}); 
        }
        if(!db.objectStoreNames.contains('Msgs')){
            let store=db.createObjectStore('Msgs',{keyPath: 'id'});
            store.createIndex('index','sessionId',{unique:false}); 
        }
    }
}

/**
 * 保存数据
 * @param {Object} data 要保存到数据库的数据对象
 */
export function saveData(data,table){
    if(!data) return;
    if(Array.isArray(data)){
        data.map((item)=>{
            saveData(item,table)
        })
    }else{
        if(!db){
            openDB(()=>{
                saveDbData(data,table)
            })
        }else{
            saveDbData(data,table)
        }
    }
}
function saveDbData(data,table){
    var tx = db.transaction(table,'readwrite');
    var store = tx.objectStore(table);
    // if(!data[store.keyPath]) return
    var req = store.put(data);
    req.onsuccess = function(e){
    }
}

export function updateData(data,table){
    if(!data) return;
   
    var tx = db.transaction(table,'readwrite');
    var store = tx.objectStore(table);
    // if(!data[store.keyPath]) return
    var req = store.put(data);
    req.onsuccess = function(){
    }
}



/**
 * 删除单条数据
 * @param {int} id 要删除的数据主键
 */
export function deleteOneData(id,table,callback){
    var tx = db.transaction(table,'readwrite');
    var store = tx.objectStore(table);
    var req = store.delete(id);
    req.onsuccess = function(){
        callback&&callback()
    }
}

export function deleteDataByKey(key,table){
    //通过游标删除记录
    var store = db.transaction(table,'readwrite').objectStore(table);
    var index = store.index("index");
    var request=index.openCursor(key||'')
    request.onsuccess = function(e){
        var cursor = e.target.result,
            value,
            deleteRequest;
        if(cursor){
            if(cursor.key == key){
                deleteRequest = cursor.delete();//请求删除当前项
                deleteRequest.onerror = function(){
                };
                deleteRequest.onsuccess = function(){
                };
            }
            cursor.continue();
        }
    };
}

/**
 * 检索全部数据
 * @param {function} callback 回调函数
 */
export function searchData(callback,table){
    var tx = db.transaction(table,'readonly');
    var store = tx.objectStore(table);
    var request = store.getAll(); 
    request.onsuccess = function(e){
        callback&&callback(e.target.result)
    }
}

export function getDataByIndex(callback,storeName,id){
    if(db){
        getDBDataByIndex(callback,storeName,id)
    }else{
        openDB(()=>{
            getDBDataByIndex(callback,storeName,id)
        })
    }
}
function getDBDataByIndex(callback,storeName,id){
    var transaction=db.transaction(storeName,'readonly');
    var store=transaction.objectStore(storeName);
    var index = store.index("index");
    var request=index.openCursor(IDBKeyRange.only(id),'prev')
    let dbData = []; 
    let count = 0;
    let lastMsg = store2.state.currSessionLastMsg
    let lastTime = lastMsg?lastMsg.time:0
    request.onsuccess=function(e){
        var cursor=e.target.result;
        if(cursor && count < pageSize){
            if(!lastTime || cursor.value.time < lastTime){
                count++;
                dbData.push(cursor.value);
            }
            cursor.continue();
        }else{
            // 数据检索完成后执行回调函数
            callback && callback(dbData);
        }
    }
    request.onerror = function(e){
        debugger
        console.log(e)
    }
}