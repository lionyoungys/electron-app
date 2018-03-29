/**
 * 代金券列表组件
 * @author yangyunlong
 */
import React, {Component} from 'react';

export default class VoucherList extends Component{
    constructor(props) {
        super(props);
        this.list = this.props.param.voucherList.split('-');
    }

    componentDidMount() {new Clipboard(this.btn);}

    render() {
        let props = this.props,
            html = [],clipboardText = '',
            len = this.list.length;     
        for (let i = 0;i < len;++i) {
            html.push(<div className='row' key={i}>{this.list[i]}</div>);
            clipboardText += (this.list[i] + '\n');
        }
        return (
            <div>
                <section className='ui-container ui-voucher-list'>
                    <div>共生成<span className='ui-red'>{len}</span>张代金券</div>
                    <div>
                        {html}
                        <div className='row'>
                            <input 
                                type='button' 
                                value='一键复制' 
                                className='ui-btn ui-btn-confirm'
                                data-clipboard-text={clipboardText}
                                ref={btn => this.btn = btn}
                            />
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}