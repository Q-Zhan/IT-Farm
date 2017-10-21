# 前言

> 学习了vue全家桶后一直想找个机会来写一个完整一点的项目，这次学校举办的比赛就是一个很好的契机。由于是自己瞎搞搞，所以写起来比较随心所欲，没有过多地从设计和产品的角度去思考。这个项目包括了图片上传、发布消息、点对点聊天等功能，算是一个中规中矩的练手项目，适合刚接触vue全家桶的同学学习。当然，由于时间仓促，代码质量不是很高，有很多地方没有实现组件化分离和优雅实现，后面的时间会慢慢优化并添加一些注释。
> __注意：此项目为前端项目，想看后端代码的同学可以点击[后台项目传送地址](https://github.com/wususu/Mimi-Sever)。有问题欢迎提issue，同时也欢迎Star！__

## 技术栈
vue2 + vuex + vue-router + webpack + websocket + es6/7 + fetch + sass

## 效果演示
[demo预览地址](https://123.207.18.102)（建议使用chrome浏览器的手机模式浏览）

## 功能点
- [x] 注册
- [x] 登录（自动登录、页面可刷新、第三方授权登录）
- [x] 一对一私聊
- [x] 消息通知（点赞、评论提醒）
- [x] 上传图片
- [x] 上拉、下拉加载刷新
- [x] 发送message(带图片、带地址、可匿名)
- [x] message筛选查看、点击大图
- [x] 发表评论、回复评论
- [x] 点赞功能
- [x] 查看他人的个人主页
- [x] 查看、修改用户个人信息（头像）
- [x] 关注、粉丝系统（未完善）
- [x] emoji表情

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

# 特别注意
该项目的部署环境使用了nginx的反向代理来实现前端的跨域请求，本地开发时使用cors进行跨域（可能以后后端cors设置会关闭）。如若本地运行时遇到跨域问题，请自行使用[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)进行跨域。
