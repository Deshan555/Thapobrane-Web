import { useEffect, useState } from 'react';
import { apiExecutions } from '../../api/api-call';
import { ShoppingOutlined } from '@ant-design/icons';
import { Card, Col, Row, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// project import
import OrdersTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import SalesColumnChart from './SalesColumnChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// import custom charts
import LineChart from 'pages/charts/LineChart';
import HorizontalBarChart from 'pages/charts/HorizontalBarChart';
import AreaChart from 'pages/charts/AreaChart';
import RadarChart from 'pages/charts/RaderChart';
import PieChart from 'pages/charts/PieChart';
import PendingPaymentTable from 'pages/charts/PendingPaymentTable';
import DualBarChart from 'pages/charts/DualBarChart';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// sales report status
const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];



// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [value, setValue] = useState('today');
  const [slot, setSlot] = useState('week');

  const [weeklyWiseCollection, setWeeklyWiseCollection] = useState([]);
  const [lastWeekCollection, setLastWeekCollection] = useState([]);
  const [chartNameCollection, setChartNameCollection] = useState('week');
  const [dashStatus, setDashStatusCount] = useState([]);
  const [routingWiseCollection, setRoutingWiseCollection] = useState([]);
  const [EnvironmentalZones, setEnvironmentalZones] = useState([]);
  const [showRoutingViseCollection, setShowRoutingViseCollection] = useState(false);
  useEffect(() => {
    fetchWeeklyCollectionSum();
    fetchLastWeekCollectionSum();
    fetchDashboardsStatus();
    fetchRoutingWiseCollectionSum();
    fetchAllEnvironmentalZones();
  }, []);

  const fetchAllEnvironmentalZones = async () => {
      const response = await apiExecutions.getAllEnvironmentZoneInfo();
      if (response !== null) {
          if (response.success === true) {
              setEnvironmentalZones(response.data);
          }
      }
  }

  const fetchRoutingWiseCollectionSum = async () => {
    setShowRoutingViseCollection(false);
    const startDate = new Date().toISOString().split('T')[0];
    const response = await apiExecutions.getCollectionRouteWise(startDate);
    if (response !== null) {
      if (response.success === true) {
        setRoutingWiseCollection(response?.data);
        setShowRoutingViseCollection(true);
      }
    }
  }

  const fetchDashboardsStatus = async () => {
    const response = await apiExecutions.getDashboardStats();
    if (response !== null) {
      if (response.success === true) {
        setDashStatusCount(response?.data);
      }
    }
  }

  const fetchWeeklyCollectionSum = async () => {
    const requestJson = {
      startDate: new Date().toISOString().split('T')[0],
      numOfDays: 7
    }
    const response = await apiExecutions.getBulkSumOfTeaCollection(requestJson);
    if (response !== null) {
      if (response.success === true) {
        setWeeklyWiseCollection(response?.data);
      }
    }
  }

  const fetchLastWeekCollectionSum = async () => {
    const requestJson = {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      numOfDays: 7
    };
    const response = await apiExecutions.getBulkSumOfTeaCollection(requestJson);
    if (response !== null) {
      if (response.success === true) {
        setLastWeekCollection(response?.data);
      }
    }
  }

const locations = EnvironmentalZones.map((zone) => {
    const [latitude, longitude] = zone.BaseLocation.split(',').map(Number);
    return {
        name: zone.ZoneName,
        coordinates: [latitude, longitude]
    };
});

const mapContainerStyle = {
  width: '100%',
  height: '58vh',
  zIndex: 1,
  borderRadius: '10px',
};
const customIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


  return (
    <>
      <h1 className="headingStyle2">Dashboard</h1>
      <Breadcrumb
        size="small"
        className="textStyle-small"
        style={{ marginBottom: 20 }}
        items={[
          {
            href: '/free',
            title: <HomeOutlined />,
          },
          {
            title: (
              <>
                <span>Navigation</span>
              </>
            ),
          },
          {
            href: '',
            title: 'Dashboard'
          },
        ]}
      />
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {
          dashStatus?.length > 0 ? (
            <>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce
                  title={<span className='textStyles-small' style={{ fontSize: '13px' }}>
                    Number Of Customers</span>}
                  count={dashStatus[0]?.row_count ? dashStatus[0]?.row_count : 0}
                  icon='customers' />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce
                  title={<span className='textStyles-small' style={{ fontSize: '13px' }}>
                    Number Of Fields</span>}
                  count={dashStatus[1]?.row_count ? dashStatus[1]?.row_count : 0}
                  icon='fields' />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce
                  title={<span className='textStyles-small' style={{ fontSize: '13px' }}>
                    Number Of Vehicles</span>}
                  count={dashStatus[3]?.row_count ? dashStatus[3]?.row_count : 0}
                  icon='vehicles' />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce
                  title={<span className='textStyles-small' style={{ fontSize: '13px' }}>
                    Number Of Routes</span>}
                  count={dashStatus[4]?.row_count ? dashStatus[4]?.row_count : 0}
                  icon='routes' />
              </Grid>
            </>

          ) : null
        }

        <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

        {/* row 2 */}
        {/* <Grid item xs={12} md={7} lg={8}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Unique Visitor</Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button
                  size="small"
                  onClick={() => setSlot('month')}
                  color={slot === 'month' ? 'primary' : 'secondary'}
                  variant={slot === 'month' ? 'outlined' : 'text'}
                >
                  Month
                </Button>
                <Button
                  size="small"
                  onClick={() => setSlot('week')}
                  color={slot === 'week' ? 'primary' : 'secondary'}
                  variant={slot === 'week' ? 'outlined' : 'text'}
                >
                  Week
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
              <IncomeAreaChart slot={slot} />
            </Box>
          </MainCard>
        </Grid> */}
        {/* <Grid item xs={12} md={5} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Income Overview</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <Box sx={{ p: 3, pb: 0 }}>
              <Stack spacing={2}>
                <Typography variant="h6" color="textSecondary">
                  This Week Statistics
                </Typography>
                <Typography variant="h3">$7,650</Typography>
              </Stack>
            </Box>
            <MonthlyBarChart />
          </MainCard>
        </Grid> */}


        <Grid item xs={12} md={7} lg={8}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" className="textStyle3">
                Weekly Tea Leaves Collection
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button
                  size="small"
                  className="textStyles-small"
                  onClick={() => setChartNameCollection("month")}
                  color={chartNameCollection === 'month' ? 'primary' : 'secondary'}
                  variant={chartNameCollection === 'month' ? 'outlined' : 'text'}
                >
                  Last Week
                </Button>
                <Button
                  size="small"
                  style={{ marginLeft: '10px' }}
                  className="textStyles-small"
                  onClick={() => setChartNameCollection("week")}
                  color={chartNameCollection === 'week' ? 'primary' : 'secondary'}
                  variant={chartNameCollection === 'week' ? 'outlined' : 'text'}
                >
                  This Week
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <MainCard content={false} sx={{ mt: 1.5 }}>
            <Box sx={{ pt: 1, pr: 2 }}>
              {
                chartNameCollection === 'week' ? (
                  weeklyWiseCollection.length > 0 ? (
                    <LineChart
                      xValues={weeklyWiseCollection.map((item) => item.date)}
                      data={weeklyWiseCollection.map((item) => ({ x: item.date, y: item.sum }))}
                    />
                  ) : (<></>)
                ) : null
              }
              {
                chartNameCollection === 'month' ? (
                  lastWeekCollection.length > 0 ? (
                    <LineChart
                      xValues={lastWeekCollection.map((item) => item.date)}
                      data={lastWeekCollection.map((item) => ({ x: item.date, y: item.sum }))}
                    />
                  ) : (<></>)
                ) : null
              }
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={5} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Zone Map</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MapContainer center={[7.8731, 80.7718]} zoom={7} style={mapContainerStyle}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location, index) => (
              <Marker
                key={index}
                position={location.coordinates}
                icon={customIcon} // Set the custom marker icon
              >
                <Popup>{location.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </Grid>

        <Grid item xs={12} md={5} lg={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" className='textStyle3'>
                Routing Wise Collection
              </Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            {/* {
              routingWiseCollection?.length > 0 ? (
                <PieChart
                  categories={routingWiseCollection?.map((item) => item?.RouteID)}
                  data={routingWiseCollection?.map((item) => item?.TotalTeaWeight)}
                />
              ) : null
            } */}
                    {
          showRoutingViseCollection ? (
            <DualBarChart
            categories={routingWiseCollection?.map((item) => item?.RouteID)}
            collectioX={routingWiseCollection?.map((item) => item?.TotalTeaWeight)}
              horizontalx={true}
              xTitle='Daily Collection In Kg'
              yTitle='Route ID'
            />
          ) : null
        }
          </MainCard>
        </Grid>

        {/* row 3 */}
        <Grid item xs={12} md={7} lg={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" className='textStyle3'>
                 Pending Payments
              </Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            {/* <OrdersTable /> */}
            <PendingPaymentTable/>
          </MainCard>
        </Grid>




        {/* <Grid item xs={12} md={5} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Analytics Report</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
              <ListItemButton divider>
                <ListItemText primary="Company Finance Growth" />
                <Typography variant="h5">+45.14%</Typography>
              </ListItemButton>
              <ListItemButton divider>
                <ListItemText primary="Company Expenses Ratio" />
                <Typography variant="h5">0.58%</Typography>
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Business Risk Cases" />
                <Typography variant="h5">Low</Typography>
              </ListItemButton>
            </List>
            <ReportAreaChart />
          </MainCard>
        </Grid> */}

        {/* row 4
        <Grid item xs={12} md={7} lg={8}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Sales Report</Typography>
            </Grid>
            <Grid item>
              <TextField
                id="standard-select-currency"
                size="small"
                select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
              >
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <MainCard sx={{ mt: 1.75 }}>
            <Stack spacing={1.5} sx={{ mb: -12 }}>
              <Typography variant="h6" color="secondary">
                Net Profit
              </Typography>
              <Typography variant="h4">$1560</Typography>
            </Stack>
            <SalesColumnChart />
          </MainCard>
        </Grid> */}
        {/* <Grid item xs={12} md={5} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Transaction History</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <List
              component="nav"
              sx={{
                px: 0,
                py: 0,
                '& .MuiListItemButton-root': {
                  py: 1.5,
                  '& .MuiAvatar-root': avatarSX,
                  '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                }
              }}
            >
              <ListItemButton divider>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: 'success.main',
                      bgcolor: 'success.lighter'
                    }}
                  >
                    <GiftOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $1,430
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      78%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
              <ListItemButton divider>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: 'primary.main',
                      bgcolor: 'primary.lighter'
                    }}
                  >
                    <MessageOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $302
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      8%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: 'error.main',
                      bgcolor: 'error.lighter'
                    }}
                  >
                    <SettingOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $682
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      16%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
            </List>
          </MainCard>
          <MainCard sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack>
                    <Typography variant="h5" noWrap>
                      Help & Support Chat
                    </Typography>
                    <Typography variant="caption" color="secondary" noWrap>
                      Typical replay within 5 min
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                    <Avatar alt="Remy Sharp" src={avatar1} />
                    <Avatar alt="Travis Howard" src={avatar2} />
                    <Avatar alt="Cindy Baker" src={avatar3} />
                    <Avatar alt="Agnes Walker" src={avatar4} />
                  </AvatarGroup>
                </Grid>
              </Grid>
              <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
                Need Help?
              </Button>
            </Stack>
          </MainCard>
        </Grid> */}
      </Grid>
    </>
  );
};

export default DashboardDefault;
