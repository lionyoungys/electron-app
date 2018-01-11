/**
 * 线上订单添加项目组件
 * @author yangyunlong
 */
import React from 'react';
import Crumb from '../UI/crumb/App';
import Clothes from '../UI/clothes/App';
import Question from '../UI/question/App';
import Item from '../UI/item/App';
import ItemInfo from '../UI/item_info/App';
import ItemCost from '../UI/item_cost/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category:[],
            item:[],
            index:0,
            clothesShow:false,
            clothes:[],
            type:null,
            tempData:[]
        };
        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleClothesClick = this.handleClothesClick.bind(this);
        this.colorConfirm = this.colorConfirm.bind(this);
        this.questionConfirm = this.questionConfirm.bind(this);
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
    colorConfirm(value, options) {
        console.log(value);
        console.log(options);
    }
    questionConfirm(value, options) {
        console.log(value);
        console.log(options);
    }

    render() {
        let state = this.state,
            title = (state.category.length > 0 ? state.category[state.index].value : null),
            data = (state.item.length > 0 ? state.item[state.index] : []),
            questionHandle = null === this.state.type ? null : this[this.state.type + 'Confirm'],
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
                    <div className='m-box oai-tab-box'>
                        <Item/>
                        <ItemInfo/>
                        <ItemCost/>
                    </div>
                    <div className='m-box' onClick={() => this.setState({type:'question'})}>question</div>
                    <div className='m-box' onClick={() => this.setState({type:'color'})}>color</div>
                </div>
                <Clothes
                    show={state.clothesShow}
                    title={title}
                    data={data}
                    onClick={this.handleClothesClick}
                    onCloseRequest={() => this.setState({clothesShow:false})}
                />
                <Question
                    type={this.state.type}
                    onCloseRequest={() => this.setState({type:null})}
                    onConfirmRequest={questionHandle}
                />
            </div>
        );
    }
}