/**
 * 后台首页界面组件
 * @author yangyunlong
 */

import React from 'react';
import {AddMember, UpdateOrCharge} from '../UI/member-toast/App';
import './App.css';
const list = [
    {key:0,value:'收件',view:'take',style:'index-take',auth:1},
    //{key:1,value:'入厂',view:'in_factory',style:'index-in_factory',auth:8},
    {key:2,value:'清洗',view:'clean',style:'index-clean',auth:2},
    {key:3,value:'烘干',view:'dry',style:'index-dry',auth:50},
    {key:4,value:'熨烫',view:'ironing',style:'index-ironing',auth:51},
    {key:5,value:'质检',view:'check',style:'index-check',auth:52},
    {key:6,value:'上挂',view:'put_on',style:'index-put_on',auth:3},
    //{key:7,value:'出厂',view:'out_of_factory',style:'index-out_of_factory',auth:9},
    {key:8,value:'取衣',view:'take_off',style:'index-take_off',auth:4},
    {key:9,value:'返流审核',view:'go_back_check',style:'index-go_back_check',auth:7},
    {key:10,value:'新建会员',style:'index-add_member',auth:6},
    {key:11,value:'会员充值',style:'index-recharge',auth:6},
];



export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentData:[],previousData:[],otherShow:false,addMemberShow:false, auth: []};
        this.handleToast = this.handleToast.bind(this);
    }
    componentDidMount() {
        axios.post(api.U('msg_count'),api.D({token:this.props.token}))
        .then(response => {
            if (api.V(response.data)) {
                let auth = response.data.result.might,
                    len = auth.length;
                for (let i =0;i < len;++i) {
                    1 == auth[i].state && this.state.auth.push(auth[i].module);
                }
                this.setState({auth:this.state.auth});
            }
        });
    }

    handleToast(e) {
        if (10 == e.target.dataset.key) {
            this.setState({addMemberShow:true});
        } else {
            this.setState({otherShow:true});
        }
    }

    render() {
        let len = list.length, topLen = len - 2, top = [], bottom = [];
        for (let i = 0;i < topLen;++i) {
            top.push(
                <div 
                    className={list[i].style + (-1 !== list[i].auth.inArray(this.state.auth) ? '' : ' disabled')}
                    onClick={-1 !== list[i].auth.inArray(this.state.auth) ? this.props.changeView : null}
                    key={list[i].key}
                    data-view={list[i].view}
                >{list[i].value}</div>
            );
        }

        for (let i = topLen;i < len;++i) {
            bottom.push(
                <div 
                    className={list[i].style + (-1 !== list[i].auth.inArray(this.state.auth) ? '' : ' disabled')}
                    key={list[i].key}
                    data-key={list[i].key}
                    onClick={-1 !== list[i].auth.inArray(this.state.auth) ? this.handleToast : null}
                >{list[i].value}</div>
            );
        }

    	return (
    		<div>
                <div className='index'>{top}</div>
                <div className='index'></div>
	    		<div className='index'>{bottom}</div>
                <AddMember 
                    show={this.state.addMemberShow} 
                    token={this.props.token}
                    onClose={() => this.setState({addMemberShow:false})}
                    changeView={this.props.changeView}
                />
                <UpdateOrCharge 
                    show={this.state.otherShow} 
                    token={this.props.token}
                    onCancelRequest={() => this.setState({otherShow:false})}
                    type='1'
                    changeView={this.props.changeView}
                />
	        </div>
    	)
   }
}
