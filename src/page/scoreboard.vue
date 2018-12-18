<template>
    <div class="con">
        <div class="container">
            <HeadBar></HeadBar>
            <div class="scoreboard-container">
                <!-- 时钟 -->
                <div class="time">
                    {{timeString}}
                </div>
                <!-- 标签栏 -->
                <div class="tag-container">
                    <div :class="show === 'rank' ? 'active' : ''" @click="showChange('rank')">实时排名榜</div>
                    <div :class="show === 'score' ? 'active' : ''" @click="showChange('score')">实时分值榜</div>
                </div>
                <!-- 排行榜 -->
                <div class="rank-container" v-show="show === 'rank'">
                    <div  v-if="scoreboard != ''" v-for="(value, key) in scoreboard" :key="key" :class="['rank-item', key === '1' ? 'one' : '', key === '2' ? 'two' : '', key === '3' ? 'three' : '']">
                        <div class="rank-num">#{{key}}</div>
                        <router-link :to="{ name: 'Team', params: {id: value.id}}" class="link">{{value.name}}</router-link>
                        <div class="score-num">{{value.score}}</div>
                    </div>

                    <!-- 加载图标 -->
                    <div v-if="scoreboard === ''" class="loading">
                        <font-awesome-icon icon="spinner" spin />
                    </div>
                </div>
                
                <!-- 分值榜 -->
                <div class="rank-container" v-show="show === 'score'">
                    <div v-if="rankboard !== ''" v-for="(value, key) in rankboard" :key="key" :class="['rank-item', key === '1' ? 'one' : '', key === '2' ? 'two' : '', key === '3' ? 'three' : '']">
                        <div class="rank-num">#{{key}}</div>
                        <div class="team-name">{{value.name}} ({{value.category.toUpperCase()}})</div>
                        <div class="score-num">{{value.score}}</div>
                    </div>

                    <!-- 加载图标 -->
                    <div v-if="rankboard === ''" class="loading">
                        <font-awesome-icon icon="spinner" spin />
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
import {faSpinner} from '@fortawesome/free-solid-svg-icons'

library.add(faSpinner);

    export default {
        components: {
            HeadBar
        },
        data() {
            return {
                //时钟字符串
                timeString: '00:00:00',
                //显示标签
                show: 'rank',
                //计时器id
                _time: '',
                //计时器id
                _scoreboard: '',
                //分值榜
                scoreboard: '',
                //排行榜
                rankboard: '',
            }
        },
        methods: {
            countTime () {
                let time = new Date();
                let hour = time.getHours();
                hour = hour < 10 ? '0' + hour : hour;

                let min = time.getMinutes();
                min = min < 10 ? '0' + min : min;

                let sec = time.getSeconds();
                sec = sec < 10 ? '0' + sec : sec;

                this.timeString = hour + ':' + min + ':' + sec;
            },
            showChange (name) {
                this.show = name;
            },
            getScoreboard () {
                this.$get('/scoreboard').then(resp => {
                    this.scoreboard = resp;
                }).catch(error => console.log(error));

                this.$get('/challenge_rank').then(resp => {
                    this.rankboard = resp;
                }).catch(error => console.log(error));
            },
        },
        created () {
            this.countTime();
            this.getScoreboard();
            this._time = setInterval(this.countTime, 300);
            this._scoreboard = setInterval(this.getScoreboard, this.$time);
        },
        beforeDestroy () {
            clearInterval(this._time);
            clearInterval(this._scoreboard);
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
    align-items: center;
}
.scoreboard-container {
    height: 695px;
    width: 100%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.time {
    height: 150px;
    line-height: 150px;
    width: 600px;
    margin-top: 25px;
    font-size: 90px;
    font-weight: bold;
}
.tag-container {
    height: 50px;
    width: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.tag-container div {
    height: 50px;
    margin: 0 20px;
    line-height: 50px;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
}
.tag-container div:hover {
    border-bottom: 2px solid #2296c4;
}
.tag-container .active {
    border-bottom: 2px solid #2296c4;
}
.rank-container {
    height: 430px;
    width: 800px;
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
}
.rank-item {
    min-height: 40px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
}
.rank-num,
.score-num {
    height: 100%;
    width: 100px;
    line-height: 40px;
    text-align: center;
}
.score-num  {
    width: 200px;
}
.link,
.team-name {
    height: 100%;
    line-height: 40px;
    width: 500px;
    overflow-y: auto;
}
.team-name::-webkit-scrollbar {
    height: 0;
    width: 0;
}
.one {
    font-size: 28px !important;
}
.two {
    font-size: 24px !important;
}
.three {
    font-size: 20px !important;
}
.link,
.link:link,
.link:visited,
.link:hover,
.link:active {
    text-decoration: none;
    color: #000000;
}

.loading {
    height: 100%;
    width: 100%;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -20px;
}
</style>