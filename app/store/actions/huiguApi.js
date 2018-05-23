import axios from '../../service/service'

export function checkHaveBindDoctor({state, commit}){
    let doctorUserId = state.userInfos[state.sessionMap[state.currSessionId].to].id
    axios('post','haveBindDoctor',{doctorUserId:doctorUserId}).then((data)=>{
        commit('updateCurrDoctorBind',!data.data||data.data.bindState===2?false:true)
    })
}   