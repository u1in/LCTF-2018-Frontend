<template>
    <div class="con">
        <div class="container">
            <HeadBar></HeadBar>
            <div class="main-container">
                <div class="left-container">
                    <div
                        v-if="notice !== null"
                        :key="notice"
                        :class="['talk-item', active == notice ? 'active' : '']"
                        @click="chooseTalk(notice)"
                    >
                        <div class="label">&nbsp;</div>
                        <div class="avatar">
                            <img src="../../static/images/xdsec.png" />
                        </div>
                        <div class="text">
                            <div class="name">{{challs[notice].title}}</div>
                            <div
                                v-if="chat_storage[notice] && chat_storage[notice].length > 0"
                            >{{chat_storage[notice][chat_storage[notice].length - 1].text}}</div>
                        </div>
                        <div class="unread" v-show="cnt_unread[notice] != 0">{{cnt_unread[notice]}}</div>
                    </div>

                    <div class="group-container" v-for="(value, key) in catagorized_challs" :key="key" v-if="catagorized_challs != {}">
                        <!-- 生成分组的名字，可点击用于折叠 -->
                        <div class="group" @click="has_category[key] = !has_category[key]">
                            <div class="group-name">
                                <font-awesome-icon :icon="has_category[key] ? 'chevron-down' : 'chevron-right'" class="icon"/>
                                {{key.toUpperCase()}}
                            </div>
                            <div class="group-number">{{cnt_done[key] + '/' + Object.keys(catagorized_challs[key]).length}}</div>
                        </div>
                        <!-- 生成会话头像 -->
                        <div v-show="has_category[key]" class="group-list">
                            <!-- 此处偷懒，其实可以先sort好List再渲染 -->
                            <!-- 先生成还没完成的题目 -->
                            <div v-for="(value2, key2) in catagorized_challs[key]" :key="key2" :class="['talk-item', active == key2 ? 'active' : '']" @click="chooseTalk(key2)" v-if="value2.done === 0">
                                <div class="avatar">
                                    <img :src="value2.avatar" />
                                </div>
                                <div class="text">
                                    <div class="name">{{value2.title}}</div>
                                    <div v-if="chat_storage[key2].length > 0">
                                        {{chat_storage[key2][chat_storage[key2].length - 1].text}}
                                    </div>
                                </div>
                                <div
                                    class="unread"
                                    v-show="cnt_unread[key2] != 0"
                                >{{cnt_unread[key2]}}</div>
                            </div>
                            <!-- 后生成还完成的题目， 对公告不应用disable样式 -->
                            <div v-for="(value3, key3) in catagorized_challs[key]" :key="key3" :class="['talk-item', 'disable', active == key3 ? 'active' : '']" @click="chooseTalk(key3)" v-if="value3.done != 0">
                                <div class="avatar">
                                    <img :src="value3.avatar" />
                                </div>
                                <div class="text">
                                    <div class="name">{{value3.title}}</div>
                                    <div v-if="chat_storage[key3].length > 0">
                                        {{chat_storage[key3][chat_storage[key3].length - 1].text}}
                                    </div>
                                </div>
                                <div class="unread" v-show="cnt_unread[key3] != 0">{{cnt_unread[key3]}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 生成尚未加载成功的占位内容 -->
                    <div class="group-list" v-if="catagorized_challs === {}">
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
                <ChatWindow
                    ref="chat"
                    v-bind:talkList="chat_storage[active]"
                    v-bind:enabled="active !== null"
                    v-bind:title="active!==null?challs[active].title:''"
                    v-bind:avatar="active!==null?challs[active].avatar:''"
                    v-bind:muted="active!==null && challs[active].done"
                    v-on:send_msg="handle_send"
                ></ChatWindow>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import HeadBar from '../components/HeadBar.vue'
import ChatWindow from '../components/ChatWindow'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import ajax from '../tools/ajax'

library.add(faChevronRight);
library.add(faChevronDown);

export default {
    components: {
        HeadBar,
        ChatWindow
    },
    data() {
        return {
            persisted: [
                'chat_storage',
                'challs',
                'catagorized_challs',
                'cnt_unread',
                'cnt_done',
                'has_category',
                'notice'
            ],
            //当前激活的会话
            active: null,
            //聊天记录
            chat_storage: {},
            //计时器id
            _time: '',
            //会话分组列表
            has_category: {},
            //服务器返回的原始数据
            challs: {},
            //左边的会话列表
            catagorized_challs: {},
            //题目的完成进度
            cnt_done: {},
            //未读消息数
            cnt_unread: {},
            //公告的id
            notice: null,
            //注册表
            func_registry: {
                查询分值: () => {
                    ajax.post('/get_score', {
                        id: this.active
                    }).then(resp => {
                        if (resp.code === 1)
                            this.recv('当前题目分值' + resp.score);
                    })
                }
            },
        }
    },
    methods: {
        recv (msg, role) {
            this.$refs.chat.recv(msg, role);
        },
        chooseTalk (id) {
            this.cnt_unread[id] = 0;
            this.active = id;
        },
        handle_send (msg) {
            if (this.func_registry[msg] !== undefined) {
                this.func_registry[msg]();
                return;
            }
            ajax.post('/submit', {
                id: this.active,
                flag: msg
            }).then(resp => {
                this.recv(resp.message);
                if (resp.code == 1) {
                    var category = this.challs[
                        this.active
                    ].type.toLowerCase();
                    this.catagorized_challs[category][this.active].done = 1;
                    Vue.set(this.challs[this.active], 'done', 1);
                    Vue.set(
                        this.cnt_done,
                        category,
                        this.cnt_done[category] + 1
                    );
                }
            }).catch(error => console.log(error));
        },
        getChallenges () {
            ajax.get('/get_all').then(resp => {
                if(resp.code != undefined && resp.code === 0) {
                    alert(resp.message);
                    localStorage.removeItem('team_id');
                    this.$router.push('/login');
                }
                else {
                    this.challs = resp;
                    this.generateList();
                }
            }).catch(error => console.log(error));
        },
        //好多for
        generateList () {
            this.notice = '0';
            for(var i of Object.keys(this.challs)) {
                if(this.chat_storage[i] === undefined) {
                    Vue.set(this.chat_storage, i, []);
                    Vue.set(this.cnt_unread, i, 0);
                }
                let recvd_cnt = this.chat_storage[i].filter(o => o.admin == 2).length;
                for(var t = recvd_cnt; t < this.challs[i].text.length; t++)
                    this.chat_storage[i].push({
                        avatar: this.avatar,
                        text: this.challs[i].text[t],
                        admin: 2
                    });
                this.cnt_unread[i] = this.challs[i].text.length - recvd_cnt;
                if (i == '0') continue;
                if (this.challs[i].done) this.cnt_unread[i] = 0;
                let type = this.challs[String(i)].type.toLowerCase();

                if (this.has_category[type] === undefined) {
                    Vue.set(this.has_category, type, true);
                    Vue.set(this.catagorized_challs, type, {});
                }
                Vue.set(this.catagorized_challs[type], i, this.challs[i]);
            }

            //重新计算答题进度
            for (let i in this.catagorized_challs) {
                let done = 0;
                for (let j in this.catagorized_challs[i]) {
                    if (this.catagorized_challs[i][j].done === 1) done++;
                }
                Vue.set(this.cnt_done, i, done);
            }
        }
    },
    created () {
        //读取缓存
        for (var key of this.persisted) {
            var val =
                sessionStorage.getItem(key) &&
                JSON.parse(sessionStorage.getItem(key));
            if(val !== null) this[key] = val;
        }
        this.getChallenges();
        ajax.get('/get_token').then(resp => {
            localStorage.setItem('token', resp.token);
        }).catch(error => console.log(error));

        this._time = setInterval( () => {
            this.getChallenges();
        }, this.$time);
    },
    beforeDestroy () {
        //缓存
        for (var key of this.persisted) {
            var val = this[key];
            sessionStorage.setItem(key, JSON.stringify(this[key]));
        }
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
    font-size: 10px;
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
.label {
    font-size: 4px;
    line-height: 3em;
    width: 6em;
    background: #8fbbe2;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    -webkit-transform-origin: right bottom;
    -moz-transform-origin: right bottom;
    transform-origin: right bottom;
    -webkit-transform: translate(-29.29%, -100%) rotate(-45deg);
    -moz-transform: translate(-29.29%, -100%) rotate(-45deg);
    transform: translate(-29.29%, -100%) rotate(-45deg);
    text-indent: 0;
    text-align: center;
}
</style>