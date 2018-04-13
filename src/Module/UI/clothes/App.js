/**
 * 选择衣物弹窗组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';
//  show:是否展示    title:标题文字    onCloseRequest:关闭弹窗    展示数据 data:api接口返回的items集合    onClick(index):选中选项点击
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {this.props.onClick(e.target.dataset.index)}

    render() {
        if (!this.props.show) return null;
        let options = this.props.data.map((obj, index) => 
            <div key={obj.id} data-index={index} onClick={this.handleClick}>
                <div data-index={index}>{obj.item_name}</div>
                <div data-index={index}>{obj.item_price}</div>
            </div>
        );
        return (
            <div className='clothes'>
                <div>{this.props.title}<i className="close13" onClick={this.props.onCloseRequest}></i></div>
                <div>{options}</div>
            </div>
        );
    }
}