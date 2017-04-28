## React+Node.js实现实时评论组件

## 组件结构
- CommentBox
 - ComementList
  - Comment
 - CommentForm

## 运行机制
CommentForm负责提交用户评论数据
react内部引用jquery的$.ajax方法发送请求评论数据
每隔2秒请求一次服务器，实现实时更新评论
node负责搭建服务器，接收处理请求