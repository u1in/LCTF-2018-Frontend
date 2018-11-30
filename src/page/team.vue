<template>
    <div class="con">
        <div class="container">
            <HeadBar></HeadBar>
            <div class="mine-top-container">
                <div id="canvas"></div>
                <div class="team-name">
                    {{name}}
                </div>
            </div>
            <div class="mine-middel-container">
                <div class="team-rank">
                    <div>
                        <font-awesome-icon icon="trophy" class="icon"/>
                        <div>{{rank}}</div>
                    </div>
                </div>
                <div class="team-info">
                    <div>
                        <div>{{score}}</div>
                        <div>SCORE</div>
                    </div>
                    <div>
                        <div>{{web}}</div>
                        <div>WEB</div>
                    </div>
                    <div>
                        <div>{{pwn}}</div>
                        <div>PWN</div>
                    </div>
                    <div>
                        <div>{{re}}</div>
                        <div>RE</div>
                    </div>
                    <div>
                        <div>{{misc}}</div>
                        <div>MISC</div>
                    </div>
                    <div>
                        <div>{{crypto}}</div>
                        <div>CRYPTO</div>
                    </div>
                </div>
            </div>
            <!-- 加载图标 -->
            <div class="loading" v-show="tableLoading">
                <font-awesome-icon icon="spinner" spin />
            </div>
            <div class="mine-bottom-container" v-show="!tableLoading">
                <el-table
                :data="tableData"
                stripe
                border
                max-height="280px"
                height=280
                style="width: 720px">
                    <el-table-column
                    prop="date"
                    label="时间"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="category"
                    label="分类"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="题目"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="score"
                    label="分值">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import HeadBar from '../components/HeadBar.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(faTrophy);
library.add(faSpinner);

// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require("echarts/lib/chart/pie");
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

export default {
    components: {
        HeadBar,
    },
    data() {
        return {
            name: '',
            rank: 1,
            score: 0,
            solves: [],
            tableLoading: true,
            echartData: [{
                name: 'web',
                value: 0,
            },{
                name: 're',
                value: 0,
            },{
                name: 'pwn',
                value: 0,
            },{
                name: 'misc',
                value: 0,
            },{
                name: 'crypto',
                value: 0,
            }],
        }
    },
    computed: {
        tableData () {
            let tableData = this.solves;
            //时间从近到远排序
            tableData.sort( (a,b) => {
                if(a.date > b.date) {
                    return 1;
                }
                else {
                    return -1;
                }
            })
            return tableData;
        },
        web () {
            let web = 0;
            for(let i in this.solves) {
                if(this.solves[i].category.toLowerCase() === 'web') {
                    web++;
                }
            }
            return web;
        },
        re () {
            let re = 0;
            for(let i in this.solves) {
                if(this.solves[i].category.toLowerCase() === 're') {
                    re++;
                }
            }
            return re;
        },
        pwn () {
            let pwn = 0;
            for(let i in this.solves) {
                if(this.solves[i].category.toLowerCase() === 'pwn') {
                    pwn++;
                }
            }
            return pwn;
        },
        misc () {
            let misc = 0;
            for(let i in this.solves) {
                if(this.solves[i].category.toLowerCase() === 'misc') {
                    misc++;
                }
            }
            return misc;
        },
        crypto () {
            let crypto = 0;
            for(let i in this.solves) {
                if(this.solves[i].category.toLowerCase() === 'crypto') {
                    crypto++;
                }
            }
            return crypto;
        }
    },
    methods: {
        getInfo (id) {
            this.$get('/team/'+id).then(resp => {
                this.name = resp.name;
                this.rank = resp.rank;
                this.score = resp.score;
                this.tableLoading = false;
                for(let i in resp.solves) {
                    this.solves.push(resp.solves[i]);
                    for(let ii in this.echartData) {
                        if(this.echartData[ii].name === resp.solves[i].category.toLowerCase()) {
                            //此处有.000000000002 bug 注意截取小数点后位数
                            this.echartData[ii].value = (parseFloat(this.echartData[ii].value) + parseFloat(resp.solves[i].score)).toFixed(3);
                        }
                    }
                }
                this.echartData.sort( (a,b) => { return a.value - b.value});
                this.$nextTick(() => {
                    this.drawPie();
                })
            }).catch(error => console.log(error));
        },
        drawPie () {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('canvas'));
            let option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name:'分值占比',
                        type:'pie',
                        radius : '70%',
                        center: ['50%', '50%'],
                        data: this.echartData,
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.6)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },

                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
            };
            // 绘制图表
            myChart.setOption(option);
        },
    },
    created () {
        this.getInfo(this.$route.params.id);
    },
    mounted () {
        
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
.mine-container {
    height: 695px;
    width: 100%;
    background: #ffffff;
}
.mine-top-container {
    height: 295px;
    width: 100%;
    background: rgb(11, 84, 111);
    background: url('../../static/images/mine-back.jpg') no-repeat;
    background-position: center center;
    background-size: cover;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    overflow: hidden;
}
#canvas {
    height: 200px;
    width: 300px;
}
.team-name {
    color: #ffffff;
    font-size: 20px;
    font-weight: bold;
    margin: 5px;
}
.mine-middel-container {
    height: 100px;
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.team-rank {
    height: 100%;
    width: 100px;
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
}
.team-rank .icon {
    height: 30px;
    width: 30px;
}
.icon:hover {
    height: 40px;
    width: 40px;
}
.team-rank > div:last-of-type {
    font-size: 20px;
    margin: 5px;
}
.team-info {
    height: 100%;
    width: 660px;
    display: flex;
    justify-content: center;
    align-items: center; 
}
.team-info > div {
    height: 100%;
    width: 100px;
    font-size: 14px;
    margin: 0 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}
.team-info > div > div:first-of-type {
    height: 30px;
    width: 100%;
    font-size: 20px;
}
.team-info > div > div:last-of-type {
    margin: 5px;
}
.mine-bottom-container {
    height: 300px;
    width: 100%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.loading {
    height: 300px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    font-size: 30px;
}

.loading > svg {
    margin-bottom: 20px;
}
</style>