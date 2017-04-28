import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery';
const Remarkable = require('remarkable');

class CommentList extends Component{
  render(){
    const commentNodes = this.props.data.map((comment)=>{
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>  
      )
    })
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    )
  }
}
class CommentForm extends Component{
  constructor(props) {
       super(props);
       this.state = {author:'',text:''};
       this.handleAuthorChange = this.handleAuthorChange.bind(this); 
       this.handleTextChange = this.handleTextChange.bind(this); 
       this.handleSubmit = this.handleSubmit.bind(this); 
  }
  handleAuthorChange(e){
    this.setState({author:e.target.value});
  }
  handleTextChange(e){
    this.setState({text:e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    let author = this.state.author.trim();
    let text = this.state.text.trim();
    if(!text||!author){
      return;
    }
    this.props.onCommentSubmit({author:author,text:text});
    this.setState({author:'',text:''});
  }
  render(){
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input 
        type="text" 
        placeholder="用户名" 
        value={this.state.author}
        onChange={this.handleAuthorChange}
        /> 
        <br/>
         <textarea
         onChange={this.handleTextChange}
          placeholder="说些什么...">{this.state.text}
          </textarea><br/>
        <input className="submit" 
        type="submit" value="吐槽" />
      </form>
    )
  }
}
class CommentBox extends Component{
  constructor(props) {
       super(props);
       this.state = {data:[]}
       this.commentsAjax = this.commentsAjax.bind(this); 
       this.handleCommentSubmit = this.handleCommentSubmit.bind(this); 
  }
  commentsAjax(){
      $.ajax({
        url:this.props.url,
        dataType:'json',
        cache:false,
        success:function(data){
          this.setState({data:data});
        }.bind(this),
        error:function(xhr,status,err){
          console.error(this.props.url,status,err.toString());
        }.bind(this)
      });
  } 
    handleCommentSubmit(comment){
      var comments = this.state.data;
      comment.id = Date.now();
      var newComments = comments.concat([comment]);
      this.setState({data:newComments});
      $.ajax({
        url:this.props.url,
        dataType:'json',
        type:'POST',
        data:comment,
        success:function(data){
          this.setState({data:comments});
        }.bind(this),
        error:function(xhr,status,err){
          console.error(this.props.url,status,err.toString());
        }.bind(this)
      });
    }
    componentDidMount(){
      this.commentsAjax();
      setInterval(this.commentsAjax,this.props.pollInterval);
    }
    render(){
      return(
        <div className="commentBox">
          <h1>Comments</h1>
          <CommentList data={this.state.data}/>
          <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
        </div>
          )
    }
}
class Comment extends Component{
    rawMarkup(){
      const md = new Remarkable()
      let rawMarkup = md.render(this.props.children.toString())
      return {__html:rawMarkup}
    }
    render(){
      return (
        <div className="comment">
          <h4 className="commentAuthor">{this.props.author}：</h4>
          <span dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>
      )
    }
}
ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('root')
);

