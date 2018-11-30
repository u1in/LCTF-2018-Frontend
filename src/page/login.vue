<template>
    <div class="container">
        <div class="login-container">
            <div class="top-bar">
                <div class="red" @click="jump"></div>
                <font-awesome-icon icon="pen" class="icon" @click="showToggle"/>
            </div>
            <div class="middle" v-show="showLogin">
                <img src="../../static/images/avatar.jpg">
            </div>
            <div class="bottom" v-show="showLogin">
                <input type="text" placeholder="团队名" v-model="loginName">
                <input type="password" placeholder="密码" v-model="loginPassword" @keydown.enter="login">
                <font-awesome-icon :icon="['far','arrow-alt-circle-right']" class="submit" @click="login"/>
            </div>
            <div class="register-container" v-show="!showLogin">
                <input type="text" placeholder="团队名" v-model="registerName">
                <input type="text" placeholder="学校" v-model="registerSchool">
                <input type="text"  placeholder="登陆邮箱" v-model="registerEmail">
                <input type="password"  placeholder="登陆密码" v-model="registerPassword">
                <input type="password"  placeholder="重复密码" v-model="registerPasswordRepeat" @keydown.enter="register">
                <font-awesome-icon :icon="['far','arrow-alt-circle-right']" class="submit" @click="register"/>
            </div>
            <div class="message-container" v-show="messageShow">
                <div class="message">{{message}}</div>
                <div class="message-button" @click="messageToggle">确定</div>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'
library.add(faPen);
library.add(faArrowAltCircleRight);
export default {
    data() {
        return {
            //登陆注册切换
            showLogin: true,
            //提示信息显示
            messageShow: false,
            //提示信息
            message: '',
            //以下均为表单变量
            loginName: '',
            loginPassword: '',
            registerName: '',
            registerSchool: '',
            registerEmail: '',
            registerPassword: '',
            registerPasswordRepeat: '',
        }
    },
    methods: {
        showToggle () {
            this.showLogin = !this.showLogin;
        },
        messageToggle () {
            this.messageShow = !this.messageShow;
            if(!this.messageShow) {
                this.message = '';
            }
        },
        messageBox (text) {
            this.message = text;
            this.messageShow = true;
        },
        login () {
            if(this.loginName != '' && this.loginPassword != '') {
                let data = {
                    name: this.loginName,
                    password: this.loginPassword,
                }
                this.$post('/login', data).then(resp => {
                    if(resp.code === 1) {
                        localStorage.setItem('team_id', resp.team_id);
                        this.$router.push('/challenges');
                    }
                    else {
                        this.messageBox(resp.message);
                    }
                }).catch(error => console.log(error));
            }
            else {
                if(this.loginName === '') {
                    this.messageBox('登录名不能为空');
                }
                else if(this.loginPassword === '') {
                    this.messageBox('密码不能为空')
                }
            }
        },
        register () {
            if(this.registerName === '' || this.registerSchool === '' || this.registerEmail === '' || this.registerPassword === '' || this.registerPasswordRepeat === '') {
                this.messageBox('请将信息填写完整');
            }
            else {
                if(this.registerPassword != this.registerPasswordRepeat) {
                    this.messageBox('两次密码不一致');
                }
                else {
                    let data = {
                        name: this.registerName,
                        email: this.registerEmail,
                        password: this.registerPassword,
                        school: this.registerSchool,
                    }
                    this.$post('/register', data).then(resp => {
                        if(resp.code === 1) {
                            this.messageBox('注册成功');
                            this.showToggle();
                        }
                        else {
                            this.messageBox(resp.message);
                        }
                    }).catch(error => console.log(error));
                }
            }
        },
        getToken() {
            this.$get('/get_token').then(resp => {
                localStorage.setItem('token', resp.token);
            }).catch(error => console.log(error));
        },
        jump () {
            this.$router.push('/index');
        }
    },
    created () {
        this.getToken();
    }
}
</script>

<style scoped>
.container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../static/images/back.png') no-repeat;
    background-position: center center;
    background-size: cover;
}
.login-container {
    height: 320px;
    width: 250px;
    border-radius: 4px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
}
.top-bar {
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.icon {
    font-size: 16px;
    color: #464646;
    margin: 0 10px;
    cursor: pointer;
}
.icon:hover {
    color: rgb(28, 167, 242);
}
.red {
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: rgb(252, 71, 72);
    margin: 0 10px;
    cursor: pointer;
}
.middle {
    height: 140px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.middle img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: 1px solid gray;
}
.bottom {
    height: 150px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}
input {
    height: 35px;
    width: 185px;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid rgb(209, 212, 214);
    outline: none;
    font-size: 16px;
    padding-right: 10px;
}
.submit {
    height: 20px;
    width: 20px;
    cursor: pointer;
    color: black;
}
.bottom .submit {
    position: absolute;
    bottom: 47px;
    right: 20px;
}
.submit:hover {
    color: rgb(28, 167, 242);
}
.register-container {
    height: 290px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}
.register-container input {
    margin: 5px 0;
}
.register-container .submit {
    margin: 10px 0;
}
.message-container {
    height: 130px;
    width: 420px;
    border-radius: 4px;
    border: 1px solid rgb(221, 221, 221);
    background: rgb(243, 243, 243);
    position: absolute;
    top: -40px;
    box-sizing: border-box;
    padding: 20px;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
}
.message-button {
    position: absolute;
    bottom: 20px;
    right: 20px;
    height: 20px;
    line-height: 20px;
    width: 75px;
    border-radius: 5px;
    background: #ffffff;
    font-size: 12px;
    text-align: center;
    border: 1px solid rgb(205, 205, 205);
    cursor: pointer;
}
.message-button:hover {
    color: #ffffff;
    background: rgb(38, 123, 253);
    border: 1px solid rgb(129, 169, 241);
}
</style>