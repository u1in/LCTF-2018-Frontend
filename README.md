# LCTF2018 前端页面

## 使用方法:

1. 安装依赖

```bash
npm install
```

2. 测试运行

 ```bash
 npm run dev
 ```

3. 打包项目

 ```bash
 npm run build
 ```

   ​

## 注意事项

1. 项目中存在着开发者大量偷懒暴力写法，望谅解。
2. 前端路由中设置了白名单验证，部分路由需要凭证方可进入。若需进一步开发请于 **./src/router/index.js** 中修改。
3. 后端地址以及轮询时间间隔请于 **./src/router/index.js** 中修改。
4. team页面中的题目类型统计为写死内容，若于比赛题目类别不相符请于 **./src/page/team.vue** 中修改。
5. 由于不同比赛的宣传页面不同，自定义宣传页面建议提供一个开始按钮导向/login





## 接口列表

| 接口url           | 请求方式 | 请求参数                                     | 响应参数                                     | 备注          |
| --------------- | ---- | ---------------------------------------- | ---------------------------------------- | ----------- |
| /get_token      | GET  |                                          | {token: String}                          | Django需要的CSRF Token。换框架注意删除。 |
| /register       | POST | {<br>&nbsp;&nbsp;&nbsp;&nbsp;name: "L-team",<br>&nbsp;&nbsp;&nbsp;&nbsp;email: "L-team@email.com",<br>&nbsp;&nbsp;&nbsp;&nbsp;password: "L-team",<br>&nbsp;&nbsp;&nbsp;&nbsp;school: "L-team"<br>} | {<br>&nbsp;&nbsp;&nbsp;&nbsp;code: 1,<br>&nbsp;&nbsp;&nbsp;&nbsp;message: "Register Success!"<br>}                                         | 注册接口        |
| /login          | POST | {<br>&nbsp;&nbsp;&nbsp;&nbsp;name: "L-team",<br>&nbsp;&nbsp;&nbsp;&nbsp;password: "L-team"<br>}         | {<br>&nbsp;&nbsp;&nbsp;&nbsp;code: 1,<br>&nbsp;&nbsp;&nbsp;&nbsp;message: "Login Success!",<br>&nbsp;&nbsp;&nbsp;&nbsp;team_id: 1<br>} | 登陆接口        |
| /get_all        | GET  |                                          | {<br>&nbsp;&nbsp;&nbsp;&nbsp;"0":{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;avatar: "www.xxx.com/image.jpg",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;done: 1,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title: "官方公告",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: "notice",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text: [<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Welcome LCTF 2018',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Test Message',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;…<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]},<br> {}, {}, …} | 请求题目接口      |
| /team/:id       | GET  |                                          | {<br>&nbsp;&nbsp;&nbsp;&nbsp;name: 'L-team',<br>&nbsp;&nbsp;&nbsp;&nbsp;rank: 1,<br>&nbsp;&nbsp;&nbsp;&nbsp;score: "1000.00",<br>&nbsp;&nbsp;&nbsp;&nbsp;solves: [{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;category: 'MISC',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;date: '2018-11-17 09:00:00',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: '签到题',<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;score: '35.34'}, {}, {}]<br>} | 查询队伍接口      |
| /scoreboard     | GET  |                                          | [{<br>&nbsp;&nbsp;&nbsp;&nbsp;score: '1000.00',<br>&nbsp;&nbsp;&nbsp;&nbsp;id: 1,<br>&nbsp;&nbsp;&nbsp;&nbsp;name: 'L-team'<br>}, {}, {}] | 查询排行榜接口     |
| /challenge_rank | GET  |                                          | [{<br>&nbsp;&nbsp;&nbsp;&nbsp;category: 'web',<br>&nbsp;&nbsp;&nbsp;&nbsp;name: 'Test_Challenge',<br>&nbsp;&nbsp;&nbsp;&nbsp;score: '1000.00'<br>},{}, {}] | 查询题目榜接口     |
| /get_score      | POST | {<br>&nbsp;&nbsp;&nbsp;&nbsp;id: 1<br>}                             | {<br>&nbsp;&nbsp;&nbsp;&nbsp;code: 1,<br>&nbsp;&nbsp;&nbsp;&nbsp;score: '1000.00'<br>}              | 查询分数接口      |
| /submit         | POST | {<br>&nbsp;&nbsp;&nbsp;&nbsp;id: "1",<br>&nbsp;&nbsp;&nbsp;&nbsp;flag: "LCTF{}"<br>}                | {<br>&nbsp;&nbsp;&nbsp;&nbsp;code: 1,<br>&nbsp;&nbsp;&nbsp;&nbsp;message: "Your Flag is correct"<br>} | 提交flag接口    |



所有POST请求的接口默认返回格式为

```
{
    //用于标记返回值是否为预料中的值。
    //1为成功请求比如登陆成功注册成功提交flag成功。
    //0，为意料之外的值比如登陆失败注册失败提交flag错误。
    code: 1, 
    
    //作为code的说明
    message: "Text", 
    
    //返回成功后的数据，不一定都叫data，具体看接口文档
    data: [] 
}
```

