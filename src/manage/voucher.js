/**
 * 代金券组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

export default class Voucher extends Component {
    constructor(props) {
        super(props);
        this.state = {count:'',amount:'',start:func.currentDate('date'),end:func.currentDate('date')};
        this.create = this.create.bind(this);
    }

    componentDidMount() {
        let date = func.currentDate('date');
        laydate.render({
            elem:this.input,
            value:date,min:date,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:value => this.setState({start:value})
        });
        laydate.render({
            elem:this.input2,
            value:date,min:date,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:value => this.setState({end:value})
        });
    }

    create() {
        let state = this.state;
        if (
            func.isSet(state.count) 
            && 
            func.isSet(state.amount)
            && 
            func.isSet(state.start)
            && 
            func.isSet(state.end)
        ) {
            this.props.changeView({element:'voucher_list'});
        }
    }

    render() {
        let props = this.props,
            state = this.state;
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'制作代金券'}]} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-voucher-row'>
                        <label className='label'>制作张数：</label>
                        <input 
                            type='text' 
                            className='input' 
                            placeholder='请填写整数' 
                            value={state.count}
                            onChange={e => {
                                    if (!isNaN(e.target.value)) {
                                        this.setState({count:Number(e.target.value)});
                                    }
                                }
                            }
                        />
                        <div className='postfix'>张</div>
                    </div>
                    <div className='ui-voucher-row'>
                        <label className='label'>代金券金额：</label>
                        <input 
                            type='text' 
                            className='input'
                            value={state.amount}
                            onChange={e => {
                                    if (!isNaN(e.target.value)) {
                                        this.setState({amount:e.target.value});
                                    }
                                }
                            }
                        />
                        <div className='postfix'>元</div>
                    </div>
                    <div className='ui-voucher-row'>
                        <label className='label'>开始使用日期：</label>
                        <input type='text' className='input' ref={input => this.input = input} readOnly/>
                    </div>
                    <div className='ui-voucher-row'>
                        <label className='label'>结束使用日期：</label>
                        <input type='text' className='input' ref={input => this.input2 = input} readOnly/>
                    </div>
                    <div className='ui-voucher-row'>
                        <label className='label'></label>
                        <input 
                            type='button' 
                            className='ui-btn ui-btn-confirm' 
                            value='一键生成'
                            onClick={this.create}
                        />
                    </div>
                </section>
            </div>
        );
    }
}