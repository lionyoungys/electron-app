/**
 * 平台消息消息详情组件
 * @author yangyunlong
 */
import React from 'react';



export default class extends React.Component{
    constructor(props) {super(props)}
    
    render() {
        return (<webview src={this.props.param} style={{width:'602px',margin:'auto',height:'100%'}}></webview>);
    }
}