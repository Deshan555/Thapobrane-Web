import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb } from 'antd';
import {
  MailOutlined,
  DeleteOutlined,
  PhoneOutlined,
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  HomeOutlined
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

    {
      title: <span className='textStyles-small'>Action</span>,
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>
            <EyeOutlined
              style={{ color: 'blue' }}
              onClick={() => getVehicleDetailsByIDFunction(record.VehicleID, 'VIEW')}
            />
          </a>
          <a>
            <EditOutlined
              style={{ color: 'blue' }}
              onClick={() => getVehicleDetailsByIDFunction(record.VehicleID, 'EDIT')}
            />
          </a>
          <a>
            <DeleteOutlined
              style={{ color: 'red' }}
              onClick={() => deleteVehicleByID(record.VehicleID)}
            />
          </a>
        </Space>
      ),
    },
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
    // {
    //   "VehicleNumber": "kl;l;k;k;lkl;",
    //   "VehicleType": "333",
    //   "VolumeCapacity": "33",
    //   "WeightCapacity": "33",
    //   "NumberPlateID": "jojlkjljljlkljk",
    //   "FactoryID": 1,
    //   "DriverID": 10001,
    //   "RouteID": 393001318
    // }

    if (isEdit !== true) {
      const requestJson = {
        VehicleNumber: values.VehicleNumber,
        VehicleType: values.VehicleType,
        VolumeCapacity: values.VolumeCapacity,
        WeightCapacity: values.WeightCapacity,
        NumberPlateID: values.NumberPlateID,
        FactoryID: values.FactoryID,
        DriverID: values.DriverID,
        RouteID: values.RouteID
      }

      registerNewVehicle(requestJson);
    } else {
      const requestBody = {
        VehicleNumber: values.VehicleNumber,
        VehicleType: values.VehicleType,
        VolumeCapacity: values.VolumeCapacity,
        WeightCapacity: values.WeightCapacity,
        NumberPlateID: values.NumberPlateID,
        FactoryID: values.FactoryID,
        DriverID: values.DriverID,
        RouteID: values.RouteID
      }
      updateVehicleFunction(vehicleDetails?.VehicleID, requestBody);
    }
  }

  const registerNewVehicle = async (requestJson) => {
    const result = await apiExecutions.addVehicle(requestJson);
    if (result !== null) {
      if (result.success === true) {
        message.success('Vehicle Registered Successfully');
        fetchAllVehicles();
        modelClose();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const updateVehicleFunction = async (vehicleID, requestJson) => {
    const result = await apiExecutions.updateVehicleDetailsByID(vehicleID, requestJson);
    if (result !== null) {
      if (result.success === true) {
        message.success('Vehicle Updated Successfully');
        fetchAllVehicles();
        modelClose();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const deleteVehicleByID = async (vehicleID) => {
    const result = await apiExecutions.deleteVehicleByID(vehicleID);
    if (result !== null) {
      if (result.success === true) {
        message.success('Vehicle Deleted Successfully');
        fetchAllVehicles();
      } else {
        message.error('Error : ' + result.message);
      }
    }
  }

  const getVehicleDetailsByIDFunction = async (vehicleID, type) => {
    const fetchVehicleInfo = await apiExecutions.getVehicleDetailsByID(vehicleID);
    console.log(fetchVehicleInfo);
    if (fetchVehicleInfo !== null) {
      if (fetchVehicleInfo.success === true) {
        setVehicleDetails(fetchVehicleInfo?.data[0]);
        if (type === 'EDIT') {
          showModel(true);
        } else {
          showDetailsModel();
        }
      } else {
        message.error('Failed to fetch vehicle details');
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
      <h1 className="headingStyle2">Vehicles Management</h1>
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
                <span>Management</span>
              </>
            ),
          },
          {
            href: '',
            title: 'Vehicles Management',
          },
        ]}
      />
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
                <PlusOutlined /> <span className='textStyle-small'>New Vehicle</span>
              </Button>
            </Space>
          </div>
        </Space>
      </div>

      <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
        <Table
          dataSource={getAllVehicles}
          columns={columns}
          loading={getAllVehicles.length === 0 ? true : false}
          pagination={true}
          size="small"
        />
      </div>


      <Modal
        title={
          <span className="textStyles-small" style={{ fontSize: 16 }}>
            Vehicle Details - VID{vehicleDetails?.VehicleID}
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
          style={{ marginTop: 20 }}
        >
          <Descriptions.Item label="Vehicle Number" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.VehicleNumber}</Descriptions.Item>
          <Descriptions.Item label="Vehicle Type" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.VehicleType}</Descriptions.Item>
          <Descriptions.Item label="Volume Capacity" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.VolumeCapacity}</Descriptions.Item>
          <Descriptions.Item label="Weight Capacity" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.WeightCapacity}</Descriptions.Item>
          <Descriptions.Item label="Number Plate ID" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.NumberPlateID}</Descriptions.Item>
          <Descriptions.Item label="Factory ID" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.FactoryID}</Descriptions.Item>
          <Descriptions.Item label="Driver ID" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.DriverID}</Descriptions.Item>
          <Descriptions.Item label="Route ID" className="textStyles-small" style={{ fontSize: 12 }}>{vehicleDetails?.RouteID}</Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        title={
          isEdit === true ? <span className='textStyles-small' style={{ fontSize: 16 }}>
            Edit Vehicle Details
          </span> :
            <span className='textStyles-small' style={{ fontSize: 16 }}>
              Register New Vehicle</span>
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
                <Select
                  placeholder="Select Vehicle Type"
                  allowClear
                >
                  <Select.Option value="TRUCK">Truck</Select.Option>
                  <Select.Option value="LORRY">Lorry</Select.Option>
                  <Select.Option value="MINI_LORRY">Mini Lorry</Select.Option>
                </Select>
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
                    isEdit ? <Select.Option value={vehicleDetails?.DriverID}>{vehicleDetails?.DriverID}</Select.Option> : null
                  }
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
                    isEdit ? <Select.Option value={vehicleDetails?.RouteID}>{vehicleDetails?.RouteID}</Select.Option> : null
                  }
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
                isEdit === true ? 'Update Vehicle' : 'Register Vehicle'
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