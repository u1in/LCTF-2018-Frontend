<template>
    <div class="con">
    <div class="container">
        <HeadBar></HeadBar>
        <div class="main-container">
            <div class="left-container">
                <div class="group-container" v-for="(value, key) in List" :key="key" v-if="List != {}">
                    <!-- 生成分组的名字，可点击用于折叠 -->
                    <div class="group" @click="showToggle(key)">
                        <div class="group-name">
                            <font-awesome-icon :icon="type[key] ? 'chevron-down' : 'chevron-right'" class="icon"/>
                            {{key.toUpperCase()}}
                        </div>
                        <div class="group-number" v-if="key === 'notice'">1/1</div>
                        <div class="group-number" v-else>{{doneNumber[key] + '/' + Object.keys(List[key]).length}}</div>
                    </div>
                    <!-- 生成会话头像 -->
                    <div v-show="type[key]" class="group-list">
                        <!-- 此处偷懒，其实可以先sort好List再渲染 -->
                        <!-- 先生成还没完成的题目 -->
                        <div v-for="(value2, key2) in List[key]" :key="key2" :class="['talk-item', active == key2 ? 'active' : '']" @click="chooseTalk(key2)" v-if="value2.done === 0">
                            <div class="avatar">
                                <img :src="value2.avatar">
                            </div>
                            <div class="text">
                                <div class="name">{{value2.title}}</div>
                                <div>
                                    {{talkList[key2][talkList[key2].length - 1].text}}
                                </div>
                            </div>
                            <div class="unread" v-show="unread[key2] != 0">{{unread[key2]}}</div>
                        </div>
                        <!-- 后生成还完成的题目， 对公告不应用disable样式 -->
                        <div v-for="(value3, key3) in List[key]" :key="key3" :class="['talk-item', key3 === notice ? '' : 'disable', active == key3 ? 'active' : '']" @click="chooseTalk(key3)" v-if="value3.done != 0">
                            <div class="avatar">
                                <img :src="value3.avatar">
                            </div>
                            <div class="text">
                                <div class="name">{{value3.title}}</div>
                                <div>
                                    {{talkList[key3][talkList[key3].length - 1].text}}
                                </div>
                            </div>
                            <div class="unread" v-show="unread[key3] != 0">{{unread[key3]}}</div>
                        </div>
                    </div>
                </div>
                <!-- 生成尚未加载成功的占位内容 -->
                <div class="group-list" v-if="List === {}">
                    <div class="talk-item" v-for="i in 10" :key="i">
                        <div class="avatar">
                            <div class="none-avatar"></div>
                        </div>
                        <div class="text">
                            <div class="none-name"></div>
                            <div class="none-info"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-container">
                <!-- 顶部显示回话标题 -->
                <div class="title-container">
                    {{talkNo}}
                </div>
                <!-- 聊天信息主体 -->
                <div class="info-container">
                    <div v-for="(item, index) in currentTalk" :key="index" :class="[item.admin != 0 ? '' : 'mine','info-item']">
                        <div class="avatar">
                            <img :src="item.avatar">
                        </div>
                        <div class="text-container">
                            <div class="text"  v-html="item.text" v-if="item.admin != 0">
                                
                            </div>
                            <div class="text" v-if="item.admin === 0">
                                {{item.text}}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 输入框主体 -->
                <div class="input-container">
                    <div class="tools-bar" v-if="active !== ''">
                        <font-awesome-icon :icon="['far', 'grin']" @click="askScore" :class="['tools-icon', textarea ? '' : 'disable']"/>
                    </div>
                    <div v-if="active === ''"></div>
                    <textarea v-if="textarea === true && active != ''" placeholder="flag格式: LCTF{xxxxx} 请提交完整字符串" v-model="message"  @keydown.enter.prevent ="send()" ref="textarea"></textarea>
                    <textarea v-if="textarea === false && active != ''" disabled placeholder="已经不能输入了"></textarea>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import HeadBar from '../components/HeadBar.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faGrin } from '@fortawesome/free-regular-svg-icons'

library.add(faChevronRight);
library.add(faChevronDown);
library.add(faGrin);

export default {
    components: {
        HeadBar
    },
    data() {
        return {
            //聊天框内容
            message: '',
            //当前激活的会话
            active: '',
            //输入框可否输入
            textarea: true,
            //计时器id
            _time: '',
            //会话分组列表
            type: {},
            //会话名称
            talkNo: '',
            //聊天记录
            talkList: {},
            //服务器返回的原始数据
            rawdata: {},
            //左边的会话列表
            List: {},
            //题目的完成进度
            doneNumber: {},
            //未读消息数
            unread: {},
            //公告的id
            notice: '',
        }
    },
    computed: {
        currentTalk () {
            if(this.active !== '') {
                return this.talkList[this.active];
            }
        },
    },
    methods: {
        showToggle (key) {
            this.type[key] = !this.type[key];
        },
        chooseTalk (id) {
            this.unread[id] = 0;
            this.talkNo = this.rawdata[id].title;
            this.textarea = (this.rawdata[id].done === 1 ? false : true);
            this.active = id;
        },
        //计算解决进度
        Done () {
            for(let i in this.List) {
                let done = Object.keys(this.List[i]).length;
                for(let j in this.List[i]) {
                    if(this.List[i][j].done === 1) done--;
                }
                Vue.set(this.doneNumber, i, done);
            }
        },
        //查询分值快捷键
        askScore () {
            if(this.textarea) {
                this.message = '查询分值';
                this.send();
            }
        },
        send () {
            if(this.message != '') {
                if(this.message != '查询分值') {
                    let flag = this.message;
                    this.talkList[this.active].push({
                        avatar: '../../static/images/avatar.jpg',
                        text: this.message,
                        admin: 0,
                    });
                    this.message = '';
                    let data = {
                        id: this.active,
                        flag: flag
                    }
                    this.$post('/submit', data).then(resp => {
                        if(resp.code == 0) {
                            this.talkList[this.active].push({
                                avatar: this.rawdata[this.active].avatar,
                                text: resp.message,
                                admin: 1,
                            })
                        }
                        if(resp.code == 1) {
                            this.talkList[this.active].push({
                                avatar: this.rawdata[this.active].avatar,
                                text: resp.message,
                                admin: 1,
                            })
                            this.List[this.rawdata[this.active].type.toLowerCase()][this.active].done = 1;
                            this.textarea = false;
                            Vue.set(this.doneNumber, this.rawdata[this.active].type.toLowerCase(), this.doneNumber[this.rawdata[this.active].type.toLowerCase()] - 1)
                        } 
                    }).catch(error => console.log(error));
                }
                else {
                    this.getRankScore().then(resp => {
                        this.talkList[this.active].push({
                            avatar: '../../static/images/avatar.jpg',
                            text: this.message,
                            admin: 0,
                        });
                        this.message = '';
                        if(resp.code === 1) {
                            this.talkList[this.active].push({
                                avatar: this.rawdata[this.active].avatar,
                                text: '当前题目分值'+resp.score,
                                admin: 1,
                            });
                        }
                    });
                }
                
            }
        },
        getChallenges () {
            this.$get('/get_all').then(resp => {
                if(resp.code != undefined && resp.code === 0) {
                    alert(resp.message);
                    localStorage.removeItem('team_id');
                    this.$router.push('/login');
                }
                else {
                    this.rawdata = resp;
                    this.generateList();
                }
            }).catch(error => console.log(error));
        },
        //好多for
        generateList () {
            for(let i in this.rawdata) {
                //抽取第一个题目作为公告
                if(this.notice === '') {
                    this.notice = Object.keys(this.rawdata)[0];
                }
                //抽取分类
                let type = this.rawdata[i].type.toLowerCase();;
                //若没有 新建该类
                if(this.type[type] === undefined) {
                    Vue.set(this.type, type, true);
                    Vue.set(this.List, type, {});
                }
                //处理元数据，生成对话框队列
                //若无数据 新建对话框队列
                if(this.talkList[i] === undefined) {
                    Vue.set(this.talkList, i, []);
                    Vue.set(this.unread, i, 0);
                    for(let j = 0; j < this.rawdata[i].text.length; j++) {
                        Vue.set(this.talkList[i], this.talkList[i].length, {
                            avatar: this.rawdata[i].avatar,
                            text: this.rawdata[i].text[j],
                            admin: 2,
                        });
                        this.unread[i] = j;
                    }
                }
                //若有 则是实时等待新消息情景
                else {
                    let adminNumber = 0;
                    //统计当前消息队列中题目公告类信息条数
                    for(let p in this.talkList[i]) {
                        if(this.talkList[i][p].admin === 2) {
                            adminNumber++;
                        }
                    }
                    //将新消息中比旧数据多的一部分push进对话框队列
                    for(let q = adminNumber, r = 1; q < this.rawdata[i].text.length; q++, r++) {
                        Vue.set(this.talkList[i], this.talkList[i].length, {
                            avatar: this.rawdata[i].avatar,
                            text: this.rawdata[i].text[q],
                            admin: 2,
                        });
                        this.unread[i] = r;
                    }
                }
                //List将元数据按类型分好类
                Vue.set(this.List[type], i, this.rawdata[i]);
            }
            //重新计算答题进度
            this.Done();
        },
        getToken() {
            this.$get('/get_token').then(resp => {
                localStorage.setItem('token', resp.token);
            }).catch(error => console.log(error));
        },
        getRankScore () {
            let data = {
                id: this.active,
            }
            return this.$post('/get_score', data);
        },
    },
    created () {
        //读取缓存
        let rawdata = sessionStorage.getItem('rawdata') && JSON.parse(sessionStorage.getItem('rawdata'));
        let talkList = sessionStorage.getItem('talkList') && JSON.parse(sessionStorage.getItem('talkList'));
        let List = sessionStorage.getItem('List') && JSON.parse(sessionStorage.getItem('List'));
        let unread = sessionStorage.getItem('unread') && JSON.parse(sessionStorage.getItem('unread'));
        let doneNumber = sessionStorage.getItem('doneNumber') && JSON.parse(sessionStorage.getItem('doneNumber'));
        let type = sessionStorage.getItem('type') && JSON.parse(sessionStorage.getItem('type'));
        //若有缓存则直接使用
        if(rawdata != null && talkList != null && List != null && doneNumber != null && type != null) {
            this.rawdata = rawdata;
            this.talkList = talkList;
            this.List = List;
            this.unread = unread;
            this.doneNumber = doneNumber;
            this.type = type;
            sessionStorage.clear();
            this.getChallenges();
        }
        //若无缓存则加载
        else {
            this.getChallenges();
        }
        this.getToken();
        this._time = setInterval( () => {
            this.getChallenges();
        }, this.$time);
    },
    mounted () {
        if(this.$refs.textarea != undefined) {
            this.$refs.textarea.focus();
        }
    },
    updated () {
        if(this.$refs.textarea != undefined) {
            this.$refs.textarea.focus();
        }
    },
    beforeDestroy () {
        //缓存
        sessionStorage.setItem('rawdata', JSON.stringify(this.rawdata));
        sessionStorage.setItem('talkList', JSON.stringify(this.talkList));
        sessionStorage.setItem('List', JSON.stringify(this.List));
        sessionStorage.setItem('unread', JSON.stringify(this.unread));
        sessionStorage.setItem('doneNumber', JSON.stringify(this.doneNumber));
        sessionStorage.setItem('type', JSON.stringify(this.type));
        //销毁计数器
        clearInterval(this._time);
    }
}
</script>

<style scoped>
.con {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../static/images/back.png') no-repeat;
    background-position: center center;
    background-size: cover;
}
.container {
    height: 750px;
    width: 800px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center
}
.main-container {
    height: 695px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
}
.left-container {
    height: 100%;
    width: 200px;
    box-sizing: border-box;
    border-right: 1px solid rgb(243, 245, 248);
    background: #ffffff;
    overflow: auto;
}
.left-container::-webkit-scrollbar {
    width: 0px;
}
.group-container {
    min-height: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.group {
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    cursor: pointer;
}
.group-name {
    height: 100%;
    width: 100px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    
}
.group-name .icon {
    margin: 0 10px;
}
.group-number {
    margin-right: 10px;
}
.group-list {
    width: 100%;
}
.unread {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 10px;
    margin: auto;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: rgb(239, 59, 57);
    color: white;
    font-size: 6px;
    line-height: 18px;
    text-align: center;
}
.talk-item {
    height: 70px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    position: relative;
}
.talk-item.active {
    background: rgb(240, 240, 240);
}
.talk-item .avatar {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    margin: 0 5px 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
.none-avatar {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background: rgb(201, 201, 201);
}
.none-name,
.none-info {
    width: 100%;
    margin: 2px;
    background: rgb(201, 201, 201);
}
.none-name {
    height: 20px;
    margin-bottom: 5px;
}
.none-info {
    height: 15px;
}
.talk-item.disable  {
    color: rgb(182, 182, 182);
}
.talk-item.disable .avatar {
    filter: grayscale(100%);
}
.avatar img {
    height: 100%;
    width: 100%;
}
.talk-item .text {
    height: 40px;
    width: 100px;
    margin: 0 10px 0 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 12px;
    overflow: hidden;
}
.text div {
    margin: 0;
    text-align: left;
    line-height: 20px;
}
.text .name {
    font-size: 16px;
    width: 100%;
    white-space: nowrap;
}
.right-container {
    height: 100%;
    width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
}
.title-container {
    height: 45px;
    line-height: 45px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 14px;
    text-align: left;
    background: #ffffff;
}
.info-container {
    height: 480px;
    width: 100%;
    /* display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background: #ffffff; */
    overflow: auto;
}
.info-item {
    height: auto;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 20px 0;
}
.info-item.mine {
    flex-direction: row-reverse;
}
.info-item .avatar {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    margin-top: 25px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 10px 0 20px;
}
.info-item.mine .avatar {
    margin: 0 20px 0 10px;
}
.info-item .text-container {
    width: 545px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.info-item.mine .text-container {
    flex-direction: row-reverse;
}
.text-container .text {
    max-width: 360px;
    line-height: 20px;
    font-size: 12px;
    padding: 5px;
    border-radius: 5px;
    text-align: left;
    background: rgb(240, 240, 240);
    word-break: break-all;
}
.input-container {
    height: 170px;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid rgb(245, 245, 248);
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.input-container .tools-bar {
    height: 30px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.tools-icon {
    height: 20px;
    width: 20px;
    color: rgb(126, 126, 126);
    cursor: pointer;
}
.tools-icon.disable {
    cursor: not-allowed;
}
.input-container textarea {
    height: 140px;
    width: 100%;
    border: none;
    outline: none;
    box-sizing: border-box;
    padding: 10px;
    resize: none;
    background: #ffffff;
}
.input-container textarea:disabled {
    cursor: not-allowed;
    background: #ffffff;
}
</style>