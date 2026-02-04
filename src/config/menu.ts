export interface SubMenuItem {
  key: string
  title: string
  path?: string
  children?: SubMenuItem[]
}

export interface TopMenuGroup {
  key: string
  title: string
  basePaths: string[]
  children: SubMenuItem[]
}

export const topMenus: TopMenuGroup[] = [
  {
    key: 'official',
    title: '官网运营',
    basePaths: ['/dashboard', '/email-records', '/flight-query-records', '/flight-history', '/airports', '/airlines', '/countries'],
    children: [
      { key: 'dashboard', title: '仪表盘', path: '/dashboard' },
      { key: 'airlines', title: '航司', path: '/airlines' },
      { key: 'airports', title: '机场', path: '/airports' },
      { key: 'countries', title: '国家码', path: '/countries' },
      { key: 'flight-query-records', title: '网站搜索历史', path: '/flight-query-records' },
      { key: 'flight-history', title: '航班历史查询', path: '/flight-history' },
    ],
  },

  {
    key: 'ga',
    title: 'GA 增长分析',
    basePaths: ['/ga'],
    children: [
      { key: 'ga-short-links', title: '短链配置', path: '/ga/short-links' },
      { key: 'ga-click-events', title: '点击事件', path: '/ga/click-events' },
      // 预留：数据归因分析等页面
      // { key: 'ga-attribution', title: '数据归因分析', path: '/ga/attribution' },
    ],
  },
  {
    key: 'marketing',
    title: '营销工具',
    basePaths: ['/marketing'],
    children: [
      { key: 'customers', title: '客户', path: '/marketing/customers' },
      { key: 'customer-profiles', title: '客户画像', path: '/marketing/customer-profiles' },
      { key: 'segments', title: '用户分群', path: '/marketing/segments' },
      { key: 'email-templates', title: '邮件模板', path: '/marketing/email-templates' },
      { key: 'promotion-campaigns', title: '营销活动', path: '/marketing/campaigns' },
      { key: 'push-records', title: '推送记录', path: '/marketing/push-records' },
      { key: 'email-records', title: '邮件发送历史', path: '/email-records' },
    ],
  },
  {
    key: 'users',
    title: '用户管理',
    basePaths: ['/users'],
    children: [
      { key: 'user-management', title: '用户管理', path: '/users/user-management' },
      { key: 'change-user-email', title: '变更用户邮箱', path: '/users/user-management/change-email' },
      { key: 'email-preferences', title: '用户隐私', path: '/users/email-preferences' },
      { key: 'role-management', title: '角色管理', path: '/users/role-management' },
      { key: 'profile', title: '个人资料', path: '/profile' },
    ],
  },
]