import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { 
  RiseOutlined, 
  FallOutlined,
  GiftOutlined,
  ShoppingCartOutlined,
  AppleFilled,
  AttachMoneyOutlined, 
  TeamOutlined,
  TruckOutlined,
  EnvironmentOutlined,
  PartitionOutlined,
  CarOutlined
} from '@ant-design/icons';

const AnalyticEcommerce = ({ color, title, count, percentage, isLoss, extra, icon }) => (
  <MainCard contentSX={{ p: 2.25 }}>
    <Stack spacing={0.2}>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" color="inherit">
            {count}
          </Typography>
        </Grid>
        <Grid item>
          {
            icon === 'customers' ? (
              <div style={{ backgroundColor: '#e6f4ff', borderRadius: '50%', padding: '0.5rem', width: '40px', height: '40px' }}>
                <TeamOutlined style={{ fontSize: '1.5rem', color: '#003eb3' }} />
              </div>
            ) : null
          }
          {
            icon === 'fields' ? (
              <div style={{ backgroundColor: '#d9f7be', borderRadius: '50%', padding: '0.5rem', width: '40px', height: '40px' }}>
                <EnvironmentOutlined style={{ fontSize: '1.5rem', color: '#237804' }} />
              </div>
            ) : null
          }
          {
            icon === 'routes' ? (
              <div style={{ backgroundColor: '#ffd6e7', borderRadius: '50%', padding: '0.5rem', width: '40px', height: '40px' }}>
                <PartitionOutlined style={{ fontSize: '1.5rem', color: '#c41d7f' }} />
              </div>
            ) : null
          }
          {
            icon === 'vehicles' ? (
              <div style={{ backgroundColor: '#d3adf7', borderRadius: '50%', padding: '0.5rem', width: '40px', height: '40px' }}>
                <CarOutlined style={{ fontSize: '1.5rem', color: '#531dab' }} />
              </div>
            ) : null
          }
        </Grid>
      </Grid>
    </Stack>
  </MainCard>
);

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  icon: PropTypes.string,
  extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

AnalyticEcommerce.defaultProps = {
  color: 'primary'
};

export default AnalyticEcommerce;
