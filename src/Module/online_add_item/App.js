/**
 * 线上订单添加项目组件
 * @author yangyunlong
 */
import React from 'react';
import Crumb from '../UI/crumb/App';
import Clothes from '../UI/clothes/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category:[],
            item:[],
            index:0,
            clothesShow:false,
            clothes:[]
        };
        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleClothesClick = this.handleClothesClick.bind(this);
        console.log(this.props.param.oid);
    }
    componentDidMount() {
        axios.post(api.U('take_piece'),api.D({token:this.props.token,oid:this.props.param.oid}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result,
                    len = result.length;
                console.log(result);
                for (let i = 0;i < len;++i) {
                    this.state.category.push({key:i,value:result[i].cate_name});
                    this.state.item.push(result[i].items);
                }
                this.setState({category:this.state.category,item:this.state.item});
            }
        });
    }

    handleTabClick(e) {this.setState({index:e.target.dataset.key,clothesShow:true})}
    handleClothesClick(index) {console.log(index)}

    render() {
        let state = this.state,
            title = (state.category.length > 0 ? state.category[state.index].value : null),
            data = (state.item.length > 0 ? state.item[state.index] : []),
            tabs = this.state.category.map(obj => 
            <span
                key={obj.key}
                data-key={obj.key}
                className='m-tab checked'
                onClick={this.handleTabClick}
            >{obj.value}</span>
        );
        return (
            <div>
                <Crumb data={[{key:0,value:'待收件',view:'online',param:{checked:'to_take'}},{key:1,value:'添加项目'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div>{tabs}</div>
                    <div className='m-box' onClick={() => this.setState({clothesShow:true})}>section one</div>
                    <div className='m-box'>section two</div>
                </div>
                <Clothes
                    show={state.clothesShow}
                    title={title}
                    data={data}
                    onClick={this.handleClothesClick}
                    onCloseRequest={() => this.setState({clothesShow:false})}
                />
            </div>
        );
    }
}