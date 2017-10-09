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
            let result = response.data;
            console.log(result);
        });
    }

    render() {
        let props = this.props;
        return (
            <div>
                <Crumbs  crumbs={this.crumbs} callback={props.changeView}/>
            </div>
        );
    }
}
export default Check;