/**
 * 返流审核界面组件
 * @author yangyunlong
 */

import React from 'react';
import Checkbox from '../UI/checkbox/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.props.onRef(this);
        this.state = {data:[], checked:[]};
        this.query = this.query.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.query();
    }
    query() {
        axios.post(api.U('go_back_check'),api.D({token:this.props.token}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result});
        });
    }
    handleClick(value, checked) {
        if (checked) {
            let index = value.id.inObjectArray(this.state.checked, 'id');
            -1 !== index && this.state.checked.splice(index, 1);
        } else {
            this.state.checked.push(value);
        }
        this.setState({checked:this.state.checked});
    }
    submit(e) {
        let len = this.state.checked.length,
            type = e.target.dataset.type;
        if (len < 1) return alert('请选择项目');
        for (let i = 0;i < len;++i) {
            axios.post(
                api.U('go_back_submit'),
                api.D({
                    token:this.props.token,
                    itemid:this.state.checked[i].id,
                    type:type,
                    back_state:this.state.checked[i].state
                })
            )
            .then(response =>{
                if (api.V(response.data)) {
                    let index = this.state.checked[i].id.inObjectArray(this.state.checked, 'id');
                    if (-1 !== index) {
                        this.state.checked.splice(index, 1);
                        this.setState({checked:this.state.checked});
                    }
                    this.query();
                } else {
                    alert(response.data.msg);
                }
            });
        }
    }
    render() {
        let html = this.state.data.map( (obj, index) => 
            <DataRender data={obj} key={obj.id} checked={this.state.checked} onClick={this.handleClick}/>
        );
        return (
            <div>
                <div className='m-container'>
                {html}
                <button className='m-btn confirm middle' type='button' onClick={this.submit} data-type='2'>打回</button>
                &emsp;
                <button className='m-btn confirm middle' type='button' onClick={this.submit} data-type='1'>同意</button>
                </div>
            </div>
        );
    }
}

class DataRender extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data = this.props.data,
            images = data.back_img.map(obj => 
                <img src={obj} key={obj}/>
            );
        return (
            <div className='go-back-check'>
                <div>
                    <Checkbox
                        value={{id:data.id,state:data.back_state}}
                        onClick={this.props.onClick}
                        checked={-1 !== data.id.inObjectArray(this.props.checked, 'id')}
                    >{data.item_name}</Checkbox>
                    <span>编码:{data.clean_sn}</span>
                </div>
                <div><span>图片展示：</span>{images}</div>
                <div><span>文字描述：</span>{data.back_content}</div>
                <div><span>是否正常返流：</span>{1 == data.is_back ? '是' : '否'}</div>
                <div><span>返流步骤：</span>{data.back_name}</div>
            </div>
        );
    }
}