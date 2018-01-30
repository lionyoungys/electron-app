/**
 * 返流审核界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[]};
    }

    componentDidMount() {
        axios.post(api.U('go_back_check'),api.D({token:this.props.token}))
        .then(response => {
            api.v(response.data) && this.setState({data:response.data.result});
        });
    }
    render() {
        return (
            <div>
                <Crumb data={[{key:0,value:'返流审核'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                
                </div>
            </div>
        );
    }
}