// assets
import { MonitorOutlined, LoginOutlined, ProfileOutlined, CarOutlined, FieldTimeOutlined, CodeOutlined, CloudDownloadOutlined, CloudUploadOutlined, ExperimentOutlined, AppstoreAddOutlined, TrophyOutlined, UserOutlined, TeamOutlined, SolutionOutlined, NodeIndexOutlined, NumberOutlined, EnvironmentOutlined } from '@ant-design/icons';

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
  MonitorOutlined
};
// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    // {
    //   id: 'util-typography',
    //   title: 'Typography',
    //   type: 'item',
    //   url: '/typography',
    //   icon: icons.FontSizeOutlined
    // },
    // {
    //   id: 'util-color',
    //   title: 'Color',
    //   type: 'item',
    //   url: '/color',
    //   icon: icons.BgColorsOutlined
    // },
    // {
    //   id: 'util-shadow',
    //   title: 'Shadow',
    //   type: 'item',
    //   url: '/shadow',
    //   icon: icons.BarcodeOutlined
    // },
    // {
    //   id: 'ant-icons',
    //   title: 'Ant Icons',
    //   type: 'item',
    //   url: '/icons/ant',
    //   icon: icons.AntDesignOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id : 'loading-icons',
    //   title: 'Loading Icons',
    //   type: 'item',
    //   url: '/icons/loading',
    //   icon: icons.LoadingOutlined,
    //   breadcrumbs: true
    // }
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
    {
      id: 'versionsInfo',
      title: 'Versions Info',
      type: 'item',
      url: '/thaprobane/versions-info',
      icon: icons.CodeOutlined,
      target: false,
      breadcrumbs: false
    }
  ]
};

export default utilities;
