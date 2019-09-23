import Vue from 'vue'
import Router from 'vue-router'
import MeteoWidgetCreator from '@/components/MeteoWidgetCreator'
import SmallMeteoWidget from '@/views/SmallMeteoWidget'
import MiddleMeteoWidget from '@/views/MiddleMeteoWidget'
import StandardMeteoWidget from '@/views/StandardMeteoWidget'
import BigMeteoWidget from '@/views/BigMeteoWidget'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MeteoWidgetCreator',
      component: MeteoWidgetCreator
    },
    {
      path: '/t1/:stationName',
      name: 'meteoparam',
      component: StandardMeteoWidget,
      props: true,
    },
    {
      path: '/t2/:stationName',
      name: 'meteoparam2',
      component: SmallMeteoWidget,
      props: true,
    },
    {
      path: '/t3/:stationName',
      name: 'meteoparam3',
      component: MiddleMeteoWidget,
      props: true,
    },
    {
      path: '/t4/:stationName',
      name: 'meteoparam4',
      component: BigMeteoWidget,
      props: true,
    },
  ]
})
