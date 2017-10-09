/**
 * 衣物检查
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';
class Check extends Component {
    constructor(props) {
        super(props);
        this.state = {data:[]};
        this.params = this.props.param.paramToObject();    //参数列表
        this.id = this.params.id;    //订单ID
        this.crumbs = [{text:'订单处理',key:0,e:'order'},{text:'衣物检查',key:1}];
    }
    componentDidMount() {
        axios.post(api.U('check'),api.data({token:this.props.token,id:this.id}))
        .then((response) => {
            let result = response.data.data;
            this.setState({data:result});
            console.log(result);
        });
    }

    render() {
        let props = this.props,
            state = this.state,
            html = state.data.map((obj) => 
                <Item 
                    key={obj.id}
                    changeView={props.changeView}
                    id={obj.id}
                    name={obj.g_name}
                    number={obj.number}
                    color={obj.color}
                    question={obj.item_note}
                    images={obj.img}
                />
            );
        return (
            <div>
                <Crumbs  crumbs={this.crumbs} callback={props.changeView}/>
                {html}
            </div>
        );
    }
}

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {images:this.props.images};
    }
    //componentDidMount() {this.setState({images:this.props.images});}
    render() {
        let props = this.props,
            state = this.state,
            colorValue = '' == props.color ? '颜色设置' : '编辑',
            questionValue = '' == props.question ? '问题描述' : '编辑',
            addNode = state.images.length >= 11 ? null : <div className='ui-image ui-image-add'></div>,
            images = state.images.map((obj) => 
                <div key={obj} className='ui-image' style={{backgroundImage:'url('+ api.host + obj +')'}}>
                    <em className='ui-image-delete'></em>
                </div>
            );
        return (
            <div className='ui-container'>
                <div className='ui-box-between ui-fieldset ui-check-title'>
                    <div>{props.name}</div><div>数量：&times;{props.number}</div>
                </div>
                <div className='ui-content' style={{flexWrap:'wrap'}}>
                    <div className='ui-image'>上传照片:</div>
                    {images}
                    {addNode}
                    <div className='ui-image-text'>
                        <div className='ui-image-text-bottom'>(上传不得超过11张)</div>
                    </div>
                </div>
                <div className='ui-content' style={{flexWrap:'wrap'}}>
                    <div className='ui-check-word'>颜色:</div>
                    <div className='ui-check-container'>{props.color}</div>
                    <input type='button' value={colorValue} className='ui-check-btn'/>
                </div>
                <div className='ui-content' style={{flexWrap:'wrap'}}>
                    <div className='ui-check-word'>问题描述:</div>
                    <div className='ui-check-container'>{props.question}</div>
                    <input type='button' value={questionValue} className='ui-check-btn'/>
                </div>
            </div>
        );
    }
}
export default Check;