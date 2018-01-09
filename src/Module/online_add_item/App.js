/**
 * 线上订单添加项目组件
 * @author yangyunlong
 */
import React from 'react';
import Crumb from '../UI/crumb/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {category:[],item:[]};
        console.log(this.props.param.oid);
    }
    componentDidMount() {
        axios.post(api.U('take_piece'),api.D({token:this.props.token,oid:this.props.param.oid}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result,
                    len = result.length;
                for (let i = 0;i < len;++i) {
                    this.state.category.push({key:i,value:result[i].cate_name});
                    this.state.item.push(result[i].items);
                }
                this.setState({category:this.state.category,item:this.state.items});
            }
        });
    }

    render() {
        let tabs = this.state.category.map(obj => 
            <span
                key={obj.key}
                data-key={obj.key}
                className='m-tab checked'
            >{obj.value}</span>
        );
        return (
            <div>
                <Crumb data={[{key:0,value:'待收件',view:'online',param:{checked:'ordering'}},{key:1,value:'添加项目'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div>{tabs}</div>
                    <div className='m-box'>section one</div>
                    <div className='m-box'>section two</div>
                </div>
            </div>
        );
    }
}