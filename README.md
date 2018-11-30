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
2. 前端路由中设置了白名单验证，部分路由需要凭证方可进入。若需进一步开发请于**./src/router/index.js**中修改。
3. 后端地址以及轮询时间间隔请于**./src/router/index.js**中修改。
4. team页面中的题目类型统计为写死内容，若于比赛题目类别不相符请于**./src/page/team.vue**中修改。
5. 由于不同比赛的宣传页面不同，所以我清空了宣传页面。自定义宣传页面请于**./src/page/index.vue**中编辑。请确保提供一个按钮绑定start函数用于跳转到登陆界面。样例代码：
  ```vue
  <div @click="start" class"button">

  </div>
  ```





## 接口列表

| 接口url           | 请求方式 | 请求参数                                     | 响应参数                                     | 备注          |
| --------------- | ---- | ---------------------------------------- | ---------------------------------------- | ----------- |
| /get_token      | GET  |                                          | {token: String}                          | 后端框架需要的一个请求 |
| /register       | POST | {<br>name: String,<br>email: String,<br>password: String,<br>school: String} |                                          | 注册接口        |
| /login          | POST | {name: String, password: String}         | {code: Number, message: String, team_id: Number} | 登陆接口        |
| /get_all        | GET  |                                          | {"0": {avatar: "www.xxx.com/image.jpg",done: 1, title: "官方公告", type: "notice", text: ['Welcome LCTF 2018', 'Test Message', …]}, {}, {}, …} | 请求题目接口      |
| /team/:id       | GET  |                                          | {name: 'L-team', rank: 1, score: "1000.00", solves: [{category: 'MISC', date: '2018-11-17 09:00:00'}, name: '签到题', score: '35.34']} | 查询队伍接口      |
| /scoreboard     | GET  |                                          | [{score: '1000.00', id: 1, name: 'L-team'}, {}, {}] | 查询排行榜接口     |
| /challenge_rank | GET  |                                          | [{category: 'web', name: 'Test_Challenge', score: '1000.00'}, {}, {}] | 查询题目榜接口     |
| /get_score      | POST | {id: String}                             | {code: 1, score: '1000.00'}              | 查询分数接口      |
| /submit         | POST | {id: "1", flag: "LCTF{}"}                | {code: 1, message: "Your Flag is correct"} | 提交flag接口    |



所有POST请求的接口默认返回格式为

```
{
    code: 1, 
  	//用于标记返回值是否为预料中的值。
  	//1为成功请求比如登陆成功注册成功提交flag成功。
  	//0，为意料之外的值比如登陆失败注册失败提交flag错误。
  
  	message: "Text", //作为code的说明
  
  	data: [] //返回成功后的数据，不一定都叫data，具体看接口文档
}
```

