// assets
import { ChromeOutlined, QuestionOutlined, SettingOutlined, UserSwitchOutlined, SafetyCertificateOutlined, SolutionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const adminPages = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    // {
    //   id: 'sample-page',
    //   title: 'Sample Page',
    //   type: 'item',
    //   url: '/sample-page',
    //   icon: icons.ChromeOutlined
    // },
    {
      id: 'profile',
      title: 'Profile Settings',
      type: 'item',
      url: '/thaprobane/profile',
      icon: icons.SettingOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'complaints',
      title: 'Complaints',
      type: 'item',
      url: '/thaprobane/complaints',
      icon: icons.SolutionOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'privacy',
      title: 'Privacy',
      type: 'item',
      url: '/thaprobane/privacy',
      icon: icons.SafetyCertificateOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'documentation',
      title: 'Development',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    },
  ]
};

const nonAdminPages = [
  {
    id: 'profile-customer',
    title: 'Profile Settings',
    type: 'item',
    url: ' /thaprobane/customer-profile',
    icon: icons.SettingOutlined,
    target: false,
    breadcrumbs: false
  },
];

const support = {
id: 'app-support',
title: 'Support',
type: 'group',
children: localStorage?.getItem('userRole') === "ROLE.CUSTOMER" ? nonAdminPages : adminPages.children
};





export default support;
