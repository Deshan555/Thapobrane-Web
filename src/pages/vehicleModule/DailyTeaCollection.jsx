import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { allCities } from '../../api/cities';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, Row, Col, DatePicker, Drawer, message, Breadcrumb } from 'antd';
import { CSVLink, CSVDownload } from "react-csv";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  MailOutlined,
  DeleteOutlined,
  PhoneOutlined,
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  HomeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import './style.css';
import { set, values } from 'lodash';
import { duration } from '../../../node_modules/moment/moment';

// SourceFactoryID, Destination, RoundTrip, StartLongitude, StartLatitude, EndLongitude, EndLatitude

const DailyTeaCollection = () => {
  const [allRoadRoutings, setAllRoadRoutings] = useState([]);
  const [allCollectors, setAllCollectors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allFactories, setAllFactories] = useState([]);
  const [baseLocation, setBaseLocation] = useState([]);
  const [factoryID, setFactoryID] = useState(null);
  const [startLat, setStartLat] = useState(null);
  const [startLng, setStartLng] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [routingDetails, setRoutingDetails] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: <span className='textStyle'>Routing ID</span>,
      dataIndex: 'RoutingID',
      key: 'RoutingID',
      render: text => <span className='textStyle-small'>{text}</span>
    },
    {
      title: <span className='textStyle'>Destination</span>,
      dataIndex: 'Destination',
      key: 'Destination',
      render: text => <span className='textStyle-small'>{text}</span>
    },
    {
      title: <span className='textStyle'>Round Trip</span>,
      dataIndex: 'RoundTrip',
      key: 'RoundTrip',
      render: text => <span className='textStyle-small'>{text}</span>
    },
    {
      title: <span className='textStyle'>Start Location</span>,
      dataIndex: 'StartLongitude',
      key: 'StartLongitude',
      render: text => <span className='textStyle-small'>Lat. {text}</span>
    },
    {
      title: <span className='textStyle'>End Location</span>,
      dataIndex: 'EndLongitude',
      key: 'EndLongitude',
      render: text => <span className='textStyle-small'>Lan. {text}</span>
    },
    {
      title: <span className='textStyle'>Total Stops</span>,
      dataIndex: 'TotalStops',
      key: 'TotalStops',
      render: text => <span className='textStyle-small'>{text} Stops</span>
    },
    {
      title: <span className='textStyle'>Duration</span>,
      dataIndex: 'Duration',
      key: 'Duration',
      render: text => <span className='textStyle-small'>{text} mins</span>
    },
    {
      title: <span className='textStyle'>Action</span>,
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              fetchRoutingInfoByID(record.RoutingID);
              setSelectedDetails([]);
              form.resetFields();
              setIsView(true);
              setIsEdit(false);
            }}
            style={{ borderRadius: "50px" }}
            shape="circle"
            size="small"
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              fetchRoutingInfoByID(record.RoutingID);
              form.resetFields();
              setSelectedDetails([]);
              setIsEdit(true);
              setIsView(false);
            }}
            style={{ borderRadius: "50px" }}
            shape="circle"
            size="small"
          />
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => confirmDeleteRoutes(record.RoutingID)}
            danger
            style={{ borderRadius: "50px" }}
            shape="circle"
            size="small"
          />
        </Space>
      ),
    }
  ];


  useEffect(() => {
    fetchAllApiData();
    fetchAllCollectors();
  }, []);


  const fetchAllApiData = async () => {
    await fetchAllRoadRoutings();
    await fetchAllFactories();
    await fetchBaseLocation();
  }

  const fetchSingleRoutingDetails = async (id) => {
    const response = await apiExecutions.getRoadRoutingDetailsByID(id);
    if (response !== null && response !== undefined) {
      if (response.success === true) {
        setRoutingDetails(response.data);
      } else {
        message.error('Failed to fetch Routing Details');
      }
    }
  }

  const fetchAllCollectors = async () => {
    const response = await apiExecutions.getAllCollectors();
    if (response !== null && response !== undefined) {
      if (response.success === true) {
        setAllCollectors(response.data);
      } else {
        message.error('Failed to fetch Collectors');
      }
    }
  }

  const singleDataFetchingModelOpen = (id, modelVisible) => {
    fetchSingleRoutingDetails(id);
    setIsModalVisible(true);
  }

  const fetchAllRoadRoutings = async () => {
    const response = await apiExecutions.getAllRoadRoutings();
    if (response !== null && response !== undefined) {
      if (response.success === true) {
        console.log(response.data);
        setAllRoadRoutings(response.data);
      } else {
        message.error('Failed to fetch Road Routings');
      }
    }
  }

  const fetchAllFactories = async () => {
    const response = await apiExecutions.getAllFactories();
    if (response !== null && response !== undefined) {
      console.log('response', response);
      if (response.success === true) {
        setAllFactories(response.data);
      } else {
        message.error('Failed to fetch Factories');
      }
    }
  }

  const fetchBaseLocation = async () => {
    const response = await apiExecutions.getAllCoordinates();
    if (response !== null && response !== undefined) {
      if (response.success === true) {
        setBaseLocation(response.data);
      } else {
        message.error('Failed to fetch Base Locations');
      }
    }
  }

  const startLocationSet = (data) => {
    setFactoryID(data);
    baseLocation.forEach((location) => {
      if (data == location.factoryID) {
        setStartLat(location.lat);
        setStartLng(location.lon);
      }
    });
  };


  const onFinish = async (values) => {
    if (isEdit === true) {
      const data = {
        SourceFactoryID: values.SourceFactoryID,
        Destination: values.Destination,
        RoundTrip: values.RoundTrip,
        StartLongitude: selectedDetails.StartLongitude,
        StartLatitude: selectedDetails.StartLatitude,
        EndLongitude: values.EndLongitude,
        EndLatitude: values.EndLatitude,
        duration: values.duration,
        TotalStops: selectedDetails.TotalStops,
        CollectorID: values.collectorID,
      }
      confirmUpdateRoutes(selectedDetails.RoutingID, data);
    } else {
      const data = {
        SourceFactoryID: values.SourceFactoryID,
        Destination: values.Destination,
        RoundTrip: values.RoundTrip,
        StartLongitude: startLng,
        StartLatitude: startLat,
        EndLongitude: values.EndLongitude,
        EndLatitude: values.EndLatitude,
        duration: values.duration,
        TotalStops: values.TotalStops,
        CollectorID: values.collectorID,
      }
      confirmationModelForRegister(data);
    }
  };

  const confirmationModelForRegister = (data) => {
    const { confirm } = Modal;
    confirm({
      title: "Are You Want To Register This Route?",
      onOk: async () => {
        await registerRoute(data);
      },
      onCancel() { },
    });
  };

  const confirmDeleteRoutes = (id) => {
    const { confirm } = Modal;
    confirm({
      title: "Are You Want To Delete This Route?",
      onOk: async () => {
        await deleteRoadRouting(id);
      },
      onCancel() { },
    });
  };

  const confirmUpdateRoutes = (id, data) => {
    const { confirm } = Modal;
    confirm({
      title: "Are You Want To Update This Route?",
      onOk: async () => {
        await updateRoutingInfromations(id, data);
      },
      onCancel() { },
    });
  }

  const registerRoute = async (data) => {
    const response = await apiExecutions.addNewRoadRouting(data);
    if (response !== null && response !== undefined) {
      if (response.success === true) {
        message.success('Route Registered Successfully');
        fetchAllApiData();
        setIsModalVisible(false);
      } else {
        message.error('Failed to Register Route');
      }
    }
  }

  const deleteRoadRouting = async (id) => {
    const response = await apiExecutions.deleteRoutes(id);
    if (response !== null && response !== undefined) {
      if (response.success === true) {
        message.success('Route Deleted Successfully');
        fetchAllApiData();
      } else {
        message.error('Failed to Delete Route');
      }
    }
  }

  const updateRoutingInfromations = async (id, data) => {
    const response = await apiExecutions.updateRoadRouting(id, data);
    if (response !== null && response !== undefined) {
      if (response.success === true) {
        message.success('Route Updated Successfully');
        fetchAllApiData();
        setIsModalVisible(false);
      } else {
        message.error('Failed to Update Route');
      }
    }
  }

  const fetchRoutingInfoByID = async (id) => {
    setSelectedDetails([]);
    console.log(selectedDetails.length);
    const response = await apiExecutions.getRoadRoutingDetailsByID(id);
    if (response !== null && response !== undefined) {
      if (response.success === true) {
        setSelectedDetails(response.data[0]);
        setIsModalVisible(true);
      } else {
        message.error('Failed to fetch Routing Details');
      }
    }
  }

  // const applyFilter = (value) => {
  //   console.log(value);
  //   if (value === '') {
  //     fetchAllRoadRoutings();
  //   } else {
  //     const filterData = allRoadRoutings?.map((data) => {
  //       if (data.RoutingID.includes(value)) {
  //         return data;
  //       }
  //     setAllRoadRoutings(filterData);
  //   }
  // }

  const modelVisible = () => {
    setIsModalVisible(true);
  }

  const hideModal = () => {
    setIsEdit(false);
    setIsModalVisible(false);
  }

  return (
    <>
      <h1 className="headingStyle2">Route Management</h1>
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
            title: 'Route Management',
          },
        ]}
      />

      <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
        <Space>
          <div style={{ padding: 10, background: 'white', borderRadius: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Space align="end">
              <Form
                layout="inline">
                <Form.Item name="searchField">
                  <Input
                    // onChange={(e) => applyFilter(e.target.value)}
                    placeholder="Search Field By RouteID"
                    suffix={<SearchOutlined />}
                  />
                </Form.Item>
              </Form>
              <CSVLink
                data={allRoadRoutings}
                filename={`Route-Management_${new Date().toISOString()}.csv`}
                target='_blank'
              >
                <Button type="primary"
                  className="textStyles-small"
                  style={{ borderRadius: "50px", background: '#3bb64b', borderColor: '#3bb64b' }}>
                  <DownloadOutlined /> Export List
                </Button>
              </CSVLink>
              <Button type="primary"
                onClick={modelVisible}
                className="textStyles-small"
                style={{ borderRadius: "50px" }}>
                <PlusOutlined /> New Route Register
              </Button>
            </Space>
          </div>
        </Space>
      </div>

      <div style={{
        padding: 10,
        background: 'white',
        borderRadius: 10,
        marginTop: 10,
      }}>
        <Table
          columns={columns}
          dataSource={allRoadRoutings}
          pagination={{ pageSize: 50 }}
          loading={allRoadRoutings.length === 0}
          size="small"
        />
      </div>

      <Modal
        title={<span>
          {
            isEdit ? <span>
              Edit Routing Information
            </span> : <span>
              Add New Routing Information
            </span>
          }
        </span>}
        visible={isModalVisible}
        onOk={() => hideModal()}
        onCancel={() => hideModal()}
        width={800}
        destroyOnClose={true}
        footer={null}
      >


        {
          isView === true ?
            (<Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Routing ID" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.RoutingID}</Descriptions.Item>
              <Descriptions.Item label="Source Factory ID" className='textStyles-small' style={{ fontSize: '12px' }}>FID_{selectedDetails?.SourceFactoryID}</Descriptions.Item>
              <Descriptions.Item label="Destination" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.Destination}</Descriptions.Item>
              <Descriptions.Item label="Round Trip" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.RoundTrip}</Descriptions.Item>
              <Descriptions.Item label="Start Longitude" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.StartLongitude}</Descriptions.Item>
              <Descriptions.Item label="Start Latitude" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.StartLatitude}</Descriptions.Item>
              <Descriptions.Item label="End Longitude" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.EndLongitude}</Descriptions.Item>
              <Descriptions.Item label="End Latitude" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.EndLatitude}</Descriptions.Item>
              <Descriptions.Item label="Total Stops" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.TotalStops}</Descriptions.Item>
              <Descriptions.Item label="Duration" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.Duration ? selectedDetails?.Duration : 0} mins</Descriptions.Item>
              <Descriptions.Item label="Collector ID" className='textStyles-small' style={{ fontSize: '12px' }}>{selectedDetails?.CollectorID ? selectedDetails?.CollectorID : 'Not Assigned'}</Descriptions.Item>
            </Descriptions>) : (
              <Form
                layout="vertical"
                className="textStyles-small"
                onFinish={onFinish}
                form={form}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="SourceFactoryID"
                      label={<span className='textStyles-small'>Source Factory (Start Location)</span>}
                      rules={[{ required: true, message: 'Please enter Source Factory' }]}
                      initialValue={selectedDetails?.SourceFactoryID}
                    >
                      <Select
                        showSearch
                        placeholder="Please select Source Factory ID"
                        optionFilterProp="children"
                        onChange={(value) => startLocationSet(value)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {allFactories.map((factory, index) => (
                          <Option key={index} value={factory.FactoryID}>{factory.FactoryName}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="RoundTrip"
                      label={<span className='textStyles-small'>Round Trip</span>}
                      rules={[{ required: true, message: 'Please enter Round Trip' }]}
                      initialValue={selectedDetails?.RoundTrip}
                    >
                      <Select placeholder="Please select Round Trip"
                      >
                        <Option value="true">True</Option>
                        <Option value="false">False</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="Destination"
                      label={<span className='textStyles-small'>Destination (Discription)</span>}
                      rules={[{ required: true, message: 'Please enter Destination' }]}
                      initialValue={selectedDetails?.Destination}
                    >
                      <Input placeholder="Please enter Destination"
                        className='textStyles-small'
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="TotalStops"
                      label={<span className='textStyles-small'>Total Stops</span>}
                      rules={[{ required: true, message: 'Please enter Total Stops' }]}
                      initialValue={selectedDetails?.TotalStops ? routingDetails?.TotalStops : 0}
                    >
                      <Input placeholder="Please enter Total Stops"
                        className='textStyles-small'
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="EndLongitude"
                      label={<span className='textStyles-small'>End Longitude</span>}
                      rules={[{ required: true, message: 'Please enter End Longitude' }]}
                      initialValue={selectedDetails?.EndLongitude}
                    >
                      <Input placeholder="Please enter End Longitude"
                        className='textStyles-small'
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="EndLatitude"
                      label={<span className='textStyles-small'>End Latitude</span>}
                      rules={[{ required: true, message: 'Please enter End Latitude' }]}
                      initialValue={selectedDetails?.EndLatitude}
                    >
                      <Input placeholder="Please enter End Latitude"
                        className='textStyles-small'
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name='duration'
                      label={<span className='textStyles-small'>Duration</span>}
                      rules={[{ required: true, message: 'Please enter Duration' }]}
                      initialValue={selectedDetails?.Duration}
                    >
                      <Input placeholder="Please enter Duration"
                        className='textStyles-small'
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="collectorID"
                      label={<span className='textStyles-small'>Collector Name</span>}
                      initialValue={selectedDetails?.CollectorID}
                    >
                      <Select
                        showSearch
                        placeholder="Please select Collector ID"
                        allowClear
                      >
                        {allCollectors.map((collector, index) => (
                          <Option key={index} value={collector?.EmployeeID}>{collector?.EmployeeName}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  {
                    isEdit === true ? <Button type="primary" htmlType="submit">
                      <span className='textStyles-small'>
                        Update Route
                      </span>
                    </Button> : <Button type="primary" htmlType="submit">
                      <span className='textStyles-small'>
                        Register Route
                      </span>
                    </Button>
                  }
                </Form.Item>
              </Form>
            )
        }
      </Modal>
    </>
  );
};

export default DailyTeaCollection;
