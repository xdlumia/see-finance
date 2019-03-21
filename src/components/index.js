// // 系统设置
import Finance from './finance/index'; // 财务

export default {
  Finance: {
    path: '/finance', // 业务字典
    name: '/finance',
    component: Finance,
    meta: {
      parent: '/',
      title: '财务'
    }
  },
};