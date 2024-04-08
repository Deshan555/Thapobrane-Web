import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { allCities } from '../../api/cities';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, Row, Col, DatePicker, Drawer, message, Breadcrumb } from 'antd';
import moment from 'moment';
import { CSVLink, CSVDownload } from "react-csv";
import History from './History';
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
    HomeOutlined
} from '@ant-design/icons';
import { random, set } from 'lodash';
const { Option } = Select;

const FieldManagement = () => {
    const [fields, setFields] = useState([]);
    const [factoriesList, setFactoriesList] = useState([]);
    const [zonesList, setZonesList] = useState([]);
    const [customersList, setCustomersList] = useState([]);
    const [roadRoutings, setRoadRoutings] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [editStatus, setEditStatus] = useState(false);
    const [filterValues, setFilterValues] = useState([]);
    const [baseLocation, setBaseLocation] = useState(null);
    const [selectedField, setSelectedField] = useState({
        FieldID: 0,
        FieldName: "",
        FieldSize: null,
        FieldType: "",
        FieldAddress: "",
        TeaType: "",
        BaseLocation: "",
        BaseElevation: null,
        SoilType: "",
        Attitude: null,
        Longitude: null,
        FieldRegistrationDate: "",
        RouteID: null,
        OwnerID: null,
        ZoneID: null,
        FactoryID: null
    });
    const [dropdownValues, setDropdownValues] = useState('all');
    
    useEffect(() => {
        fetchAllAPICalling();
        fetchCityData();
    }, []);

    const fetchCityData = async () => {
        setBaseLocation(allCities);
    };

    const fetchAllAPICalling = async () => {
        fetchAllFields();
        fetchAllRoadRoutings();
        fetchAllFactories();
        fetchAllZones();
        fetchAllCustomers();
    }

    const modelReset = () => {
        setEditStatus(false);
        setSelectedDetails({
            FieldID: 0,
            FieldName: "",
            FieldSize: null,
            FieldType: "",
            FieldAddress: "",
            TeaType: "",
            BaseLocation: "",
            BaseElevation: null,
            SoilType: "",
            Attitude: null,
            Longitude: null,
            FieldRegistrationDate: "",
            RouteID: null,
            OwnerID: null,
            ZoneID: null,
            FactoryID: null,
        });
    };

    const showInfoModel = () => {
        setOpenDetails(true);
        return true;
    };

    const hideInfoModel = () => {
        setOpenDetails(false);
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        modelReset();
        setOpen(false);
        hideInfoModel();
    };

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const confirmModel = () => {
        setOpen(false);
    };

    const confirmationModel = (data) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are You Want To Register New Field?",
            onOk: async () => {
                register(data);
            },
            onCancel() { },
        });
    };

    const register = async (requestBody) => {
        const response = await apiExecutions.registerNewField(requestBody);
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                message.success('Field Registered Successfully : ' + response.message);
                fetchAllFields();
                onClose();
            } else {
                message.error('Failed to Register Field : ' + response.message);
            }
        } else {
            message.error('Failed to Register Field');
        }
    }

    const fetchAllRoadRoutings = async () => {
        const response = await apiExecutions.getAllRoadRoutings();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setRoadRoutings(response.data);
                
                // filterationByFieldType('all');
                // setFilterValues(response.data);
            } else {
                message.error('Failed to fetch Road Routings');
            }
        }
    }

    const fetchAllFields = async () => {
        const response = await apiExecutions.getAllFieldInfo();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setFilterValues(response.data);
                setFields(response.data);
            } else {
                message.error('Failed to fetch Fields');
            }
        }
    }

    const fetchAllFactories = async () => {
        const response = await apiExecutions.getAllFactories();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setFactoriesList(response.data);
            } else {
                message.error('Failed to fetch Factories');
            }
        }
    }

    const fetchAllZones = async () => {
        const response = await apiExecutions.getAllEnvironmentZoneInfo();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setZonesList(response.data);
            } else {
                message.error('Failed to fetch Zones');
            }
        }
    }

    const fetchAllCustomers = async () => {
        const response = await apiExecutions.getAllCustomers();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setCustomersList(response.data);
            } else {
                message.error('Failed to fetch Customers');
            }
        }
    }

    const setSelectedDetails = (record) => {
        setSelectedField({
            FieldID: record.FieldID,
            FieldName: record.FieldName,
            FieldSize: record.FieldSize,
            FieldType: record.FieldType,
            FieldAddress: record.FieldAddress,
            TeaType: record.TeaType,
            BaseLocation: record.BaseLocation,
            BaseElevation: record.BaseElevation,
            SoilType: record.SoilType,
            Attitude: record.Attitude,
            Longitude: record.Longitude,
            FieldRegistrationDate: record.FieldRegistrationDate,
            RouteID: record.RouteID,
            OwnerID: record.OwnerID,
            ZoneID: record.ZoneID,
            FactoryID: record.FactoryID
        });

        showInfoModel();
    }

    const showEditDrawer = (record) => {
        setSelectedField({
            FieldID: record.FieldID,
            FieldName: record.FieldName,
            FieldSize: record.FieldSize,
            FieldType: record.FieldType,
            FieldAddress: record.FieldAddress,
            TeaType: record.TeaType,
            BaseLocation: record.BaseLocation,
            BaseElevation: record.BaseElevation,
            SoilType: record.SoilType,
            Attitude: record.Attitude,
            Longitude: record.Longitude,
            FieldRegistrationDate: record.FieldRegistrationDate,
            RouteID: record.RouteID,
            OwnerID: record.OwnerID,
            ZoneID: record.ZoneID,
            FactoryID: record.FactoryID
        });
        setEditStatus(true);
        showDrawer();
    }

    const confirmationModelForUpdate = (id, data) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are You Want To Update That Field Information?",
            onOk: async () => {
                fieldUpdateModelConfirmation(id, data);
            },
            onCancel() { },
        });
    };

    const fieldUpdateModelConfirmation = async (fieldID, requestBody) => {
        const response = await apiExecutions.updateFieldInfo(fieldID, requestBody);
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                message.success('Field Updated Successfully : ' + response.message);
                fetchAllFields();
                onClose();
            } else {
                message.error('Failed to Update Field : ' + response.message);
            }
        } else {
            message.error('Failed to Update Field');
        }
    }

    const confirmDeleteModel = (fieldID) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are You Want To Delete That Field?",
            onOk: async () => {
                deleteFieldByFieldID(fieldID);
            },
            onCancel() { },
        });
    };

    const deleteFieldByFieldID = async (fieldID) => {
        const response = await apiExecutions.deleteFieldInfo(fieldID);
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                message.success('Field Deleted Successfully : ' + response.message);
                fetchAllFields();
            } else {
                message.error('Failed to Delete Field : ' + response.message);
            }
        } else {
            message.error('Failed to Delete Field');
        }
    }

    /*
    [
  {
    "FieldID": 425476744,
    "FieldName": "Field_425476744",
    "FieldSize": 100,
    "FieldType": "Wheat",
    "FieldAddress": "123 Main St, Cityville",
    "TeaType": "Green Tea v1",
    "BaseLocation": "Farmville",
    "BaseElevation": 500,
    "SoilType": "Loam",
    "Attitude": 34.05,
    "Longitude": -118.24,
    "FieldRegistrationDate": "2024-01-04T18:30:00.000Z",
    "RouteID": 243118935,
    "OwnerID": 588240949,
    "ZoneID": 584674,
    "FactoryID": 1
  }
] */

    const columns = [
        {
            title: 'FieldID',
            dataIndex: 'FieldID',
            key: 'FieldID',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        {
            title: 'Field Type',
            dataIndex: 'FieldType',
            key: 'FieldType',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        {
            title: 'Tea Type',
            dataIndex: 'TeaType',
            key: 'TeaType',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        {
            title: 'Base Location',
            dataIndex: 'BaseLocation',
            key: 'BaseLocation',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        {
            title: 'Soil Type',
            dataIndex: 'SoilType',
            key: 'SoilType',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        {
            title: 'Route ID',
            dataIndex: 'RouteID',
            key: 'RouteID',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        // {
        //     title: 'OwnerID',
        //     dataIndex: 'OwnerID',
        //     key: 'OwnerID',
        //     render: (value) => {
        //         return <b>{value}</b>;
        //     }
        // },
        // {
        //     title: 'ZoneID',
        //     dataIndex: 'ZoneID',
        //     key: 'ZoneID',
        //     render: (value) => {
        //         return <b>{value}</b>;
        //     }
        // },
        {
            title: 'Factory ID',
            dataIndex: 'FactoryID',
            key: 'FactoryID',
            render: (value) => {
                return <b>{factoriesList.map((factory) => {
                    if (factory.FactoryID === value) {
                        return factory.FactoryName;
                    }
                })}</b>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {/* <Button type="default" icon={<EyeOutlined />} onClick={setSelectedDetails(record)}>
                    View
                </Button> */}
                    <EyeOutlined
                        style={{ color: 'blue' }}
                        onClick={() => setSelectedDetails(record)}
                    />
                    <EditOutlined
                        style={{ color: 'blue' }}
                        onClick={() => showEditDrawer(record)}
                    />
                    <DeleteOutlined
                        style={{ color: 'red' }}
                        onClick={() => confirmDeleteModel(record.FieldID)}
                    />
                </Space>
            ),
        },
    ];


    const handleFormSubmit = (values) => {
        // onClose();
        const requestBody = {
            FieldName: values.fieldName,
            FieldSize: values.fieldSize,
            FieldType: values.fieldType,
            FieldAddress: values.fieldAddress,
            TeaType: values.teaType,
            BaseLocation: values.baseLocation,
            BaseElevation: values.baseElevation,
            SoilType: values.soilType,
            Attitude: values.latitude,
            Longitude: values.longitude,
            FieldRegistrationDate: values.fieldRegistrationDate,
            RouteID: values.routeId,
            OwnerID: values.ownerId,
            ZoneID: values.zoneId,
            FactoryID: values.factoryId
        };
        // confirmationModel(requestBody);

        if (editStatus !== true) {
            confirmationModel(requestBody);
        } else {
            confirmationModelForUpdate(selectedField?.FieldID, requestBody);
        }
    };

    const columnStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        marginTop: '10px'
    };

    const mapStyles = {
        height: "300px",
        width: "100%",
        borderRadius: "10px"
    };

    const defaultCenter = {
        lat: 40.7128,
        lng: -74.0060
    };

    const onFinishFilter = (values) => {
        console.log(values);
        const { searchField, filterFieldType } = values;
        if (searchField !== undefined && filterFieldType !== undefined) {
            const filteredData = fields.filter((field) => {
                return field.FieldID === searchField || field.FieldType === filterFieldType.toUpperCase();
            });
            setFields(filteredData);
        }
    }

    const DateTimeConverter = ({ isoDateTime }) =>  {
        const dateObj = new Date(isoDateTime);
        const formattedDateTime = dateObj.toLocaleString();
        return formattedDateTime;
    }

    const filterationByFieldID = (value) => {
        const dropdownValue = dropdownValues;
        if ((value === undefined || value === null || value === "") && dropdownValue === "all") {
            setFilterValues(fields);
        } else if ((value !== undefined || value !== null || value !== "") && dropdownValue === "all") {
            const filteredData = fields.filter((field) => {
                return field.FieldID.toString().includes(value);
            });
            setFilterValues(filteredData);
        } else if ((value !== undefined || value !== null || value !== "") && dropdownValue !== "all") {
            const filteredData = fields.filter((field) => {
                return field.FieldID.toString().includes(value) 
                && field.FieldType === dropdownValue.toUpperCase();
            });
            setFilterValues(filteredData);
        } else {
            setFilterValues(fields);
        }
    }
    

    const filterationByFieldType = (value) => {
        setDropdownValues(value);
        if (value==="all") {
            setFilterValues(fields);
        } else if (value !== "") {
            const filteredData = fields?.filter((field) => {
                return field?.FieldType === value.toUpperCase();
            });
            setFilterValues(filteredData);
        }
    }

    const resetAllFilters = () => {
        setFilterValues(fields);
        setDropdownValues('all');
    }
    
    
    return (
        <>
            <Drawer
                title={
                    editStatus == true ? "Update Field Information" : "Register New Field"
                }
                footer={true}
                width={800}
                onClose={onClose}
                open={open}
                style={{ overflow: 'auto', height: '100%', marginTop: '60px' }}
                autoFocus={true}
                destroyOnClose={true}
            >
                <Form
                    labelCol={{ span: 15 }}
                    wrapperCol={{ span: 20 }}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    initialValues={{ size: 'default', fieldRegistrationDate: moment() }}
                >
                    <div style={{ padding: '10px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Field Name"
                                    initialValue={selectedField?.FieldName ? selectedField?.FieldName : "Field_" + random(100000000, 999999999)}
                                    name="fieldName">
                                    <Input
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Field Size (Hectare)" name="fieldSize"
                                    initialValue={selectedField?.FieldSize}
                                    rules={[{ required: true, message: 'Please enter Field Size' }]}>
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Field Type" name="fieldType"
                                    rules={[{ required: true, message: 'Please enter Field Type' }]}
                                    initialValue={selectedField?.FieldType}
                                >
                                    <Select
                                        placeholder="Select Field Type"
                                        showSearch
                                    >
                                        <Option value="SMALL">Small</Option>
                                        <Option value="MEDIUM">Medium</Option>
                                        <Option value="LARGE">Large</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Field Address" name="fieldAddress"
                                    initialValue={selectedField?.FieldAddress}
                                    rules={[{ required: true, message: 'Please enter Field Address' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Tea Type" name="teaType"
                                    initialValue={selectedField?.TeaType}
                                    rules={[{ required: true, message: 'Please enter Tea Type' }]}>
                                    <Select
                                        placeholder="Select Tea Type"
                                        showSearch>
                                        <Option value="camellia cinensis">Sinensis - Chinese Veriety</Option>
                                        <Option value="camellia sinensis assamica">Assamica - Indian Veriety</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Base Location" name="baseLocation"
                                    initialValue={selectedField?.BaseLocation}
                                    rules={[{ required: true, message: 'Please enter Base Location' }]}>
                                    <Select
                                        placeholder="Select Base Location"
                                        showSearch>
                                        {baseLocation?.map((city, index) => {
                                            return <Option key={index} value={city}>{city}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Base Elevation (Degrees)" name="baseElevation"
                                    initialValue={selectedField?.BaseElevation}
                                    rules={[{ required: true, message: 'Please enter Base Elevation' }]}>
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Soil Type" name="soilType"
                                    initialValue={selectedField?.SoilType}
                                    rules={[{ required: true, message: 'Please enter Soil Type' }]}>
                                    <Select
                                        placeholder="Select Soil Type"
                                        showSearch>
                                        <Option value="Reddish Brown Earths">Reddish Brown Earths</Option>
                                        <Option value="Low Humic Gley Soils">Low Humic Gley Soils</Option>
                                        <Option value="Non- Calcic Brown soils">Non- Calcic Brown soils</Option>
                                        <Option value="Red-Yellow Latosols">Red-Yellow Latosols</Option>
                                        <Option value="Alluvial Soils">Alluvial Soils</Option>
                                        <Option value="Solodized Solonetz">Solodized Solonetz</Option>
                                        <Option value="Regosols">Regosols</Option>
                                        <Option value="Soils on Old Alluvium">Soils on Old Alluvium</Option>
                                        <Option value="Grumusols">Grumusols</Option>
                                        <Option value="Immature Brown Loams">Immature Brown Loams</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Latitude" name="latitude"
                                    initialValue={selectedField?.Attitude}
                                    rules={[{ required: true, message: 'Please enter Latitude' }]}>
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Longitude" name="longitude"
                                    initialValue={selectedField?.Longitude}
                                    rules={[{ required: true, message: 'Please enter Longitude' }]}>
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Owner ID" name="ownerId"
                                    initialValue={selectedField?.OwnerID}
                                    rules={[{ required: true, message: 'Please enter Owner ID' }]}>
                                    <Select
                                        placeholder="Select Owner ID"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {customersList.map((customer, index) => {
                                            return <Option key={index} value={customer.CustomerID}>{customer.CustomerName}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Zone ID" name="zoneId"
                                    initialValue={selectedField?.ZoneID}
                                    rules={[{ required: true, message: 'Please select Zone ID' }]}>
                                    <Select
                                        placeholder="Select Base Zone Name"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {zonesList.map((zone, index) => {
                                            return <Option key={index} value={zone.ZoneID}>{zone.ZoneName}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Factory ID" name="factoryId"
                                    initialValue={selectedField?.FactoryID}
                                    rules={[{ required: true, message: 'Please enter Factory ID' }]}>
                                    <Select
                                        placeholder="Select Base Factory Name"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {factoriesList.map((factory, index) => (
                                            <Option key={index} value={factory.FactoryID}>
                                                {factory.FactoryName}
                                            </Option>
                                        ))}
                                    </Select>

                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Route ID" name="routeId"
                                    initialValue={selectedField?.RouteID}
                                    rules={[{ required: true, message: 'Please enter Route ID' }]}>
                                    <Select
                                        placeholder="Select Route ID"
                                        showSearch>
                                        {roadRoutings.map((roadRouting, index) => {
                                            return <Option key={index} value={roadRouting.RoutingID}>{roadRouting.RoutingID}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col >
                                <Form.Item>
                                    {editStatus == true ?
                                        <Button type="primary" htmlType="submit">
                                            Update Field Info
                                        </Button> :
                                        <Button type="primary" htmlType="submit">
                                            Register New Field
                                        </Button>
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Drawer>

            <Modal
                title="Field Details"
                open={openDetails}
                onClose={hideInfoModel}
                selectedField={selectedField}
                destroyOnClose={true}
                footer={[
                    <Button key="back" onClick={hideInfoModel}>
                        Close
                    </Button>
                ]}
                width={800}
            >
                <div style={{
                    borderRadius: '10px',
                }}>
                    <div>
                        <GoogleMap
                            mapContainerStyle={mapStyles}
                            zoom={10}
                            center={defaultCenter}
                        >
                            <Marker position={defaultCenter} />
                        </GoogleMap>
                    </div>
                    <div style={columnStyle}>
                        <div>
                            <p>Field ID : <strong>{selectedField.FieldID}</strong></p>
                            <p>Field Name : <strong>{selectedField.FieldName}</strong></p>
                            <p>Field Size : <strong>{selectedField.FieldSize}</strong></p>
                            <p>Field Type : <strong>{selectedField.FieldType}</strong></p>
                            <p>Field Address : <strong>{selectedField.FieldAddress}</strong></p>
                            <p>Field Registration Date : <strong>{selectedField.FieldRegistrationDate ? 
                            <DateTimeConverter isoDateTime={selectedField.FieldRegistrationDate} /> : ""}</strong></p>
                            <p>Route ID : <strong>{selectedField.RouteID}</strong></p>
                        </div>
                        <div>
                            <p>Owner ID : <strong>{selectedField.OwnerID}</strong></p>
                            <p>Zone ID : <strong>{selectedField.ZoneID}</strong></p>
                            <p>Factory ID : <strong>{factoriesList.map((factory) => {
                                if (factory.FactoryID === selectedField.FactoryID) {
                                    return factory.FactoryName;
                                }
                            })}</strong></p>
                            <p>Base Location : <strong>{selectedField.BaseLocation}</strong></p>
                            <p>Base Elevation : <strong>{selectedField.BaseElevation}</strong></p>
                            <p>Soil Type : <strong>{selectedField.SoilType}</strong></p>
                            <p>Location : <strong>{selectedField.Attitude} , {selectedField.Longitude}</strong></p>
                        </div>
                    </div>
                </div>
            </Modal>

            <h3>
                Field Management
            </h3>

            <h1 className="headingStyle2">Tea Collection</h1>
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
                        title: 'Tea Collection',
                    },
                ]}
            />

            <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
                <Space>
                    <div style={{ padding: 10, background: 'white', borderRadius: 10, display: 'flex', justifyContent: 'flex-end' }}>
                        <Space align="end">
                            <Form
                                onFinish={onFinishFilter}
                                layout="inline">
                                <Form.Item name="searchField">
                                    <Input
                                        placeholder="Search Field By ID"
                                        suffix={<SearchOutlined />}
                                        onChange={(e) => filterationByFieldID(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item name="filterFieldType">
                                    <Select style={{ width: 200 }} 
                                    placeholder="Filter By Field Type"
                                    onChange={(value) => filterationByFieldType(value)}
                                    defaultValue="all"
                                    >
                                        <Option value="all">All</Option>
                                        <Option value="small">Small</Option>
                                        <Option value="medium">Medium</Option>
                                        <Option value="large">Large</Option>
                                    </Select>
                                </Form.Item>
                                {/* <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ borderRadius: "50px" }}>
                                        <SearchOutlined />
                                    </Button>
                                </Form.Item> */}
                                <Form.Item>
                                    <Button type="primary" 
                                    danger style={{ borderRadius: "50px" }}
                                    onClick={resetAllFilters}
                                    >
                                        <CloseCircleOutlined />
                                    </Button>
                                </Form.Item>
                            </Form>
                            <CSVLink
                                data={fields}
                                filename={`field-management_${new Date().toISOString()}.csv`}
                                target='_blank'
                            >
                                <Button type="primary" style={{ borderRadius: "50px" }}>
                                    <CloseCircleOutlined /> Export List
                                </Button>
                            </CSVLink>
                            <Button type="primary" onClick={showDrawer} style={{ borderRadius: "50px" }}>
                                <PlusOutlined /> New Field
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
                    dataSource={filterValues}
                    pagination={{ pageSize: 50 }}
                    loading={fields.length === 0}
                    size="small"
                />
            </div>

        </>
    )
}

export default FieldManagement;