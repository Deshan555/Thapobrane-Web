// assets
import { DashboardOutlined, ImportOutlined, MonitorOutlined, RiseOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ImportOutlined,
  MonitorOutlined,
  RiseOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const adminPages = {
  id: 'insights',
  title: 'Insights',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'dataSources',
      title: 'Field Inspection',
      type: 'item',
      url: '/thaprobane/field-inspection',
      icon: icons.MonitorOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'prognosticX',
      title: 'PrognosticX',
      type: 'item',
      url: '/thaprobane/admin',
      icon: icons.RiseOutlined,
      target: false,
      breadcrumbs: false
    }
  ]
};

const nonAdminPages = [
  {
    id: 'dataSources',
    title: 'Field Inspection',
    type: 'item',
    url: '/thaprobane/field-inspection',
    icon: icons.MonitorOutlined,
    target: false,
    breadcrumbs: false
  },
  // {
  //   id: 'prognosticX',
  //   title: 'PrognosticX',
  //   type: 'item',
  //   url: '/thaprobane/admin',
  //   icon: icons.RiseOutlined,
  //   target: false,
  //   breadcrumbs: false
  // }
];

const dashboard = {
id: 'app-Insights',
title: 'Insights',
type: 'group',
children: localStorage?.getItem('userRole') === "ROLE.CUSTOMER" ? nonAdminPages : adminPages.children
};


export default dashboard;
