// assets
import { DashboardOutlined, ImportOutlined, MonitorOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ImportOutlined,
  MonitorOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
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
      id : 'data-import',
      title: 'Data Import',
      type: 'item',
      url: '/data/import',
      icon: icons.ImportOutlined,
      breadcrumbs: true
    }
  ]
};

export default dashboard;
