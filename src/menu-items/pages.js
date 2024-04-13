// assets
import { LoginOutlined, ProfileOutlined, CarOutlined, FieldTimeOutlined, 
  CloudDownloadOutlined,ShoppingCartOutlined, CloudUploadOutlined, ExperimentOutlined, AppstoreAddOutlined, TrophyOutlined, UserOutlined, TeamOutlined, SolutionOutlined, NodeIndexOutlined, NumberOutlined, EnvironmentOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  CarOutlined,
  FieldTimeOutlined,
  TrophyOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  NodeIndexOutlined,
  NumberOutlined,
  ExperimentOutlined,
  EnvironmentOutlined,
  AppstoreAddOutlined, 
  CloudDownloadOutlined, 
  CloudUploadOutlined,
  ShoppingCartOutlined
};

const pages = {
  id: 'authentication',
  title: 'Management',
  type: 'group',
  children: [
    // {
    //   id: 'login1',
    //   title: 'Login',
    //   type: 'item',
    //   url: '/login',
    //   icon: icons.LoginOutlined,
    //   target: true
    // },
    // {
    //   id: 'register1',
    //   title: 'Register',
    //   type: 'item',
    //   url: '/register',
    //   icon: icons.ProfileOutlined,
    //   target: true
    // },
    {
      id: 'vehicleList',
      title: 'Vehicles',
      type: 'item',
      url: '/optimizer/vehicles',
      icon: icons.CarOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'jobList',
      title: 'Employees',
      type: 'item',
      url: '/optimizer/jobs',
      icon: icons.TeamOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'customerList',
      title: 'Customers',
      type: 'item',
      url: '/thaprobane/customers',
      icon: icons.UserOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id : 'fieldManagement',
      title: 'Fieldes',
      type: 'item',
      url: '/thaprobane/field-management',
      icon: icons.NumberOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id : 'environmentalZone',
      title: 'Zone Map',
      type: 'item',
      url: '/thaprobane/environmental-zones',
      icon: icons.EnvironmentOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'dailyCollection',
      title: 'Routes',
      type: 'item',
      url: '/thaprobane/daily-collection',
      icon: icons.NodeIndexOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id : 'timeLine',
      title: 'Timeline',
      type: 'item',
      url: '/thaprobane/timeline',
      icon: icons.ProfileOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'collectionDaily',
      title: 'Daily Collection',
      type: 'item',
      url: '/thaprobane/daily-collection',
      icon: icons.FieldTimeOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'dataImport',
      title: 'Tea Collection',
      type: 'item',
      url: '/thaprobane/data-import',
      icon: icons.AppstoreAddOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'fertilizers',
      title: 'Fertilizers',
      type: 'item',
      url: '/thaprobane/fertilizers',
      icon: icons.ExperimentOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'cartManagement',
      title: 'Fertilizer Orders',
      type: 'item',
      url: '/thaprobane/fertilizer/approval',
      icon: icons.ShoppingCartOutlined,
      target: false,
      breadcrumbs: false
    }

  ]
};

export default pages;