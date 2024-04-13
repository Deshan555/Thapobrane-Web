// assets
import { DashboardOutlined, ImportOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ImportOutlined
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
