/**
 * 添加项目组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../api';
import Crumbs, {Tabs,Math} from '../static/UI';
class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {data:[], tabs:[], index:0, items:[], isShow:false};
        this.toggleView = this.toggleView.bind(this);
    }
	    componentDidMount() {
	    	let token = this.props.token;
	    	
	    	axios.post(api.U('getItems'),api.data({token:token})).then((response) => {
	    		
	    		console.log(response);
	    		let cloth = response.data.result,
	    		    len = cloth.length;
	    		for (let i = 0;i < len;++i) {
	    			this.state.tabs.push({key:i,text:cloth[i].cate_name});
	    			this.state.items.push(cloth[i].items);
	    		}
	    		this.setState({data:cloth,tabs:this.state.tabs,items:this.state.items})
	    	})
	    //设置弹框初始状态
	    }
	    toggleView(e) {
	    	this.setState({index:e.target.dataset.key,isShow:true});
	    	console.log(this.state.items[e.target.dataset.key]);
	    }
	    
        render() {
        let html = null;
           if (this.state.items.length > 0) {
           	  html = this.state.items[this.state.index].map(value =>            	  	           	  	    
             	  	    <p key={value.id}>{value.item_name}<b>{value.item_price}</b></p>
           	  )          	  
           }
        	return ( 
        	<div >       	    
        	    <div show={this.state.isShow} className='fixed-cloth' style={{display:(this.props.show ? 'block' : 'none')}}>
        	        <span></span>
        	        {html}
             	</div>
        		<div>         		    
        		    <Crumbs crumbs={[{key:0,e:'take',text:'收衣'},{key:1,text:'添加项目'}]} callback={this.props.changeView}/>
        		    <div className='addClotn'>
        		        <Tabs tabs={this.state.tabs} choose={this.state.index} callback={this.toggleView}/>
        		    </div>
        		  
        		   <div className='cloth'>
        		      <span>衣物</span>
        		      <p><em>名称</em><input type='text'/></p>
        		      <p><em>取衣时间</em><input type='text'/></p>
        		   </div>  
        		   <div className='space'>
        		      <span>特性</span>
        		      <p><em>颜色</em><input type='text'/></p>
        		      <p><em>瑕疵</em><input type='text'/></p>
        		      <p><em>洗后预估</em><input type='text'/></p>
        		   </div>
        		   <div className='space'>
        		      <span>服务设定</span>
        		      <p><em>保值金额</em><input />元</p>
        		      <p><em>工艺加价</em><input />元</p>
        		      <p><em>加价备注</em><input /></p>
        		   </div>
        		   <div className='list_odd'>
		        		    <div className='cothlist'>
		        		          <span>名称</span>
		        		          <span>价格</span>
		        		          <span>保值清洗费</span>
		        		          <span>工艺加价</span>
		        		          <span>操作</span>
		        		    </div>
		        		    <div className='cloth-name'>
	        		          <span></span>
	        		          <span></span>
	        		          <span></span>
	        		          <span></span>
	        		          <button>删除</button>
		        		    </div>
        		   </div>
        		   <div className='money'><span>共<a>0</a>件</span>总价<a>0.00</a></div>
        		   <div className='result-money'>
        		      <span>取衣付款</span>
        		      <span>立即付款</span>
        		   </div>
        		</div>
            </div>
        	)
        }
}
export default Item;