import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col} from 'antd';
import {
    MailOutlined,
    DeleteOutlined,
    PhoneOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    EyeOutlined,
  } from '@ant-design/icons';
import { number } from 'prop-types';


const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [factoryList, setFactoryList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        //apiCall();
        getAllCustomers();
        fetchAllFactories();
        // authenticationCheck();
    }, []);

    // const authenticationCheck = async () => {
    //   navigate('/');
    //   const accessTokenExpireDate = localStorage.getItem('atokenExpireDate'); 
    //   const refreshTokenExpireDate = localStorage.getItem('rtokenExpireDate');
    //   const userRole = localStorage.getItem('userRole');
    //   const accessToken = localStorage.getItem('atoken');
    //   const refreshToken = localStorage.getItem('rtoken');

    //   if (accessTokenExpireDate !== null && refreshTokenExpireDate !== null && userRole !== null && accessToken !== null && refreshToken !== null) {
    //     const currentDate = new Date();
    //     const accessTokenExpire = new Date(accessTokenExpireDate);
    //     const refreshTokenExpire = new Date(refreshTokenExpireDate);
    //     if (currentDate < accessTokenExpire && currentDate < refreshTokenExpire) {
    //       console.log('User Authenticated');
    //     } else {
    //       navigate('/login');
    //     }
    //   } else {
    //     navigate('/login');
    //   }
    // }

    // sample login auth 
    const apiCall = async () => {
        const response = await apiExecutions.authEmployee("john.doe@example5.com", "securePassword123");
        console.log(response);
      }
    
    const getAllCustomers = async () => {
        console.log('getAllCustomers-----------------------------------------------------------');
        const customers = await apiExecutions.getAllCustomers();
        console.log(customers);
        setCustomers(customers?.data);
    }

    const fetchAllFactories = async () => {
      const response = await apiExecutions.getAllFactories();
      if (response.success === true) {
        setFactoryList(response.data);
      } else {
        message.error('Failed to fetch factories');
      }
    }
  


    /*
          "CustomerID": 629,
      "CustomerName": "Eva Wilson",
      "CustomerMobile": "6789012345",
      "CustomerAddress": "303 Maple St, Suburbia",
      "CustomerEmail": "eva.wilson@example.com",
      "CustomerType": "",
      "RegistrationDate": "2023-11-30T18:30:00.000Z",
      "Password": "$2b$10$YYXdHq3BDWaPtOQZ6dQZf.8DfMUA2WRwAAAi93lKLelzk9urRv5jO",
      "FactoryID": 6,
      "IdentitiCardNumber": null
      */

    const columns = [
        {
            title : 'CustomerID',
            dataIndex : 'CustomerID',
            key : 'CustomerID',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        {
            title : 'CustomerName',
            dataIndex : 'CustomerName',
            key : 'CustomerName',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        {
            title : 'CustomerMobile',
            dataIndex : 'CustomerMobile',
            key : 'CustomerMobile',
            render: (number) => {
                return (
                    <a href={`tel:${number}`}>
                      <b>
                        <PhoneOutlined /> {number}
                      </b>
                    </a>
                );
            }
        },
        {
            title : 'CustomerEmail',
            dataIndex : 'CustomerEmail',
            key : 'CustomerEmail',
            render: (email) => {
                return (
                    <a href={`mailto:${email}`}>
                      <b>
                        <MailOutlined /> {email}
                      </b>
                    </a>
                );
            }
        },
        {
            title : 'CustomerAddress',
            dataIndex : 'CustomerAddress',
            key : 'CustomerAddress',
            render: (address) => {
                return <b>{address}</b>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Space size="middle">
                <a>
                  <EyeOutlined
                    style={{ color: 'blue' }}
                    //onClick={() => showDetailsModel(record)}
                  />
                </a>
                <a>
                  <EditOutlined
                    style={{ color: 'blue' }}
                    onClick={() => getCustomersByCustomerID(record.CustomerID)}
                  />
                </a>
                <a>
                  <DeleteOutlined
                    style={{ color: 'red' }}
                  />
                </a>
              </Space>
            ),
          },
    ];

    const randomPassword = () => {
      const length = 8;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let retVal = "";
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    }

    const onFinish = (values) => {
      const requestJson = {
        customerName: values?.customerName,
        customerMobile: values?.customerMobile,
        customerAddress: values?.customerAddress,
        customerEmail: values?.customerEmail,
        customerType: 'ROLE.CUSTOMER',
        customerPassword: randomPassword(),
        factoryID: values?.factoryID,
        customerNIC: values?.customerNIC
      }
      registerCustomerFunction(requestJson);
    }

    const registerCustomerFunction = async (requestJson) => {
      const result = await apiExecutions.registerCustomer(requestJson);
      if (result !== null) {
        if (result.success === true) {
          message.success('Customer Registered Successfully');
          getAllCustomers();
        } else {
          message.error('Failed To Register Customer');
        }
      }
    }

    const getCustomersByCustomerID = async (customerID) => {
      const fetchCustomerInfo = await apiExecutions.getCustomerByCustomerID(customerID);
      console.log(fetchCustomerInfo);
      if (fetchCustomerInfo !== null) {
        if (fetchCustomerInfo.success === true) {
          setCustomerDetails(fetchCustomerInfo?.data[0]);
          showModel(true);
        } else {
          message.error('Failed to fetch customer details');
        }
      }
    }

    const modelClose = () => {
      setIsModalVisible(false);
      setIsEdit(false);
    }

    const showModel = (editTrue) => {
      setIsModalVisible(true);
      setIsEdit(editTrue);
    }

    return (
        <>
        <h1>
            Customers
        </h1>
        <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
        <Space>
          <div style={{ padding: 10, background: 'white', borderRadius: 10,  display: 'flex', justifyContent: 'flex-end'}}>
            <Space align="end">
              <Input
                placeholder="Search employee"
                // onChange={(e) => filterByUserName(e.target.value)}
                suffix={<SearchOutlined />}
              />
              <Button type="primary" style={{ borderRadius: "50px"}}>
                <CloseCircleOutlined /> <span className='textStyle-small'>Export List</span>
              </Button>
              <Button type="primary" 
              onClick={showModel} 
              style={{ borderRadius: "50px"}}>
                <PlusOutlined /> <span className='textStyle-small'>New Employee</span>
              </Button>
            </Space>
          </div>
        </Space>
      </div>
        <Table 
        dataSource={customers} 
        columns={columns}
        loading={customers?.length === 0}
        pagination={true}
        />

        <Modal
        title={
          isEdit === true ? <span>
            Edit Customer Details
          </span> : <span> Register New Customer</span>
        }
        visible={isModalVisible}
        onOk={modelClose}
        onCancel={modelClose}
        footer={null}
        >
          <Form
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
          >
          <Row>
            <Col span={12}>
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[{ required: true, message: 'Please input customer name!' }]}
                initialValue={customerDetails?.CustomerName}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Customer Mobile"
                name="customerMobile"
                rules={[{ required: true, message: 'Please input customer mobile!' },
                { pattern: new RegExp(/^[0-9\b]+$/), message: 'Please enter only number' },
                { max: 10, message: 'Please enter 10 digit number' },
                { min : 10, message: 'Please enter 10 digit number' }]}
                initialValue={customerDetails?.CustomerMobile}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                label="Customer Address"
                name="customerAddress"
                rules={[{ required: true, message: 'Please input customer address!' }]}
                initialValue={customerDetails?.CustomerAddress}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Customer Email"
                name="customerEmail"
                rules={[{ required: true, message: 'Please input customer email!' },
                { type: 'email', message: 'Please enter valid email' }]}
                initialValue={customerDetails?.CustomerEmail}
              >
                <Input type="email" />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row>
            <Col span={12}>
              <Form.Item
                label="Customer Type"
                name="customerType"
                rules={[{ required: true, message: 'Please input customer type!' }]}
              >
                <Select>
                  <Select.Option value="1">Admin</Select.Option>
                  <Select.Option value="2">User</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Customer Password"
                name="customerPassword"
                rules={[{ required: true, message: 'Please input customer password!' }]}
              >
                <Input type="password" />
              </Form.Item>
            </Col>
          </Row> */}

          <Row>
            <Col span={12}>
              <Form.Item
                label="Factory ID"
                name="factoryID"
                rules={[{ required: true, message: 'Please input factory ID!' }]}
                initialValue={customerDetails?.FactoryID}
              >
                <Select
                  showSearch
                  placeholder="Select a factory"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  >
                  {factoryList.map((factory) => (
                    <Select.Option key={factory.FactoryID} value={factory.FactoryID}>
                      {factory.FactoryName}
                    </Select.Option>
                  ))}
                  </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Customer NIC"
                name="customerNIC"
                rules={[{ required: true, message: 'Please input customer NIC!' }]}
                initialValue={customerDetails?.IdentitiCardNumber}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: "10px" }}
            >
              Register Customer
            </Button>
          </Row>
          
          </Form>
        </Modal>
      </>
    )
}

export default Customers;