/**
 * 线下工艺加价编辑组件
 * @author yangyunlong
 */
import React, {Component} from 'react';


export default class OfflineEditor extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.param;
        //this.params = {order_id:'1875',id:'5170'}
        //console.log(this.params);
        
        this.redirectParam = 'id=' + this.params.order_id + '&from=offline'
        this.state = {
            code:this.params.code,
            hedging:this.params.hedging,
            comment:this.params.comment,
            special:this.params.special,
            takeDate:this.params.take_time,
            isShow:false,
            Date:[]
        };
        this.chooseDate = this.chooseDate.bind(this);
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
        this.done = this.done.bind(this);
    }

    chooseDate() {
        axios.post(api.U('getDateTime'),api.D({token:this.props.token}))
        .then(response => {
            this.setState({isShow:true,Date:response.data.data});
            console.log(response.data.data);
        });
    }

    done() {
        let state = this.state;
        if ('' !== state.code && '' !== state.takeDate) {
            axios.post(
                api.U('updateItemInfo'),
                api.D({
                    token:this.props.token,
                    item_id:this.params.id,
                    special:state.special,
                    special_comment:state.comment,
                    hedging:state.hedging,
                    take_time:state.take_time,
                    clean_number:state.code
                })
            )
            .then(response => {
                console.log(response.data);
                if (api.verify(response.data)) {
                    this.props.changeView({element:'offline_craft',param:this.redirectParam});
                }
            });
        }
    }

    onConfirmRequest(value) {this.setState({takeDate:value,isShow:false});}

    render() {
        let props = this.props,
            state = this.state;
        return (
            <div>
                <section className='ui-container'>
                    <div className='ui-oe-row'>衣物编码</div>
                    <div>
                       <input 
                           className='ui-oe-input' 
                           type='text' 
                           value={state.code}
                           placeholder='您可输入衣物编码/扫一扫'
                           onChange={e => this.setState({code:e.target.value})}
                       />
                    </div>
                    <div className='ui-oe-row'>特殊工艺加价</div>
                    <div style={{marginBottom:'21px'}}>
                        <label>特殊工艺加价：</label>
                        <div className='ui-oe-box'>
                            <input 
                                type='text' 
                                value={state.special} 
                                onChange={e => this.setState({special:e.target.value})}
                            />
                            <em>元</em>
                        </div>
                    </div>
                    <div>
                        <label>&emsp;&emsp;&emsp;&emsp;备注：</label>
                        <div className='ui-oe-box2'>
                            <textarea 
                                maxLength='20' 
                                value={state.comment} 
                                onChange={e => this.setState({comment:e.target.value})}
                            ></textarea>
                            <em className='ui-textarea-postfix'>{state.comment.length}/20</em>
                        </div>
                    </div>
                    <div className='ui-oe-row'>保值金额</div>
                    <div>
                        <div className='ui-oe-box'>
                            <input 
                                type='text' 
                                value={state.hedging} 
                                onChange={e => this.setState({hedging:e.target.value})}
                            />
                            <em>元</em>
                        </div>
                    </div>
                    <div className='ui-oe-row'>取衣时间</div>
                    <div>
                        <input 
                           className='ui-oe-input' 
                           type='text' 
                           value={state.takeDate}
                           style={{marginRight:'19px'}}
                           readOnly
                       />
                       <span 
                           style={{fontSize:'16px',color:'#09b1b0'}}
                           onClick={this.chooseDate}
                        >修改</span>
                    </div>
                    <div style={{marginTop:'41px'}}>
                        <input type='button' value='确定' className='ui-btn ui-btn-confirm ui-btn-large' onClick={this.done}/>
                    </div>
                </section>
                <LayerDate 
                    show={state.isShow} 
                    onCloseRequest={() => this.setState({isShow:false})}
                    Date={state.Date}
                    onConfirmRequest={this.onConfirmRequest}
                />
            </div>
        );
    }
}

class LayerDate extends Component{
    constructor(props) {
        super(props);
        this.state = {chooseTime:'',chooseDay:''};
        this.retClassName = this.retClassName.bind(this);
        this.setStatus = this.setStatus.bind(this);
    }

    setStatus(time, day, e) {
        if ('enabled' === e.target.className) {
            this.setState({chooseTime:time,chooseDay:day});
        }
    }

    retClassName(timeStr, timeArr, dayStr, type) {
        if ('undefined' === typeof type) type = false; 
        let state = this.state,
            className = type ? '可选' : 'enabled';
        if (-1 === timeStr.inArray(timeArr)) className = type ? '不可选' : 'forbidden';
        if (state.chooseTime == timeStr && state.chooseDay == dayStr) {
            className = type ? '已选' : 'choose'
        }
        return className;
    }
    render() {
        let props = this.props,
            state = this.state,
            d = props.Date,
            time = ['8:00~11:00', '11:00~14:00', '14:00~17:00', '17:00~20:00'],
            html = [];
        if (!props.show) return null; 
        if ('undefined' !== typeof d[0].time) {
            html = time.map(s => 
            <tr className='tr2' key={s}>
                <td className='td'>{s}</td>
                <td className={this.retClassName(s, d[0].time, d[0].day)} onClick={(e) => this.setStatus(s,d[0].day,e)}>
                    {this.retClassName(s, d[0].time, d[0].day, true)}
                </td>
                <td className={this.retClassName(s, d[1].time, d[1].day)} onClick={(e) => this.setStatus(s,d[1].day,e)}>
                    {this.retClassName(s, d[1].time, d[1].day, true)}
                </td>
                <td className={this.retClassName(s, d[2].time, d[2].day)} onClick={(e) => this.setStatus(s,d[2].day,e)}>
                    {this.retClassName(s, d[2].time, d[2].day, true)}
                </td>
                <td className={this.retClassName(s, d[3].time, d[3].day)} onClick={(e) => this.setStatus(s,d[3].day,e)}>
                    {this.retClassName(s, d[3].time, d[3].day, true)}
                </td>
                <td className={this.retClassName(s, d[4].time, d[4].day)} onClick={(e) => this.setStatus(s,d[4].day,e)}>
                    {this.retClassName(s, d[4].time, d[4].day, true)}
                </td>
                <td className={this.retClassName(s, d[5].time, d[5].day)} onClick={(e) => this.setStatus(s,d[5].day,e)}>
                    {this.retClassName(s, d[5].time, d[5].day, true)}
                </td>
                <td className={this.retClassName(s, d[6].time, d[6].day)} onClick={(e) => this.setStatus(s,d[6].day,e)}>
                    {this.retClassName(s, d[6].time, d[6].day, true)}
                </td>
            </tr>
            );
        }

        return (
            <div className='ui-fixed-bg'>
                <div className='ui-oe-date'>
                    <div className='ui-oe-title'>
                        <span>请选择取衣时间</span>
                        <img src='images/ui-date-close.png' onClick={props.onCloseRequest}/>
                    </div>
                    <div className='ui-oe-body'>
                        <table className='ui-oe-table'>
                            <thead>
                                <tr className='tr'>
                                    <td className='td'>时间段</td>
                                    <td>{d[0].day}</td>
                                    <td>{d[1].day}</td>
                                    <td>{d[2].day}</td>
                                    <td>{d[3].day}</td>
                                    <td>{d[4].day}</td>
                                    <td>{d[5].day}</td>
                                    <td>{d[6].day}</td>
                                </tr>
                            </thead>
                            <tbody>
                                {html}
                            </tbody>
                        </table>
                        <div style={{marginTop:'20px',width:'100%',textAlign:'center'}}>
                            <input type='button' className='ui-btn ui-btn-cancel ui-btn-middle' value='取消' onClick={props.onCloseRequest}/>
                            &emsp;&emsp;&emsp;
                            <input 
                                type='button' 
                                className='ui-btn ui-btn-confirm ui-btn-middle'
                                value='确认' onClick={() => props.onConfirmRequest(state.chooseDay + '  ' + state.chooseTime)}/>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}