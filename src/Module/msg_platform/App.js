/**
 * 平台消息组件
 * @author yangyunlong
 */
import React from 'react';
import OptionBox from '../../Elem/OptionBox';
import './App.css';



export default class extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='msg_platform'>
                <OptionBox type='radio' checked={true}>单选选中</OptionBox>
                <OptionBox type='radio' checked={false}>单选未选中</OptionBox>
                <OptionBox type='checkbox' checked={true}>多选选中</OptionBox>
                <OptionBox type='checkbox' checked={false}>多选未选中</OptionBox>
            </div>
        );
    }
}