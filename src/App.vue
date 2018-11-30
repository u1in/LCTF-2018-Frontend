<template>
    <div class="app-container">
      <router-view/>
    </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style >
.app-container {
  height: 100%;
  width: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
