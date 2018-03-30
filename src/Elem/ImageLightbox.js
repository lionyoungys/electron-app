/**
 * 图片光箱组件
 * @author yangyunlong
 */
import React from 'react';
import ElemHeader from './ElemHeader';

//images=[]
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {index:0};
        this.onClose = this.onClose.bind(this);
    }
    onClose() {
        'function' === typeof this.props.onClose && this.props.onClose();
        this.setState({index:0});
    }
    render() {
        if (!this.props.show || !this.props.images.length) return null;

        return (
            <div className='image-light-box'>
                <ElemHeader onClose={this.onClose}>照片展示</ElemHeader>
                <div className='image-light-box-body'>
                    <img src={this.props.images[this.state.index]}/>
                    <div
                        className='image-light-box-prev'
                        onClick={
                            () => this.state.index > 0 && this.setState({index:this.state.index - 1})
                        }
                    ></div>
                    <div
                        className='image-light-box-next'
                        onClick={
                            () => (this.props.images.length - 1 > this.state.index) && this.setState({index:this.state.index + 1})
                        }
                    ></div>
                    <div className='image-light-box-bottom'>
                        <div className='left'></div>
                        <div className='right'>（{this.state.index + 1}/{this.props.images.length}）</div>
                    </div>
                </div>
            </div>
        );
    }
}