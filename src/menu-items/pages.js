// assets
import { LoginOutlined, ProfileOutlined, CarOutlined, FieldTimeOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  CarOutlined,
  FieldTimeOutlined,
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    {
      id: 'login1',
      title: 'Login',
      type: 'item',
      url: '/login',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'register1',
      title: 'Register',
      type: 'item',
      url: '/register',
      icon: icons.ProfileOutlined,
      target: true
    },
    {
      id: 'vehicleList',
      title: 'Vehicle List',
      type: 'item',
      url: '/optimizer/vehicles',
      icon: icons.CarOutlined,
      target: false,
      breadcrumbs: true
    },
    {
      id: 'jobList',
      title: 'Job List',
      type: 'item',
      url: '/optimizer/jobs',
      icon: icons.FieldTimeOutlined,
      target: false,
      breadcrumbs: true
    }
  ]
};

export default pages;