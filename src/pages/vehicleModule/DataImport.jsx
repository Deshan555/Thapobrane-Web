import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { allCities } from '../../api/cities';
import { Form, Input, Button, Select, Modal, Table, TimePicker, Space, Descriptions, Tag, Row, Col, DatePicker, Drawer, message, Breadcrumb } from 'antd';
import { CSVLink, CSVDownload } from "react-csv";
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
import './style.css';
import moment from 'moment';
import dayjs from 'dayjs';
import { set } from 'lodash';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';

const Import = () => {
    const [allDailyCollection, setAllDailyCollection] = useState([]);
    const [selectedDailyCollection, setSelectedDailyCollection] = useState(null);
    const [modelOpen, setModelOpen] = useState(false);
    const today = moment().format('YYYY-MM-DD');
    const sevenDaysBefore = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        getDailyTeaCollectionBetweenTwoDatesFetch(sevenDaysBefore, today);
    }, []);

    const fetchAllDailyTeaCollection = async () => {
        const response = await apiExecutions.getAllDailyTeaCollection();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setAllDailyCollection(response.data);
            } else {
                message.error('Failed to Fetch Daily Collection');
            }
        } else {
            message.error('Failed to Fetch Daily Collection');
        }
    }

    const getDailyTeaCollectionBetweenTwoDatesFetch = async (startDate, endDate) => {
        const response = await apiExecutions.getDailyTeaCollectionBetweenTwoDates(startDate, endDate);
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setAllDailyCollection(response.data);
            } else {
                message.error('Failed to Fetch Daily Collection');
            }
        } else {
            message.error('Failed to Fetch Daily Collection');
        }
    }

    const fetchSingleDataRecordByRecordID = async (recordID) => {
        const response = await apiExecutions.getDailyTeaCollectionByID(recordID);
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setSelectedDailyCollection(response.data);
                setModelOpen(true);
            } else {
                message.error('Failed to Fetch Single Record');
            }
        } else {
            message.error('Failed to Fetch Single Record');
        }
    }

    const columns = [
        {
            title: <span className='textStyles-small'>Collection Date</span>,
            dataIndex: 'CollectionDate',
            key: 'CollectionDate',
            render: (value) => {
                return <span className='textStyle-small'>
                    {value ? value.split('T')[0] : ''}
                </span>
            }
        },
        {
            title: <span className='textStyles-small'>Tea Weight Collected</span>,
            dataIndex: 'TeaWeightCollected',
            key: 'TeaWeightCollected',
            render: (value) => {
                return <span className='textStyle-small'>
                    {value} Kg
                </span>
            }
        },
        {
            title: <span className='textStyles-small'>Water Weight Collected</span>,
            dataIndex: 'WaterWeightCollected',
            key: 'WaterWeightCollected',
            render: (value) => {
                return <span className='textStyle-small'>
                    {value} Kg
                </span>
            }
        },
        {
            title: <span className='textStyles-small'>Actual Tea Weight</span>,
            dataIndex: 'ActualTeaWeight',
            key: 'ActualTeaWeight',
            render: (value) => {
                return <span className='textStyle-small'>
                    {value} Kg
                </span>
            }
        },
        {
            title: <span className='textStyles-small'>Base Longitude</span>,
            dataIndex: 'BaseLongitude',
            key: 'BaseLongitude',
            render: (value) => {
                return <span className='textStyle-small'>
                    {value}
                </span>
            }
        },
        {
            title: <span className='textStyles-small'>Base Latitude</span>,
            dataIndex: 'BaseLatitude',
            key: 'BaseLatitude',
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
            title: <span className='textStyles-small'>Field ID</span>,
            dataIndex: 'FieldID',
            key: 'FieldID',
            render: (value) => {
                return <span className='textStyle-small'>
                    {value}
                </span>
            }
        },
        {
            title: <span className='textStyles-small'>Employee ID</span>,
            dataIndex: 'EmployeeID',
            key: 'EmployeeID',
            render: (value) => {
                return <span className='textStyle-small'>
                    {value}
                </span>
            }
        },
        {
            title: <span className='textStyles-small'>Remark</span>,
            dataIndex: 'Remark',
            key: 'Remark',
            render: (value) => {
                return <span className='textStyle-small'>
                    {value}
                </span>
            }
        },
        {
            title: <span className='textStyles-small'>Actions</span>,
            dataIndex: 'actions',
            key: 'actions',
            render: (value, record) => {
                return <Space>
                    <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        onClick={() => fetchSingleDataRecordByRecordID(record.CollectionID)}>
                        <EyeOutlined />
                    </Button>
                </Space>
            }
        }
    ]

    const timeRangeFetcher = (values) => {
        const startDate = values[0].format('YYYY-MM-DD');
        const endDate = values[1].format('YYYY-MM-DD');
        getDailyTeaCollectionBetweenTwoDatesFetch(startDate, endDate);
    }

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
        height: "200px",
        width: "100%",
        borderRadius: "10px"
    };

    const defaultCenter = {
        lat: 40.7128,
        lng: -74.0060
    };

    return (
        <>
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
                            <RangePicker
                                defaultValue={[dayjs(sevenDaysBefore, 'YYYY-MM-DD'), dayjs(today, 'YYYY-MM-DD')]}
                                format={dateFormat}
                                onChange={timeRangeFetcher}
                                style={{ fontSize: '12px' }}
                            />
                            <Button type="primary" style={{ borderRadius: "50px" }}>
                                <CloseCircleOutlined /> <span className='textStyle-small'>Export List</span>
                            </Button>
                            <Button type="primary"
                                // onClick={showModel}
                                style={{ borderRadius: "50px" }}>
                                <PlusOutlined /> <span className='textStyle-small'>New Employee</span>
                            </Button>
                        </Space>
                    </div>
                </Space>
            </div>

            <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
                <Table
                    dataSource={allDailyCollection}
                    columns={columns}
                    loading={allDailyCollection.length === 0}
                    pagination={true}
                    size="small"
                />
            </div>
            {/* 
            {
	"0": {
		"CollectionID": 1,
		"CollectionDate": "2024-04-04T18:30:00.000Z",
		"TeaWeightCollected": 100,
		"WaterWeightCollected": 50,
		"ActualTeaWeight": 90,
		"BaseLongitude": 79.99,
		"BaseLatitude": 6.45,
		"RouteID": 243118935,
		"FieldID": 171683694,
		"EmployeeID": 10002,
		"Remark": "Harvested early in the morning."
	} */}
            <Modal
                title={<span className='textStyle-small' style={{ fontSize: '14px' }}>
                    Daily Collection Details
                </span>}
                visible={modelOpen}
                onOk={() => setModelOpen(false)}
                onCancel={() => setModelOpen(false)}
                width={800}
                destroyOnClose={true}
                footer={null}
            >
                <div style={{
                    borderRadius: '10px',
                }}>
                    <div>
                        <GoogleMap
                            mapContainerStyle={mapStyles}
                            zoom={15}
                            center={selectedDailyCollection ? { lat: selectedDailyCollection.BaseLatitude, lng: selectedDailyCollection.BaseLongitude } : defaultCenter}
                        >
                            <Marker position={{ lat: selectedDailyCollection?.BaseLatitude, lng: selectedDailyCollection?.BaseLongitude }} />
                        </GoogleMap>

                        <Descriptions
                            bordered
                            column={2}
                            size="small"
                            style={{ marginTop: '10px' }}
                        >
                            <Descriptions.Item label="Collection ID" className='textStyle-small' style={{ fontSize: '12px' }}>COL-{selectedDailyCollection?.CollectionID}</Descriptions.Item>
                            <Descriptions.Item label="Collection Date" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.CollectionDate.toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Tea Weight Collected" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.TeaWeightCollected} Kg</Descriptions.Item>
                            <Descriptions.Item label="Water Weight Collected" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.WaterWeightCollected} Kg</Descriptions.Item>
                            <Descriptions.Item label="Actual Tea Weight" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.ActualTeaWeight} Kg</Descriptions.Item>
                            <Descriptions.Item label="Base Longitude" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.BaseLongitude}</Descriptions.Item>
                            <Descriptions.Item label="Base Latitude" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.BaseLatitude}</Descriptions.Item>
                            <Descriptions.Item label="Field Address" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.FieldAddress}</Descriptions.Item>
                            <Descriptions.Item label="Route ID" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.RouteID}</Descriptions.Item>
                            <Descriptions.Item label="Field ID" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.FieldID}</Descriptions.Item>
                            <Descriptions.Item label="Collected By" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.EmployeeName}</Descriptions.Item>
                            <Descriptions.Item label="Remark" className='textStyle-small' style={{ fontSize: '12px' }}>{selectedDailyCollection?.Remark}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Import;