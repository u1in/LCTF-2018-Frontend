<template>
    <div class="container">
        <div v-html="html"></div>
    </div>
</template>

<script>
import ajax from '../tools/ajax';
    export default {
        data() {
            return {
                countDownTime: '尚未开始',
                html: '',
            }
        },
        methods: {
            jump (url) {
                window.open(url);
            },
            start() {
                this.$router.push('/login');
            },
            getHtml () {
                ajax.get('/get_index').then(resp => {
                    if(resp.code === 1) {
                        this.html = resp.content;
                    }
                }).catch(error => {console.log(error)});
                
            }
        },
        mounted () {
            
        },
        created () {
            this.getHtml();
        },
        beforeDestroy () {
            
        }
    }
</script>

<style scoped>
.container {
    height: 100%;
    width: 100%;
    
}
</style>