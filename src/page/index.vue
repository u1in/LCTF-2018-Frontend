<template>
    <div class="container">
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                countDownTime: '尚未开始',
            }
        },
        methods: {
            jump (url) {
                window.open(url);
            },
            start() {
                this.$router.push('/login');
            }
        },
        mounted () {
            
        },
        created () {
            
        },
        beforeDestroy () {
            
        }
    }
</script>

<style scoped>
@media screen and (min-width: 600px){
    .container {
        height: 100%;
        width: 100%;
        
    }
    
}
@media screen and (max-width: 600px){
    .container {
        height: 100%;
        width: 100%;
        
    }
}
</style>