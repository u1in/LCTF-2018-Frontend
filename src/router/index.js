import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Challenges from '@/page/challenges'
import Team from '@/page/team'
import ScoreBoard from '@/page/scoreboard'
import Login from '@/page/login'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index',
    }, {
      path: '/index',
      name: 'Index',
      component: Index,
    }, {
      path: '/challenges',
      name: 'Challenges',
      component: Challenges
    }, {
      path: '/team/:id',
      name: 'Team',
      component: Team,
    }, {
      path: '/scoreboard',
      name: 'ScoreBoard',
      component: ScoreBoard,
    }, {
      path: '/login',
      name: 'Login',
      component: Login,
    }
  ]
})

router.beforeEach((to, from, next) => {
  //获取本地储存的id
  let teamId = localStorage.getItem('team_id');
  //进入下列路由需要凭证
  let needIdList = ['Challenges', 'Team', 'ScoreBoard'];

  if (needIdList.indexOf(to.name) > -1) {
    if (teamId === null) {
      next({
        path: '/login',
      })
    }
    else {
      next();
    }
  }
  else {
    if (to.name === 'Login' && teamId != null) {
      next({
        path: '/challenges',
      })
    }
    else {
      next();
    }
  }
})

export default router;