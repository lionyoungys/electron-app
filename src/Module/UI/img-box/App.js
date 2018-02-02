/**
 * 图片框组件
 * @author yangyunlong
 */
import React from 'react';
import Lightbox from 'react-image-lightbox';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false, 
            src:null,
            start:0,
            count:tool.isSet(this.props.count) && !isNaN(this.props.count) ? this.props.count : 3
        };
        this.handleClick = this.handleClick.bind(this);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
    }
    handleClick(e) {
        this.setState({show:true, src:e.target.dataset.src});
    }
    previous() {
        if (this.state.start > 0) this.setState({start:(this.state.start - 1)});
    }

    next() {
        if ((this.state.start + this.state.count) < this.props.images.length) this.setState({start:(this.state.start + 1)});
    }

    render() {
        let len = this.props.images.length,
            stop = this.state.count + this.state.start,
            images = [];
        for (let i = this.state.start;i < len;++i) {
            if (stop <= i) break;
            images.push(
                <img
                    src={this.props.images[i]}
                    key={this.props.images[i]}
                    data-src={this.props.images[i]}
                    onClick={this.handleClick}
                />
            );
        }
        return (
            <div className='img-box'>
                <span className={'previous' + (0 == this.state.start ? ' disabled' : '')} onClick={this.previous}></span>
                    {images}
                <span
                    className={'next' + ( (this.state.start + this.state.count) < len ? '' : ' disabled')}
                    onClick={this.next}
                ></span>
                {this.state.show && (<Lightbox onCloseRequest={() => this.setState({show:false})} mainSrc={this.state.src}/>)}
            </div>
        );
    }
}