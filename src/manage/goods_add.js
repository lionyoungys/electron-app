/**
 * 商品管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';

export default class GoodsAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {items:[],additional:[]};
        this.add = this.add.bind(this);
        this.confirm = this.confirm.bind(this);
    }
    
    componentDidMount() {
        axios.post(api.U('addGoods'),api.data({token:this.props.token}))
        .then((response) => {
            let result = response.data.data.item;
            this.setState({items:result});
            console.log(result);
        });
    }

    add(state,id) {
        if (state) {
            this.state.additional.push(id);
        } else {
            let index = id.inArray(this.state.additional);
            if (-1 !== index) {
                this.state.additional.splice(index,1);
            }
        }
        this.setState({additional:this.state.additional});
        console.log(this.state.additional);
    }

    confirm() {
        if (this.state.additional.length > 0) {
            axios.post(
                api.U('addGoods'),
                api.data({
                    token:this.props.token,
                    th_id:JSON.stringify(this.state.additional)
                })
            )
            .then((response) => {
                if (api.verify(response.data)) {
                    this.props.changeView({element:'goods'});
                }
            });
        }
    }

    render() {
        let props = this.props,
            state = this.state,
            html = state.items.map((obj) => 
                <List obj={obj} key={obj.id} callback={this.add}/>
            );
        return (
            <div>
                <Crumbs 
                    crumbs={[{key:0,text:'商品管理',e:'goods'},{key:1,text:'添加商品'}]} 
                    callback={props.changeView}
                />
                <section className='ui-container'>
                    <div className='ui-box-right' style={{paddingBottom:'12px'}}>
                        <input 
                            type='button' 
                            value='确定' 
                            className='ui-btn-tab'
                            onClick={this.confirm}
                        />
                    </div>
                    {html}
                </section>
            </div>
        );
    }
}

class List extends Component{
    constructor(props) {
        super(props);
        this.state = {isSpread:false};
        this.toggleState = this.toggleState.bind(this);    //切换展示样式
        this.toggleChecked = this.toggleChecked.bind(this);    //取消／选中操作
    }

    toggleState() {this.setState({isSpread:!this.state.isSpread});}
    toggleChecked(e) {
        let target = e.target;
        if (target.classList.contains('ui-checked')) {
            this.props.callback(false,target.dataset.id);
        } else {
            this.props.callback(true,target.dataset.id);
        }
        target.classList.toggle('ui-checked');
    }

    render() {
        let props = this.props,
            state = this.state,
            obj = props.obj,
            icon = state.isSpread ? 'ui-question-spread' : 'ui-question-shrink',
            display = {display:state.isSpread ? 'block' : 'none'},
            html = obj.goods.map((obj2) => 
                <div 
                    className='ui-checkbox ui-question-item' 
                    key={obj2.id} 
                    data-id={obj2.id}
                    onClick={this.toggleChecked}
                >{obj2.name}</div>
            );
        return (
            <div className='ui-question-container'>
                <div className='ui-question-title'>
                    <span>{obj.name}</span>
                    <em className={icon} onClick={this.toggleState}></em>
                </div>
                <div style={display}>
                    <div className='ui-question-item-container'>{html}</div>
                </div>
            </div>
        );
    }
}
