import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col } from 'antd';
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
import { CSVLink, CSVDownload } from "react-csv";
import './style.css';
import { all } from '../../../node_modules/axios/index';

const VehicleModule = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [factoryList, setFactoryList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [infoMoadl, setInfoModal] = useState(false);

  const [getAllVehicles, setAllVehicles] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [getAllDrivers, setAllDrivers] = useState([]);
  const [getAllRoutes, setAllRoutes] = useState([]);


  useEffect(() => {
    //apiCall();
    fetchAllVehicles();
    fetchAllFactories();
    allDriversForMapping();
    getAllAvailableRoutes();
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

  const fetchAllFactories = async () => {
    const response = await apiExecutions.getAllFactories();
    if (response.success === true) {
      setFactoryList(response.data);
    } else {
      message.error('Failed to fetch factories');
    }
  }

    const fetchAllVehicles = async () => {
        const response = await apiExecutions.getAllVehicles();
        if (response !== null) {
            if (response.success === true) {
                setAllVehicles(response.data);
            } else {
                message.error('Failed to fetch vehicles');
            }
        }
    }

    const allDriversForMapping = async () => {
        const response = await apiExecutions.getAllDriversWithNoVehicleMappings();
        if (response !== null) {
            if (response.success === true) {
                setAllDrivers(response.data);
            } else {
                message.error('Failed to fetch drivers');
            }
        }
    } 

    const getAllAvailableRoutes = async () => {
        const response = await apiExecutions.getAllRoadRoutingsWithoutMappings();
        if (response !== null) {
            if (response.success === true) {
                setAllRoutes(response.data);
            } else {
                message.error('Failed to fetch routes');
            }
        }
    }

    // {
    //     "0": {
    //         "VehicleID": 398711975,
    //         "VehicleNumber": "675363CV",
    //         "VehicleType": "TRUCK",
    //         "VolumeCapacity": 100,
    //         "WeightCapacity": 5000,
    //         "NumberPlateID": "SL1234",
    //         "FactoryID": 1,
    //         "DriverID": 1,
    //         "RouteID": 393001318
    //     }
    // }


  const columns = [
    {
        title: <span className='textStyles-small'>Vehicle Master Number</span>,
        dataIndex: 'VehicleNumber',
        key: 'VehicleNumber',
        render: (value) => {
            return <span className='textStyle-small'>
                {value}
            </span>
        }
    },
    {
        title: <span className='textStyles-small'>Vehicle Type</span>,
        dataIndex: 'VehicleType',
        key: 'VehicleType',
        render: (value) => {
            return <span className='textStyle-small'>
                {value}
            </span>
        }
    },
    {
        title: <span className='textStyles-small'>Volume Capacity</span>,
        dataIndex: 'VolumeCapacity',
        key: 'VolumeCapacity',
        render: (value) => {
            return <span className='textStyle-small'>
                {value}
            </span>
        }
    },
    {
        title: <span className='textStyles-small'>Weight Capacity</span>,
        dataIndex: 'WeightCapacity',
        key: 'WeightCapacity',
        render: (value) => {
            return <span className='textStyle-small'>
                {value}
            </span>
        }
    },
    {
        title: <span className='textStyles-small'>Number Plate ID</span>,
        dataIndex: 'NumberPlateID',
        key: 'NumberPlateID',
        render: (value) => {
            return <span className='textStyle-small'>
                {value}
            </span>
        }
    },
    {
        title: <span className='textStyles-small'>Factory ID</span>,
        dataIndex: 'FactoryID',
        key: 'FactoryID',
        render: (value) => {
            return <span className='textStyle-small'>
                {value}
            </span>
        }
    },
    {
        title: <span className='textStyles-small'>Driver ID</span>,
        dataIndex: 'DriverID',
        key: 'DriverID',
        render: (value) => {
            return <span className='textStyle-small'>
                {value}
            </span>
        }
    },
    {
        title: <span className='textStyles-small'>Route ID</span>,
        dataIndex: 'RouteID',
        key: 'RouteID',
        render: (value) => {
            return <span className='textStyle-small'>
                {value}
            </span>
        }
    },

    // {
    //   title: <span className='textStyles-small'>Action</span>,
    //   key: 'action',
    //   render: (text, record) => (
    //     <Space size="middle">
    //       <a>
    //         <EyeOutlined
    //           style={{ color: 'blue' }}
    //           onClick={() => getCustomersByCustomerID(record.CustomerID, 'INFO')}
    //         />
    //       </a>
    //       <a>
    //         <EditOutlined
    //           style={{ color: 'blue' }}
    //           onClick={() => getCustomersByCustomerID(record.CustomerID, 'EDIT')}
    //         />
    //       </a>
    //       <a>
    //         <DeleteOutlined
    //           style={{ color: 'red' }}
    //           onClick={() => confirmationModelDelete(record.CustomerID)}
    //         />
    //       </a>
    //     </Space>
    //   ),
    // },
  ];

  const confirmationModelDelete = (fieldID) => {
    const { confirm } = Modal;
    confirm({
      title:
        "Are you sure you want to delete this customer?",
      onOk: async () => {
        deleteCustomerFunction(fieldID);
      },
      onCancel() { },
    });
  };

  const confirmationModelEdit = (fieldID, condition) => {
    const { confirm } = Modal;
    confirm({
      title: "Are you sure you want to edit this customer?",
      onOk: async () => {
        getCustomersByCustomerID(fieldID, condition);
      },
      onCancel() { },
    });
  };

  const confirmationRegisterCustomer = (data) => {
    const { confirm } = Modal;
    confirm({
      title: "Are you sure you want to register new customer?",
      onOk: async () => {
        registerCustomerFunction(data);
      },
      onCancel() { },
    });
  };

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
    console.log(values);
    if (isEdit === true) {
      const requestJson = {
        customerID: customerDetails?.CustomerID,
        customerName: values?.customerName,
        customerMobile: values?.customerMobile,
        customerAddress: values?.customerAddress,
        customerEmail: values?.customerEmail,
        customerType: 'ROLE.CUSTOMER',
        registrationDate: customerDetails?.RegistrationDate,
        factoryID: values?.factoryID,
        identitiCardNumber: values?.customerNIC
      }
      updateCustomerFunction(customerDetails?.CustomerID, requestJson);
      // confirmationModelEdit(customerDetails?.CustomerID, requestJson);
    } else {
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
      // confirmationRegisterCustomer(requestJson);
    }
  }

  const registerCustomerFunction = async (requestJson) => {
    const result = await apiExecutions.registerCustomer(requestJson);
    if (result !== null) {
      if (result.success === true) {
        message.success('Customer Registered Successfully');
        getAllCustomers();
        modelClose();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const updateCustomerFunction = async (customerID, requestJson) => {
    console.log(requestJson);
    const result = await apiExecutions.updateCustomerDetailsById(customerID, requestJson);
    if (result !== null) {
      if (result.success === true) {
        message.success('Customer Updated Successfully');
        getAllCustomers();
        modelClose();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const deleteCustomerFunction = async (customerID) => {
    const result = await apiExecutions.deleteCustomerAccount(customerID);
    if (result !== null) {
      if (result.success === true) {
        message.success('Customer Deleted Successfully');
        getAllCustomers();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const getCustomersByCustomerID = async (customerID, type) => {
    const fetchCustomerInfo = await apiExecutions.getCustomerByCustomerID(customerID);
    console.log(fetchCustomerInfo);
    if (fetchCustomerInfo !== null) {
      if (fetchCustomerInfo.success === true) {
        setCustomerDetails(fetchCustomerInfo?.data[0]);
        if (type === 'EDIT') {
          showModel(true);
        } else {
          showDetailsModel();
        }
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

  const showDetailsModel = () => {
    setInfoModal(true);
  }

  const modelCloseDetails = () => {
    setInfoModal(false);
  }

  return (
    <>
      <h1>
        Customers
      </h1>
      <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
        <Space>
          <div style={{ padding: 10, background: 'white', borderRadius: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Space align="end">
              <Input
                placeholder="Search employee"
                // onChange={(e) => filterByUserName(e.target.value)}
                suffix={<SearchOutlined />}
              />
              <Button type="primary" style={{ borderRadius: "50px" }}>
                <CloseCircleOutlined /> <span className='textStyle-small'>Export List</span>
              </Button>
              <Button type="primary"
                onClick={showModel}
                style={{ borderRadius: "50px" }}>
                <PlusOutlined /> <span className='textStyle-small'>New Employee</span>
              </Button>
            </Space>
          </div>
        </Space>
      </div>
      <Table
        dataSource={getAllVehicles}
        columns={columns}
        loading={getAllVehicles.length === 0 ? true : false}
        pagination={true}
      />

      <Modal
        title={
          <span className="textStyles-small" style={{ fontSize: 16 }}>
            Customer Details
          </span>
        }
        visible={infoMoadl}
        onOk={modelCloseDetails}
        onCancel={modelCloseDetails}
        footer={null}
        width={800}
      >
        <Descriptions
          bordered
          size="small"
          column={2}
        >
          <Descriptions.Item label="Customer Name" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.CustomerName}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Mobile" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.CustomerMobile}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Address" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.CustomerAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Email" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.CustomerEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Factory ID" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.FactoryID}
          </Descriptions.Item>
          <Descriptions.Item label="Customer NIC" className="textStyles-small" style={{ fontSize: 12 }}>
            {customerDetails?.IdentitiCardNumber}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        title={
          isEdit === true ? <span className='textStyles-small' style={{ fontSize: 16 }}>
            Edit Customer Details
          </span> :
            <span className='textStyles-small' style={{ fontSize: 16 }}>
              Register New Customer</span>
        }
        visible={isModalVisible}
        onOk={modelClose}
        onCancel={modelClose}
        footer={null}
        width={800}
      >
        <Form
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          className="textStyles-small"
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Customer Name</span>}
                name="customerName"
                rules={[{ required: true, message: 'Please input customer name!' }]}
                initialValue={customerDetails?.CustomerName}
                style={{ width: '90%' }}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="textStyles-small">Customer Mobile</span>}
                name="customerMobile"
                rules={[{ required: true, message: 'Please input customer mobile!' },
                { pattern: new RegExp(/^[0-9\b]+$/), message: 'Please enter only number' },
                { max: 10, message: 'Please enter 10 digit number' },
                { min: 10, message: 'Please enter 10 digit number' }]}
                initialValue={customerDetails?.CustomerMobile}
                style={{ width: '90%' }}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
          </Row>

          {/* VehicleNumber,
            VehicleType,
            VolumeCapacity,
            WeightCapacity,
            NumberPlateID,
            FactoryID,
            DriverID,
            RouteID */}

                  <Row>
                      <Col span={12}>
                          <Form.Item
                              label={<span className="textStyles-small">Vehicle Number</span>}
                              name="VehicleNumber"
                              rules={[{ required: true, message: 'Please input vehicle number!' }]}
                              initialValue={vehicleDetails?.VehicleNumber}
                              style={{ width: '90%' }}
                          >
                              <Input type="text" />
                          </Form.Item>
                      </Col>
                      <Col span={12}>
                          <Form.Item
                              label={<span className="textStyles-small">Vehicle Type</span>}
                              name="VehicleType"
                              rules={[{ required: true, message: 'Please input vehicle type!' }]}
                              initialValue={vehicleDetails?.VehicleType}
                              style={{ width: '90%' }}
                          >
                              <Input type="text" />
                          </Form.Item>
                      </Col>
                  </Row>

                  <Row>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Volume Capacity</span>}
                                name="VolumeCapacity"
                                rules={[{ required: true, message: 'Please input volume capacity!' }]}
                                initialValue={vehicleDetails?.VolumeCapacity}
                                style={{ width: '90%' }}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Weight Capacity</span>}
                                name="WeightCapacity"
                                rules={[{ required: true, message: 'Please input weight capacity!' }]}
                                initialValue={vehicleDetails?.WeightCapacity}
                                style={{ width: '90%' }}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                  </Row>

                  <Row>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Number Plate ID</span>}
                                name="NumberPlateID"
                                rules={[{ required: true, message: 'Please input number plate ID!' }]}
                                initialValue={vehicleDetails?.NumberPlateID}
                                style={{ width: '90%' }}
                            >
                                <Input type="text" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Factory ID</span>}
                                name="FactoryID"
                                rules={[{ required: true, message: 'Please input factory ID!' }]}
                                initialValue={vehicleDetails?.FactoryID}
                                style={{ width: '90%' }}
                            >
                                <Select
                                    placeholder="Select Factory"
                                    allowClear
                                >
                                    {
                                        factoryList.map((item, index) => {
                                            return <Select.Option key={index} value={item.FactoryID}>{item.FactoryName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Driver ID</span>}
                                name="DriverID"
                                rules={[{ required: true, message: 'Please input driver ID!' }]}
                                initialValue={vehicleDetails?.DriverID}
                                style={{ width: '90%' }}
                            >
                                <Select
                                    placeholder="Select Driver"
                                    allowClear
                                >
                                    {
                                        getAllDrivers?.map((item, index) => {
                                            return <Select.Option key={index} value={item.EmployeeID}>{item.EmployeeName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Route ID</span>}
                                name="RouteID"
                                rules={[{ required: true, message: 'Please input route ID!' }]}
                                initialValue={vehicleDetails?.RouteID}
                                style={{ width: '90%' }}
                            >
                                <Select
                                    placeholder="Select Route"
                                    allowClear
                                >
                                    {
                                        getAllRoutes?.map((item, index) => {
                                            return <Select.Option key={index} value={item.RoutingID}>{item.RoutingID}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>




          <Row>
            <Button
              type="primary"
              htmlType="submit"
              style={{ borderRadius: "10px" }}
              className="textStyles-small"
            >
              {
                isEdit === true ? 'Update Customer' : 'Register Customer'
              }
            </Button>

            <Button
              type="danger"
              style={{ borderRadius: "10px", borderColor: 'gray', width: 150, marginLeft: 10 }}
              className="textStyles-small"
              onClick={modelClose}
            >
              Cancel
            </Button>
          </Row>

        </Form>
      </Modal>
    </>
  )
}

export default VehicleModule;