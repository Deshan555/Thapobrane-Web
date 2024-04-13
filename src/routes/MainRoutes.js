import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const FileUploader = Loadable(lazy(() => import('pages/import-wiz/ImportModule')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// render - vehicleModule
const VehicleList = Loadable(lazy(() => import('pages/vehicleModule/VehicleModule')));
const JobsList = Loadable(lazy(() => import('pages/vehicleModule/JobsModule')));
const Customers = Loadable(lazy(() => import('pages/vehicleModule/Customers')));
const RoutesModule = Loadable(lazy(() => import('pages/vehicleModule/RoutesModule')));
const History = Loadable(lazy(() => import('pages/vehicleModule/History')));
const FieldManagement = Loadable(lazy(() => import('pages/vehicleModule/FieldManagement')));
const EnvironmentalZone = Loadable(lazy(() => import('pages/vehicleModule/EnvironmentalZones')));
const DailyTeaCollection = Loadable(lazy(() => import('pages/vehicleModule/DailyTeaCollection')));

const MasterData = Loadable(lazy(() => import('pages/vehicleModule/MasterData')));
const VersionsInfo = Loadable(lazy(() => import('pages/vehicleModule/VersionsInfo')));
const Exports = Loadable(lazy(() => import('pages/vehicleModule/Exports')));
const DataImporter = Loadable(lazy(() => import('pages/vehicleModule/DataImporter')));
const Import = Loadable(lazy(() => import('pages/vehicleModule/DataImport')));
const Fertilizers = Loadable(lazy(() => import('pages/vehicleModule/Fertilizers')));
const Admin = Loadable(lazy(() => import('pages/vehicleModule/Admin')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        },
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    },
    {
      path: '/data/import',
      element: <FileUploader />
    },
    {
      path: '/optimizer/vehicles',
      element: <VehicleList />
    },
    {
      path: '/optimizer/jobs',
      element: <JobsList />
    }
    ,
    {
      path: '/thaprobane/customers',
      element: <Customers />
    },
    {
      path: '/optimizer/routes',
      element: <RoutesModule />
    },
    {
      path: '/thaprobane/timeline',
      element: <History />
    },
    {
      path: '/thaprobane/field-management',
      element: <FieldManagement />
    },
    {
      path: '/thaprobane/environmental-zones',
      element: <EnvironmentalZone />
    },
    {
      path: '/thaprobane/daily-collection',
      element: <DailyTeaCollection />
    },
    {
      path: '/thaprobane/master-data',
      element: <MasterData />
    },
    {
      path: '/thaprobane/versions-info',
      element: <VersionsInfo />
    },
    {
      path: '/thaprobane/exports',
      element: <Exports />
    },
    {
      path: '/thaprobane/data-importer',
      element: <DataImporter />
    },
    {
      path: '/thaprobane/data-import',
      element: <Import />
    },
    {
      path: '/thaprobane/fertilizers',
      element: <Fertilizers />
    },
    {
      path: '/thaprobane/admin',
      element: <Admin />
    }
  ]
};

export default MainRoutes;
