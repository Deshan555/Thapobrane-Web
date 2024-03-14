import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { apiExecutions } from '../../../api/api-call';
import '../../style.css';

  /*const apiCall = async () => {
    const response = await apiExecutions.authEmployee("john.doe@example5.com", "securePassword123");
    console.log(response);
  }*/

const AuthLogin = () => {
  const navigate = useNavigate();
  
  const authenticateDetails = async (email, password) => {
    try {
      const response = await apiExecutions.authEmployee(email, password);
      console.log(response);
      if (response !== null) {
        console.log(response);
        // Place the code that depends on the response here
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle any errors
    }
    
     /* if (response.success === true) {
        console.log('Employee Authenticated');
        navigate('/');
      } else {
        message.error('Authentication Failed for Employee');
      }*/
  }

  const onFinish = (values) => {
    console.log('Received values:', values);
    authenticateDetails(values.email, values.password);
  };


  return (
    <>
      <Form
        //name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
        >
          <Input prefix={<UserOutlined />} 
          placeholder="Email" 
          className='textStyles-small'
          style={{height: '35px'}}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} 
          className='textStyles-small'
          placeholder="Password" 
          style={{ height: '35px' }} />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle className='textStyles-small'>
            <Checkbox className='textStyles-small'>Remember me</Checkbox>
          </Form.Item>

          <a href="/forgot-password" style={{ float: 'right' }} className='textStyles-small'>
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className='textStyles-small'>
            Admin LogIn
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AuthLogin;
