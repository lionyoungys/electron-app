/**
 * 主界面弹出层组件组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import './static/api';
import './static/UI.css';
export class FeedBack extends Component {
    constructor(props) {
        super(props);
        this.state = {content:'',len:0};
        this.changeContent = this.changeContent.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    changeContent(e) {
        let value = e.target.value;
        this.setState({content:value,len:value.length});
    }
    onConfirm() {

    }

    render() {
        if (!this.props.show) return null;
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-feedback'>
                    <div className='ui-feedback-bg'></div>
                    <div className='ui-feedback-inputer'>
                        <textarea 
                            placeholder='意见反馈需小于100字' 
                            maxLength='100' 
                            value={this.state.content}
                            onChange={this.changeContent}
                        ></textarea>
                        <em 
                            className='ui-textarea-postfix' 
                            style={{right:'24px',bottom:'30px'}}
                        >{this.state.len}/100</em>
                    </div>
                    <div className='ui-feedback-btn-area'>
                        <input 
                            type='button' 
                            value='取消' 
                            className='ui-btn ui-btn-cancel ui-btn-large'
                            onClick={this.props.onCancelRequest}
                        />
                        &emsp;&emsp;&emsp;&emsp;
                        <input 
                            type='button' 
                            value='确认' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={this.onConfirm}
                        />
                    </div>
                </div>
            </section>
        );
    }
}