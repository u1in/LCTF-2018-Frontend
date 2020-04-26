<template>
    <div class="right-container">
        <!-- 顶部显示回话标题 -->
        <div class="title-container">{{title}}</div>
        <!-- 聊天信息主体 -->
        <div class="info-container" v-if="enabled">
            <a
                ref="scr"
                class="scroller"
                href="#bottom"
                v-smooth-scroll="{duration: 1000, container: '.info-container'}"
            ></a>
            <div
                v-for="(item, index) in talkList"
                :key="index"
                :class="[item.admin != 0 ? '' : 'mine','info-item']"
            >
                <div class="avatar">
                    <img :src="item.avatar" />
                </div>
                <div class="text-container">
                    <div class="text" v-html="item.text" v-if="item.admin != 0"></div>
                    <div class="text" v-if="item.admin === 0">{{item.text}}</div>
                </div>
            </div>
            <span id="bottom"></span>
        </div>
        <!-- 输入框主体 -->
        <div class="input-container">
            <div class="tools-bar" v-if="enabled">
                <font-awesome-icon
                    :icon="['far', 'grin']"
                    width="2em"
                    fixed-width
                    @click="send('查询分值')"
                    :class="['tools-icon', muted ? 'disable' : '']"
                />
            </div>
            <div v-if="!enabled"></div>
            <textarea
                v-if="!muted && enabled"
                placeholder="flag格式: minil{xxxxx} 请提交完整字符串"
                v-model="message"
                @keydown.enter.prevent="send()"
                ref="textarea"
            ></textarea>
            <textarea v-if="muted && enabled" disabled placeholder="已经不能输入了"></textarea>
        </div>
    </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGrin } from "@fortawesome/free-regular-svg-icons";

library.add(faGrin);
export default {
    props: ["talkList", "enabled", "avatar", "title", "muted"],
    data() {
        return {
            message: "",
            position: 0
        };
    },
    methods: {
        send(msg = this.message) {
            if (msg === "" || this.muted) return;
            this.talkList.push({
                avatar: "../../static/images/avatar.jpg",
                text: msg,
                admin: 0
            });
            this.$emit("send_msg", msg);
            this.message = "";
            this.$refs.scr.click();
        },
        recv(msg, role = 1) {
            this.talkList.push({
                avatar: this.avatar,
                text: msg,
                admin: role
            });
            this.$refs.scr.click();
        }
    }
};
</script>

<style>
.drawer {
    width: 20px;
    height: 20px;
    align-content: center;
}
.menu-open {
    display: none;
}
.menu-open-button {
    z-index: 1;
    background-color: #ffffff;
}
.menu-item {
    -webkit-transition: -webkit-transform ease-out 200ms;
    transition: transform ease-out 200ms, -webkit-transform ease-out 200ms;
    color: rgb(126, 126, 126);
}
.menu-item,
.menu-open-button {
    cursor: pointer;
    border-radius: 100%;
    position: absolute;
}

.menu-open:checked ~ .menu-item {
    -webkit-transition-timing-function: cubic-bezier(0.935, 0, 0.34, 1.33);
    transition-timing-function: cubic-bezier(0.935, 0, 0.34, 1.33);
}

.menu-open:checked ~ .menu-item:nth-child(3) {
    transition-duration: 160ms;
    -webkit-transition-duration: 160ms;
    -webkit-transform: translate3d(-33px, -27px, 0);
    transform: translate3d(-33px, -27px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(4) {
    transition-duration: 200ms;
    -webkit-transition-duration: 200ms;
    -webkit-transform: translate3d(-11px, -27px, 0);
    transform: translate3d(-11px, -27px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(5) {
    transition-duration: 240ms;
    -webkit-transition-duration: 240ms;
    -webkit-transform: translate3d(11px, -27px, 0);
    transform: translate3d(11px, -27px, 0);
}

.menu-open:checked ~ .menu-item:nth-child(6) {
    transition-duration: 280ms;
    -webkit-transition-duration: 280ms;
    -webkit-transform: translate3d(33px, -27px, 0);
    transform: translate3d(33px, -27px, 0);
}

.avatar img {
    height: 100%;
    width: 100%;
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
    -webkit-transition-duration: 200ms;
    transition-duration: 200ms;
}
.tools-icon:hover {
    -webkit-transform: scale(1.2, 1.2) translate3d(0, 0, 0);
    transform: scale(1.2, 1.2) translate3d(0, 0, 0);
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