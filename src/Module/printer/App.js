/**
 * 打印机设置组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React from 'react';
import Select from '../../Elem/Select'


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected:localStorage.getItem('printer')}
        this.printers = ipcRenderer.sendSync('printers', 'main');
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        localStorage.setItem('printer', value);
        this.setState({selected:value});
    }

    render() {
        let printers = this.printers.map(obj => {return obj.name});
        return (
            <div className='e-box' style={{marginTop:'20px'}}>
                请选择您所使用的打印机：&emsp;<Select option={printers} selected={this.state.selected} onChange={this.handleChange}/>
            </div>
        );
    }
}