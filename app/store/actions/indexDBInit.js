import store2 from '../'

var dbName = 'huiguChat',     // 数据库名
    daVer = 1,              // 数据库版本号
    db = ''               // 用于数据库对象

// 连接数据库
export function openDB(){
    var request = indexedDB.open(dbName, daVer);
    request.onsuccess = function(e){
        db = e.target.result;
        console.log('连接数据库成功');
        // // 数据库连接成功后渲染表格
        // vm.getData();
        store2.dispatch('searchData', {callback:(dbData)=>{
            store2.commit('updateSessions',dbData)
        },table:'Sessions'})
        store2.dispatch('searchData', {callback:(dbData)=>{
            store2.commit('updateUserInfo',dbData)
        },table:'Users'})
    }
    request.onerror = function(){
        console.log('连接数据库失败');
    }
    request.onupgradeneeded = function(e){
        db = e.target.result;
        // 如果不存在Session对象仓库则创建
        console.log('连接数据库并更新成功');
        if(!db.objectStoreNames.contains('Sessions')){
            let store=db.createObjectStore('Sessions',{keyPath: 'id'});
            store.createIndex('index','id',{unique:true}); 
        }
        if(!db.objectStoreNames.contains('Users')){
            let store=db.createObjectStore('Users',{keyPath: 'account'});
            store.createIndex('index','account',{unique:true}); 
        }
        if(!db.objectStoreNames.contains('Msgs')){
            let store=db.createObjectStore('Msgs',{keyPath: 'id',autoIncrement:true});
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
        var tx = db.transaction(table,'readwrite');
        var store = tx.objectStore(table);
        // if(!data[store.keyPath]) return
        var req = store.add(data);
        req.onsuccess = function(){
            console.log('成功保存id为'+this.result+'的数据');
        }
    }
}

/**
 * 删除单条数据
 * @param {int} id 要删除的数据主键
 */
export function deleteOneData(id){
    var tx = db.transaction('Sessions','readwrite');
    var store = tx.objectStore('Sessions');
    var req = store.delete(id);
    req.onsuccess = function(){
       
    }
}

/**
 * 检索全部数据
 * @param {function} callback 回调函数
 */
export function searchData(callback,table){
    var tx = db.transaction(table,'readonly');
    var store = tx.objectStore(table);
    var range = IDBKeyRange.lowerBound(1);
    var req = store.openCursor(range,'next');
    // 每次检索重新清空存放数据数组
    let dbData = []; 
    req.onsuccess = function(){
        var cursor = this.result;
        if(cursor){
            // 把检索到的值push到数组中
            dbData.push(cursor.value);
            cursor.continue();
        }else{
            // 数据检索完成后执行回调函数
            callback && callback(dbData);
        }
    }
}

function getDataByIndex(db,storeName){
    var transaction=db.transaction(storeName);
    var store=transaction.objectStore(storeName);
    var index = store.index("nameIndex");
    index.get('Byron').onsuccess=function(e){
        var student=e.target.result;
        console.log(student.id);
    }
}