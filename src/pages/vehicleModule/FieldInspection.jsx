import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../../api/api-call';
import { Tabs, Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb, DatePicker, Badge, Steps, Spin, Card } from 'antd';
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
    DownloadOutlined,
    ShoppingOutlined,
    CheckOutlined
} from '@ant-design/icons';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { CSVLink, CSVDownload } from "react-csv";
import moment from '../../../node_modules/moment/moment';
import '../charts/chart-styles.css';
import './style.css';

import LineChart from 'pages/charts/LineChart';
import HorizontalBarChart from 'pages/charts/HorizontalBarChart';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import AreaChart from 'pages/charts/AreaChart';
import RadarChart from 'pages/charts/RaderChart';
import PieChart from 'pages/charts/PieChart';
import DonutChart from 'pages/charts/DonutChart';
import DualBarChart from 'pages/charts/DualBarChart';
import dayjs from 'dayjs';
import { set } from 'lodash';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimePicker } from '../../../node_modules/antd/es/index';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';

const FieldInspection = () => {

    const [selectedFieldInfo, setSelectedFieldInfo] = useState({});
    const [ownerDetails, setOwnerDetails] = useState({});

    const [allTimeSumByFieldID, setAllTimeSumByFieldID] = useState([]);
    const [allRecordsBasedOnTimeRange, setAllRecordsBasedOnTimeRange] = useState([]);
    const [dataSumByTimeRange, setDataSumByTimeRange] = useState([]);
    const [dailyCollectionSummery, setDailyCollectionSummery] = useState(null);
    const [dailyCollectionSummeryShow, setDailyCollectionSummeryShow] = useState(false);
    const [weekelyWiseCollectionSummery, setWeekelyWiseCollectionSummery] = useState([]);
    const [weekelyWiseCollectionSummeryShow, setWeekelyWiseCollectionSummeryShow] = useState(false);

    const [allDailyCollection, setAllDailyCollection] = useState([]);
    const [selectedDailyCollection, setSelectedDailyCollection] = useState(null);
    const [modelOpen, setModelOpen] = useState(false);
    const today = moment().format('YYYY-MM-DD');
    const sevenDaysBefore = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
    const [modalVisible, setModalVisible] = useState(false);

    const [monthlyCollectionSum, setMonthlyCollectionSum] = useState([]);
    const [monthlyCollectionSumShow, setMonthlyCollectionSumShow] = useState(false);

    const [allRecordsBasedOnTimeRangeShow, setAllRecordsBasedOnTimeRangeShow] = useState(false);
    const [fetchAllFertilizerRecords, setFetchAllFertilizerRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [fetilizerInformations, setFetilizerInformations] = useState([]);
    const [unitDetails, setUnitDetails] = useState({
        FertilizerName: null,
        AvailableQuentity: 0,
        PricePerUnit: 0,
    });
    const [dropdownValues, setDropdownValues] = useState('all');
    const [filterValues, setFilterValues] = useState([]);
    const [current, setCurrent] = useState(0);
    const [isReject, setIsReject] = useState(false);

    const [allFields, setFields] = useState([]);
    const [inspectField, setInspectField] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [renderTab, setRenderTab] = useState(false);
    const [fieldList, setFieldList] = useState([]);

    const openDetailsModal = (edit) => {
        setOpenModal(true);
        setInfoModal(edit);
    }

    const closeDetailsModal = () => {
        setOpenModal(false);
        setInfoModal(false);
    }

    useEffect(() => {

        if (localStorage?.getItem("userRole") === "ROLE.CUSTOMER") {
            getFieldListByOwnerID(localStorage?.getItem("custID"));
        } else {
            fetchAllFields();
        }

    }, []);

    const inspectManager = (fieldID) => {
        setInspectField(fieldID);
        loadData(fieldID);
        getFieldListByOwnerID(localStorage.getItem("custID"));
    }

    const getFieldListByOwnerID = async (ownerID) => {
        const result = await apiExecutions.getFieldInfoByOwnerID(ownerID);
        if (result !== null) {
            if (result.success === true) {
                setFields(result.data);
            }
        }
    }

    const getCollectionByMonthlyCountFunc = async (fieldID) => {
        setMonthlyCollectionSumShow(false);
        const monthMap = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        };
        const response = await apiExecutions.getCollectionByMonthlyCount(fieldID);

        if (response !== null) {
            if (response.success === true) {
                const mapResults = [];
                response?.data.map((item) => {
                    const mapJson = {
                        'x': monthMap[item?.Month] ? monthMap[item?.Month] : 'Unknown',
                        'y': item?.TotalTeaWeight
                    };
                    mapResults.push(mapJson);
                });
                setMonthlyCollectionSum(mapResults);
                setMonthlyCollectionSumShow(true);
            }
        } else {
            message.error(response?.message);
        }
    }

    const loadData = async (fieldID) => {
        setSpinning(true);
        setRenderTab(false);
        const startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const endDate = new Date().toISOString().split('T')[0];

        const startDateOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
        const endDateOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
        try {
            await Promise.all([

                fetchSelectedFieldInformation(fieldID),
                fetchAllTimeSumByFieldID(fieldID),
                fetchAllRecordsBasedOnTimeRange(fieldID, startDateOfMonth, endDateOfMonth),
                fetchDataSumByTimeRange(fieldID, startDateOfMonth, endDateOfMonth),
                dailyCollectionSummeryFunc(fieldID),
                fetchAllRecordsByWeek(fieldID, startDateOfMonth, endDateOfMonth),
                getDailyTeaCollectionBetweenTwoDatesFetch(
                    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    new Date().toISOString().split('T')[0]
                ),
                fetchFertilizerRecords(fieldID),
                getCollectionByMonthlyCountFunc(fieldID),
            ]);
            setSpinning(false);
            setRenderTab(true);
        } catch (error) {
            message.error('Failed to Create Complete Inspection Snap');
            setSpinning(false);
        }
    }

    const fetchSelectedFieldInformation = async (fieldID) => {
        const response = await apiExecutions.getFieldInfoByID(fieldID);
        if (response !== null) {
            if (response.success === true) {
                setSelectedFieldInfo(response?.data[0]);
                fetchOwnerByOwnerID(response?.data[0]?.OwnerID);
            }
        }
    }

    const fetchAllRecords = async () => {
        const result = await apiExecutions.getAllFertilizerInfo();
        if (result !== null) {
            if (result.success === true) {
                setFetilizerInformations(result.data);
            } else {
                message.error('Error : ' + result.data.message);
            }
        }
    }

    const fetchAllFields = async () => {
        const response = await apiExecutions.getAllFieldInfo();
        if (response !== null && response !== undefined) {
            if (response.success === true) {
                setFields(response.data);
            } else {
                message.error('Failed to fetch Fields');
            }
        } else {
            message.error(response?.message);
        }
    }

    const fetchFertilizerRecords = async (fieldID) => {
        const response = await apiExecutions.getFertilizerOrdersByFieldID(fieldID);
        if (response !== null) {
            if (response.success === true) {
                setFetchAllFertilizerRecords(response?.data?.reverse());
            } else {
                message.error(response?.message);
            }
        }
    }

    const getOrderDetailsByOrderID = async (orderID, modalType) => {
        setSelectedRecord({});
        const result = await apiExecutions.getFertilizerOrdersByFertilizerID(orderID);
        if (result !== null) {
            if (result?.success === true) {
                setSelectedRecord(result?.data[0]);
                const record = result?.data[0]?.ApprovalStatus === 'REJECTED' ? true : false;
                setIsReject(record);
                setUnitDetails({
                    FertilizerName: fetilizerInformations?.find(item => item?.FertilizerID === result?.data[0]?.FertilizerID)?.FertilizerName,
                    AvailableQuentity: fetilizerInformations?.find(item => item?.FertilizerID === result?.data[0]?.FertilizerID)?.FertilizerQuantity,
                    PricePerUnit: fetilizerInformations?.find(item => item?.FertilizerID === result?.data[0]?.FertilizerID)?.FertilizerPrice
                });
                if (result?.data[0]?.CustomerOrderStatus === 'REQUESTED' || result?.data[0]?.CustomerOrderStatus === 'REJECTED') {
                    setCurrent(0);
                }
                if (result?.data[0]?.ApprovalStatus === 'APPROVED' || result?.data[0]?.ApprovalStatus === 'REJECTED') {
                    setCurrent(1);
                }
                if (result?.data[0]?.PaymentStatus === 'PAID') {
                    setCurrent(2);
                }
                if (result?.data[0]?.IsDelivered === 'YES') {
                    setCurrent(3);
                }
                openDetailsModal(modalType);
            } else {
                message.error('Error : ' + result?.data?.message);
            }
        }
    }

    const fetchOwnerByOwnerID = async (ownerID) => {
        const response = await apiExecutions.getCustomerByCustomerID(ownerID);
        if (response !== null) {
            if (response.success === true) {
                setOwnerDetails(response?.data[0]);
            }
        }
    }

    const fetchAllTimeSumByFieldID = async (fieldID) => {
        const response = await apiExecutions.getCollectionSumByFieldID(fieldID);
        if (response !== null) {
            if (response.success === true) {
                setAllTimeSumByFieldID(response?.data);
            }
        } else {
            message.error(response?.message);
        }
    }

    const dailyCollectionSummeryFunc = async (fieldID) => {
        setDailyCollectionSummeryShow(false);
        const date = new Date();
        const requestJson = {
            "FieldID": fieldID,
            "startDate": date.toISOString().split('T')[0],
        }
        const fullSummery = {
            fullWeight: 0,
            cutForWater: 0,
            collectedWeight: 0
        }
        const response = await apiExecutions.getCollectionSumByDateRangeAndZone(requestJson);
        if (response !== null) {
            if (response.success === true) {
                response?.data.map((item) => {
                    fullSummery.fullWeight += item?.TeaWeightCollected;
                    fullSummery.cutForWater += item?.WaterWeightCollected;
                    fullSummery.collectedWeight += item?.ActualTeaWeight;
                });
                setDailyCollectionSummery(fullSummery);
                setDailyCollectionSummeryShow(true);
            }
        } else {
            message.error(response?.message);
        }
    }

    const fetchAllRecordsBasedOnTimeRange = async (fieldID, startTime, endTime) => {
        setAllRecordsBasedOnTimeRangeShow(false);
        const requestJson = {
            "FieldID": fieldID,
            "startDate": startTime,
            "endDate": endTime
        }
        const response = await apiExecutions.getCollectionByFieldIDandTimeRange(requestJson);
        if (response !== null) {
            const responseArr = [];
            if (response.success === true) {
                const sumsByDate = {};
                response?.data?.forEach((item) => {
                    const date = item?.CollectionDate;
                    const weight = item?.ActualTeaWeight;
                    sumsByDate[date] = sumsByDate[date] || 0;
                    sumsByDate[date] += weight;
                });
                const responseArr = Object.keys(sumsByDate).map(date => ({
                    dateString: date,
                    collectionSum: sumsByDate[date]
                }));
                setAllRecordsBasedOnTimeRange(responseArr);
                if (responseArr.length > 0) {
                    setAllRecordsBasedOnTimeRangeShow(true);
                }
            }
        } else {
            message.error(response?.message);
        }
    }

    const fetchAllRecordsByWeek = async (inspectFieldID, startDate, endDate) => {
        setWeekelyWiseCollectionSummeryShow(false);
        const requestJson = {
            "FieldID": inspectFieldID,
            "startDate": startDate !== null ? startDate : new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "endDate": endDate !== null ? endDate : new Date().toISOString().split('T')[0]
        }
        const response = await apiExecutions.getCollectionByFieldIDandTimeRange(requestJson);
        if (response !== null) {
            const responseArr = [];
            if (response.success === true) {
                const sumsByDate = {};
                response?.data?.forEach((item) => {
                    const date = item?.CollectionDate;
                    const weight = item?.ActualTeaWeight;
                    const waterWeightCollection = item?.WaterWeightCollected;

                    sumsByDate[date] = sumsByDate[date] || { fullWeight: 0, waterWeight: 0 };
                    sumsByDate[date].fullWeight += weight;
                    sumsByDate[date].waterWeight += waterWeightCollection;
                });
                const responseArr = Object.keys(sumsByDate).map(date => ({
                    dateString: date,
                    collectionSum: sumsByDate[date],
                    fullWeight: sumsByDate[date].fullWeight,
                }));
                setWeekelyWiseCollectionSummery(responseArr);
                if (responseArr.length > 0) {
                    setWeekelyWiseCollectionSummeryShow(true);
                }
            }
        } else {
            message.error(response?.message);
        }
    }

    const getDailyTeaCollectionBetweenTwoDatesFetch = async (startDate, endDate) => {
        const requestJson = {
            "FieldID": inspectField,
            "startDate": startDate,
            "endDate": endDate
        }
        const response = await apiExecutions.getCollectionByFieldIDandTimeRange(requestJson);
        if (response !== null) {
            const responseArr = [];
            if (response.success === true) {
                setAllDailyCollection(response?.data?.reverse());
            }
        } else {
            message.error(response?.message);
        }
    }

    const fetchDataSumByTimeRange = async (fieldID, startDate, endDate) => {
        const requestJson = {
            "FieldID": fieldID,
            "startDate": startDate,
            "endDate": endDate,
        }
        const response = await apiExecutions.getCollectionSumOverTimeRange(requestJson);
        if (response !== null) {
            if (response.success === true) {
                setDataSumByTimeRange(response?.data);
            }
        } else {
            message.error(response?.message);
        }
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

    const Fcolumns = [
        {
            title: <span className="textStyles-small">Tracking ID</span>,
            dataIndex: 'TrackingID',
            key: 'TrackingID',
            render: (text) => <span className="textStyle-small">{text}</span>,
        },
        {
            title: <span className="textStyles-small">Requested Quantity</span>,
            dataIndex: 'OrderQuentity',
            key: 'OrderQuentity',
            render: (text) => <span className="textStyle-small">{text} Kg</span>,
        },
        {
            title: <span className="textStyles-small">Order Date</span>,
            dataIndex: 'OrderDate',
            key: 'OrderDate',
            render: (text) => <span className="textStyle-small">{dayjs(text).format('DD/MM/YYYY')}</span>,
        },
        {
            title: <span className="textStyles-small">Requested Deliver Date </span>,
            dataIndex: 'RequestedDeadLine',
            key: 'RequestedDeadLine',
            render: (text) => <span className="textStyle-small">{dayjs(text).format('DD/MM/YYYY')}</span>,
        },
        {
            title: <span className="textStyles-small">Customer Order Status</span>,
            dataIndex: 'CustomerOrderStatus',
            key: 'CustomerOrderStatus',
            render: (text) => <>
                {text === 'REQUESTED' ? <Badge status="success" text={<span className='textStyle-small'>REQUESTED</span>} /> :
                    text === 'REJECTED' ? <Badge status="error" text={<span className='textStyle-small'>REJECTED</span>} /> : null}
            </>,
        },
        {
            title: <span className="textStyles-small">Approval Status</span>,
            dataIndex: 'ApprovalStatus',
            key: 'ApprovalStatus',
            render: (text, record) => (
                record?.CustomerOrderStatus === 'REQUESTED' ? (
                    text === 'PENDING' ? <Badge status="processing" text={<span className='textStyle-small'>PENDING</span>} /> :
                        text === 'APPROVED' ? <Badge status="success" text={<span className='textStyle-small'>APPROVED</span>} /> :
                            text === 'REJECTED' ? <Badge status="error" text={<span className='textStyle-small'>REJECTED</span>} /> : null
                ) : (
                    <Badge status="error" text={<span className='textStyle-small'>REJECTED</span>} />
                )
            ),
        },
        {
            title: <span className="textStyles-small">Payment Status</span>,
            dataIndex: 'PaymentStatus',
            key: 'PaymentStatus',
            render: (text, record) => (
                record?.CustomerOrderStatus === 'REQUESTED' ? (
                    text === 'UNPAID' ? <Badge status="error" text={<span className='textStyle-small'>UNPAID</span>} /> :
                        text === 'PAID' ? <Badge status="success" text={<span className='textStyle-small'>PAID</span>} /> :
                            <Badge status="error" text={<span className='textStyle-small'>UNPAID</span>} />
                ) : (
                    <Badge status="error" text={<span className='textStyle-small'>REJECTED</span>} />
                )
            )
        },
        {
            title: <span className="textStyles-small">Is Delivered</span>,
            dataIndex: 'IsDelivered',
            key: 'IsDelivered',
            render: (text) => <>
                {text === 'NO' ? <Badge status="error" text={<span className='textStyle-small'>NO</span>} /> :
                    text === 'ONTHEWAY' ? <Badge status="processing" text={<span className='textStyle-small'>ONWAY</span>} /> :
                        text === 'YES' ? <Badge status="success" text={<span className='textStyle-small'>YES</span>} /> : null
                }</>,
        },
        {
            title: <span className="textStyles-small">Action</span>,
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary"
                        icon={<EyeOutlined />}
                        style={{ background: '#3bb64b', borderColor: '#3bb64b' }}
                        shape="circle"
                        size="small"
                        onClick={() => { getOrderDetailsByOrderID(record.ORDER_ID, true) }}
                    />
                </Space>
            ),
        },
    ];

    const timeRangeFetcher = (values) => {
        const startDate = values[0]?.format('YYYY-MM-DD');
        const endDate = values[1]?.format('YYYY-MM-DD');
        getDailyTeaCollectionBetweenTwoDatesFetch(startDate, endDate);
    }

    const timeRangeFetcherMain = (values) => {
        const startDate = values[0]?.format('YYYY-MM-DD');
        const endDate = values[1]?.format('YYYY-MM-DD');
        fetchAllRecordsByWeek(inspectField, startDate, endDate);
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

    const items = [
        {
            key: '1',
            label: <span className='textStyles-small'>Basic Information </span>,
            children: <>
                <div>
                    <GoogleMap
                        options={{ disableDefaultUI: true }}
                        mapContainerStyle={mapStyles}
                        zoom={15}
                        center={{
                            lat: !isNaN(Number(selectedFieldInfo?.Attitude)) ? Number(selectedFieldInfo?.Attitude) : 0,
                            lng: !isNaN(Number(selectedFieldInfo?.Longitude)) ? Number(selectedFieldInfo?.Longitude) : 0
                        }}
                    >
                        <Marker position={{
                            lat: !isNaN(Number(selectedFieldInfo?.Attitude)) ? Number(selectedFieldInfo?.Attitude) : 0,
                            lng: !isNaN(Number(selectedFieldInfo?.Longitude)) ? Number(selectedFieldInfo?.Longitude) : 0
                        }} />
                    </GoogleMap>
                </div>
                <Descriptions bordered column={2} size='small' className='textStyles-small' style={{ marginTop: 10 }}>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Field ID</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.FieldName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Field Name</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.FieldSize} Hec.</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Field Size</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.FieldType} </span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Field Address</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.FieldAddress}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Tea Type</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.TeaType}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Base Location</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.BaseLocation}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Base Elevation</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.BaseElevation}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Soil Type</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.SoilType}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Lattitude</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.Attitude}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Longitude</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.Longitude}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Field Registration Date</span>}>
                        <span className='textStyles-small'>{moment(selectedFieldInfo?.FieldRegistrationDate).format('DD-MM-YYYY')}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Route ID</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.RouteID}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Owner ID</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.OwnerID}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Zone ID</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.ZoneID}</span>
                    </Descriptions.Item>
                </Descriptions>
            </>
        },
        {
            key: '2',
            label: <span className='textStyles-small'>Inspection Details</span>,
            children: <>
                <Row>
                    <Col span={12}>
                        <Card
                            style={{
                                width: '99%', borderRadius: '10px', marginTop: '20px', marginBottom: '20px', cursor: "pointer"
                            }}
                        >
                            <Row>
                                <Col span={12}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        float: "left",
                                    }}>
                                        <div style={{
                                            background: "white",
                                            borderRadius: "50%",
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "8px",
                                            backgroundColor: "#2d5ff4"
                                        }}>
                                            <ShoppingOutlined style={{ color: "white", fontSize: '15px' }} />
                                        </div>
                                        <span className="textStyles-small" style={{ color: "gray", textAlign: "center", fontSize: "13px" }}>
                                            Overall Collection Sum
                                        </span>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <h3 className="textStyles-small" class="m-0" style={{ marginTop: '3px', float: "right", marginRight: "20px" }}>
                                        <b>{allTimeSumByFieldID[0]?.TotalTeaWeight} Kg</b>
                                    </h3>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card
                            style={{
                                width: '99%', borderRadius: '10px', marginTop: '20px', marginBottom: '20px', cursor: "pointer"
                            }}

                        >
                            <Row>
                                <Col span={12}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        float: "left",
                                    }}>
                                        <div style={{
                                            background: "white",
                                            borderRadius: "50%",
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "8px",
                                            backgroundColor: "gray"
                                        }}>
                                            <CheckOutlined style={{ color: "white", fontSize: '15px' }} />
                                        </div>
                                        <span className="textStyles-small" style={{ color: "gray", textAlign: "center", fontSize: "13px" }}>
                                            Collection Sum This Month
                                        </span>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <h3 className="textStyles-small" class="m-0" style={{ marginTop: '3px', float: "right", marginRight: "20px" }}>
                                        <b>{dataSumByTimeRange[0]?.TotalTeaWeight} Kg</b>
                                    </h3>
                                </Col>
                            </Row>
                        </Card>
                    </Col>


                </Row>

                <Row>
                    <Col span={16}>
                        <div style={{ marginTop: 20, width: '100%', height: 350, backgroundColor: 'white', borderRadius: 10, padding: 5, border: '1px solid #ddd' }}>
                            {allRecordsBasedOnTimeRangeShow ? (
                                <AreaChart
                                    xValues={allRecordsBasedOnTimeRange.map((item) => new Date(item?.dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}
                                    data={
                                        allRecordsBasedOnTimeRange.map((item) => ({
                                            x: new Date(item?.dateString),
                                            y: item?.collectionSum
                                        }))}
                                    xInfo='DATE'
                                />
                            ) : null}
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ marginTop: 20, width: '100%', height: 350, backgroundColor: 'white', borderRadius: 10, padding: 10, marginLeft: 10, border: '1px solid #ddd' }}>
                            <span className='textStyles-small' style={{ fontSize: 14, fontWeight: 'bold', color: '#373d3f', marginLeft: 10, marginTop: '40px' }}>
                                Daily Collection Summery
                            </span>
                            {
                                dailyCollectionSummeryShow ? (
                                    <DonutChart
                                        data={[dailyCollectionSummery?.cutForWater, dailyCollectionSummery?.collectedWeight]}
                                        categories={['Cut for Water', 'Collected Weight']}
                                    />
                                ) : null
                            }
                        </div>
                    </Col>
                </Row>

                <Row>
                    <div style={{ marginTop: 30, width: '100%', height: 'auto', backgroundColor: 'white', borderRadius: 10, padding: 5, border: '1px solid #ddd' }}>
                        <Row style={{ marginBottom: 10 }}>
                            <Col span={12}>
                                <span className='textStyles-small' style={{ fontSize: 14, fontWeight: 'bold', color: '#373d3f', marginLeft: 10, marginTop: '40px' }}>
                                    Collection Summery By Time Range
                                </span>
                            </Col>
                            <Col span={12}>
                                <RangePicker
                                    style={{ marginLeft: 10, fontSize: '12px', float: 'right' }}
                                    format={dateFormat} onChange={timeRangeFetcherMain}
                                    defaultValue={[dayjs().startOf('month'), dayjs().endOf('month')]}
                                />
                            </Col>
                        </Row>
                        {
                            weekelyWiseCollectionSummeryShow ? (
                                <DualBarChart
                                    categories={weekelyWiseCollectionSummery.map((item) => moment(item?.dateString).format('DD-MM-YYYY'))}
                                    collectioX={weekelyWiseCollectionSummery.map((item) => item?.collectionSum?.fullWeight)}
                                    collectioY={weekelyWiseCollectionSummery.map((item) => item?.collectionSum?.waterWeight)}
                                    yTitle='Collection Sum In KG'
                                    xTitle='Collected Date'
                                />
                            ) : null
                        }
                    </div>
                </Row>

                <Row>
                    <div style={{ marginTop: 30, width: '100%', height: 'auto', backgroundColor: 'white', borderRadius: 10, padding: 5, border: '1px solid #ddd' }}>
                        <Row style={{ marginBottom: 10 }}>
                            <Col span={12}>
                                <span className='textStyles-small' style={{ fontSize: 14, fontWeight: 'bold', color: '#373d3f', marginLeft: 10, marginTop: '40px' }}>
                                    Collection Sum By Monthly
                                </span>
                            </Col>
                        </Row>
                        {
                            weekelyWiseCollectionSummeryShow ? (
                                <DualBarChart
                                    categories={monthlyCollectionSum.map((item) => item.x)}
                                    collectioX={monthlyCollectionSum.map((item) => item.y)}
                                    horizontalx={true}
                                    xTitle='Collection Sum In KG'
                                    yTitle='Month'
                                />
                            ) : null
                        }
                    </div>
                </Row>
            </>
        },
        {
            key: '3',
            label: <span className='textStyles-small'>Collection Report</span>,
            children: <>
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
                                <CSVLink
                                    data={allDailyCollection}
                                    filename={`customers-${moment().format('YYYY-MM-DD')}.csv`}
                                    target='_blank'
                                >
                                    <Button type="primary"
                                        className="textStyles-small"
                                        style={{ borderRadius: "50px", background: '#3bb64b', borderColor: '#3bb64b' }}>
                                        <DownloadOutlined /> Export Records
                                    </Button>
                                </CSVLink>
                            </Space>
                        </div>
                    </Space>
                </div>
                <div style={{ padding: 10, background: 'white', borderRadius: 10, marginTop: '10px' }}>
                    <Table
                        dataSource={allDailyCollection}
                        columns={columns}
                        loading={allDailyCollection.length === 0}
                        pagination={true}
                        size="small"
                    />
                </div>
            </>
        },
        {
            key: '4',
            label: <span className='textStyles-small'>Fertilizer Orders</span>,
            children: <>
                <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
                    <Table
                        columns={Fcolumns}
                        dataSource={fetchAllFertilizerRecords} />
                </div>

            </>
        },
        {
            key: '5',
            label: <span className='textStyles-small'>Owner Information</span>,
            children: <>
                <Descriptions bordered column={2} size='small' className='textStyles-small' style={{ marginTop: 10 }}>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Customer ID</span>}>
                        <span className='textStyles-small'>{ownerDetails?.CustomerID}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Customer Name</span>}>
                        <span className='textStyles-small'>{ownerDetails?.CustomerName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Customer Mobile</span>}>
                        <span className='textStyles-small'>{ownerDetails?.CustomerMobile}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Customer Address</span>}>
                        <span className='textStyles-small'>{ownerDetails?.CustomerAddress}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Customer Email</span>}>
                        <span className='textStyles-small'>{ownerDetails?.CustomerEmail}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Customer Type</span>}>
                        <span className='textStyles-small'>{ownerDetails?.CustomerType}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Registration Date</span>}>
                        <span className='textStyles-small'>{moment(ownerDetails?.RegistrationDate).format('DD-MM-YYYY')}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Identiti Card Number</span>}>
                        <span className='textStyles-small'>{ownerDetails?.IdentitiCardNumber}</span>
                    </Descriptions.Item>
                </Descriptions>
            </>,
        }
    ];

    const onChange = (key) => {
        console.log(key);
    };

    return (
        <>
            <Spin
                spinning={spinning}
                fullscreen
                size="large"
            />
            <h1 className="headingStyle2">Field Inspection</h1>
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
                                <span>Insights</span>
                            </>
                        ),
                    },
                    {
                        href: '',
                        title: 'Field Inspection',
                    },
                ]}
            />

            <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
                <Space>
                    <div style={{ padding: 10, background: 'white', borderRadius: 10, display: 'flex', justifyContent: 'flex-end' }}>
                        <Space align="end">
                            <Select style={{ width: 250, fontSize: '10px' }}
                                placeholder="Choose Field For Inspection"
                                onChange={(value) => inspectManager(value)}
                                className='textStyle-small'
                            >
                                {
                                    allFields?.map((item) => (
                                        <Option key={item?.FieldID} value={item?.FieldID}>
                                            {item?.FieldName}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Space>
                    </div>
                </Space>
            </div>

            {
                renderTab ? (
                    <div style={{ padding: 10, background: 'white', borderRadius: 10, marginTop: 10 }}>
                        <Tabs defaultActiveKey="1" items={items} onChange={onChange} destroyInactiveTabPane />
                    </div>
                ) : null
            }

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

            <Modal
                width={800}
                title={<span className="textStyle-small" style={{ fontSize: 14 }}>
                    {
                        infoModal === false ? (
                            'Fertilizer Order Management'
                        ) : ('Fertilizer Order Information')
                    }
                </span>}
                visible={openModal}
                onOk={closeDetailsModal}
                onCancel={closeDetailsModal}
                footer={null}
                destroyOnClose={true}
            >
                <div>
                    {
                        infoModal === true && (
                            <Row>
                                <Col span={24}>
                                    <Steps
                                        style={{ marginBottom: 20, marginTop: 20 }}
                                        current={current}
                                        size="small"
                                        items={[
                                            {
                                                title: <span className='textStyle-small' style={{ fontSize: 12 }}>
                                                    Requested
                                                </span>,
                                                description: <span className='textStyle-small' style={{ fontSize: 11 }}>
                                                    Customer {selectedRecord.CustomerOrderStatus} the Order
                                                </span>,
                                            },
                                            {
                                                title: <span className='textStyle-small' style={{ fontSize: 12 }}>
                                                    Admin Approval
                                                </span>,
                                                description: <span className='textStyle-small' style={{ fontSize: 11 }}>
                                                    {selectedRecord.ApprovalStatus === 'APPROVED' ? `Admin Approved The Order ${dayjs(selectedRecord?.ApproveDate).format('DD/MM/YYYY')}`
                                                        : selectedRecord.ApprovalStatus === 'REJECTED' ? 'Admin Rejected The Order' : 'Admin Will Be Review The Order'}
                                                </span>,
                                            },
                                            {
                                                title: <span className='textStyle-small' style={{ fontSize: 12 }}>
                                                    Payment Status
                                                </span>,
                                                description: <span className='textStyle-small' style={{ fontSize: 11 }}>
                                                    {selectedRecord.PaymentStatus === 'PAID' ? 'Payment Recived' : 'Waiting for Payment'}
                                                </span>,
                                            },
                                            {
                                                title: <span className='textStyle-small' style={{ fontSize: 12 }}>
                                                    Delivery Status
                                                </span>,
                                                description: <span className='textStyle-small' style={{ fontSize: 11 }}>
                                                    {selectedRecord.IsDelivered === 'YES' ? 'Order Delivered To Customer'
                                                        : selectedRecord.IsDelivered === 'ONTHEWAY' ? 'Order On The Way' : 'Not Delivered Yet'}
                                                </span>,
                                            },

                                        ]}
                                    />

                                    <Descriptions bordered column={2} size="small" style={{ width: '100%', marginBottom: 10 }}>
                                        <Descriptions.Item label={<span className='textStyle-small'>Tracking ID</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.TrackingID}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Field ID</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.FieldID}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Fertilizer Name</span>} span={1}>
                                            <span className='textStyle-small'>{unitDetails.FertilizerName}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Requested Quantity</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.OrderQuentity} Kg</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Approved Quantity</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.ApprovedQuantity} Kg</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Price Per Unit</span>} span={1}>
                                            <span className='textStyle-small'>LKR. {unitDetails.PricePerUnit}.00</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Order Value</span>} span={1}>
                                            <span className='textStyle-small'>LKR. {unitDetails.PricePerUnit * selectedRecord.OrderQuentity}.00</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Order Date</span>} span={1}>
                                            <span className='textStyle-small'>{dayjs(selectedRecord.OrderDate).format('DD/MM/YYYY')}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Requested Deliver Date</span>} span={1}>
                                            <span className='textStyle-small'>{dayjs(selectedRecord.RequestedDeadLine).format('DD/MM/YYYY')}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Customer Order Status</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.CustomerOrderStatus}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Approval Status</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.ApprovalStatus}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Approved By</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.ApprovedBy}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Payment Status</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.PaymentStatus}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Remarks</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.Remarks}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Approve Date</span>} span={1}>
                                            <span className='textStyle-small'>{dayjs(selectedRecord.ApproveDate).format('DD/MM/YYYY')}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Supposed Delivery Date</span>} span={1}>
                                            <span className='textStyle-small'>{dayjs(selectedRecord.SupposedDeliveryDate).format('DD/MM/YYYY')}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className='textStyle-small'>Is Delivered</span>} span={1}>
                                            <span className='textStyle-small'>{selectedRecord.IsDelivered}</span>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>
                        )
                    }
                </div>
            </Modal>
        </>
    )
}

export default FieldInspection;