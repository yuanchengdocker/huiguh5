import React from 'react'

class page2 extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            text: 'yuancheng2'
        }
    }

    render(){
        return (
            <div>{this.state.text}</div>
        )
    }
}

export default page2