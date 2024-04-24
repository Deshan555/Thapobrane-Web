// assets
import { RiseOutlined, MonitorOutlined, LoginOutlined, ProfileOutlined, CarOutlined, FieldTimeOutlined, CodeOutlined, CloudDownloadOutlined, CloudUploadOutlined, ExperimentOutlined, AppstoreAddOutlined, TrophyOutlined, UserOutlined, TeamOutlined, SolutionOutlined, NodeIndexOutlined, NumberOutlined, EnvironmentOutlined } from '@ant-design/icons';

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
  CodeOutlined,
  MonitorOutlined,
  RiseOutlined
};
// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const adminPages = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'exports',
      title: 'Data Exports',
      type: 'item',
      url: '/thaprobane/exports',
      icon: icons.CloudDownloadOutlined,
      target: false,
      breadcrumbs: false
    },
    {
      id: 'dataImporter',
      title: 'Data Importer',
      type: 'item',
      url: '/thaprobane/data-importer',
      icon: icons.CloudUploadOutlined,
      target: false,
      breadcrumbs: false
    },
    // {
    //   id: 'versionsInfo',
    //   title: 'Versions Info',
    //   type: 'item',
    //   url: '/thaprobane/versions-info',
    //   icon: icons.CodeOutlined,
    //   target: false,
    //   breadcrumbs: false
    // }
  ]
};

const nonAdminPages = [
  {
    id: 'prognosticX',
    title: 'PrognosticX',
    type: 'item',
    url: '/thaprobane/admin',
    icon: icons.RiseOutlined,
    target: false,
    breadcrumbs: false
  }
];

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: localStorage?.getItem('userRole') === "ROLE.CUSTOMER" ? nonAdminPages : adminPages.children
  };

export default utilities;
