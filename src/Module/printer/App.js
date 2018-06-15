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
        let p3Checked = localStorage.getItem('p3Checked');
        console.log(p3Checked);
        this.state = {
            selected:localStorage.getItem('printer'),
            selected2:localStorage.getItem('printer2'),
            selected3:localStorage.getItem('printer3'),
            checked: (null == p3Checked || '' == p3Checked) ? false : true,
        }
        this.printers = ipcRenderer.sendSync('printers', 'main');
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(value) {
        localStorage.setItem('printer', value);
        this.setState({selected:value});
    }

    handleChange2(value) {
        localStorage.setItem('printer2', value);
        this.setState({selected:value});
    }
    handleChange3(value) {
        localStorage.setItem('printer3', value);
        this.setState({selected:value});
    }
    handleClick() {
        if (this.state.checked) {
            localStorage.setItem('p3Checked', '');
        } else {
            localStorage.setItem('p3Checked', 'true');
        }
        this.setState({checked:!this.state.checked});
    }

    render() {
        let printers = this.printers.map(obj => {return obj.name})
        ,   printers2 = this.printers.map(obj => {return obj.name});
        printers2.unshift('无');
        return (
            <div className='e-box' style={{marginTop:'20px'}}>
                &emsp;&emsp;&emsp;小票打印机：&emsp;<Select option={printers} selected={this.state.selected} onChange={this.handleChange}/>
                <br/>
                &emsp;水洗条码打印机：&emsp;<Select option={printers2} selected={this.state.selected2} onChange={this.handleChange2}/>
                <br/>
                不干胶条码打印机：&emsp;<Select option={printers2} selected={this.state.selected3} onChange={this.handleChange3}/>
                <p>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                    <input type='checkbox' onChange={this.handleClick} checked={this.state.checked ? 'checked' : ''}/>上挂时打印不干胶条码
                </p>
            </div>
        );
    }
}