import { useNavigate } from 'react-router-dom';

const authCheckMachanisam = () => {
  const navigate = useNavigate();

  const accessTokenExpireDate = localStorage.getItem('atokenExpireDate');
  const refreshTokenExpireDate = localStorage.getItem('rtokenExpireDate');
  const userRole = localStorage.getItem('userRole');
  const accessToken = localStorage.getItem('atoken');
  const refreshToken = localStorage.getItem('rtoken');

  if (
    accessTokenExpireDate !== null &&
    refreshTokenExpireDate !== null &&
    userRole !== null &&
    accessToken !== null &&
    refreshToken !== null
  ) {
    const currentDate = new Date();
    const accessTokenExpire = new Date(accessTokenExpireDate);
    const refreshTokenExpire = new Date(refreshTokenExpireDate);
    if (currentDate < accessTokenExpire && currentDate < refreshTokenExpire) {
      console.log('User Authenticated');
    } else {
      navigate('/login');
    }
  } else {
    navigate('/login');
  }
};

export {authCheckMachanisam};
