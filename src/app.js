import React from 'react';
import ReactDOM from 'react-dom';
var myStyle = {
  color:'red'
};
class MyDom extends React.Component 
{
    constructor(props) {
        super(props);
        this.state = {date:new Date(),value:''};
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleClick(e) {
        console.log(e);
    }
    handleChange(e) {
      console.log(e);
      this.setState({value:e.target.value.toUpperCase()});
    }
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
    conponentWillUnmount() {
      clearInterval(this.timerID);
    }
    tick () {
      this.setState({date:new Date()});
    }
    render() {
      var numbers = [1,2,3,4,5,6,7,8,9];
      var listItems = numbers.map((number,index) => <div key={index}>{number}</div>);
      return (
      <h1 style = {myStyle}>
        Hello, world!{this.props.name}
        <span className="ts">{this.props.number}</span>
        <div onClick={this.handleClick}>现在时间{this.state.date.toLocaleTimeString()}</div>
        {listItems}
        <input type="text" value={this.state.value} onChange={this.handleChange}/>
        </h1>);
    }
}

ReactDOM.render(
  <MyDom name="yyl杨云龙" number="2332332"/>,
  document.getElementById('root')
);