import React from 'react'

class page1 extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            text: 'yuancheng'
        }
    }

    render(){
        return (
            <div>{this.state.text}</div>
        )
    }
}

export default page1