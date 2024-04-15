import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../../api/api-call';
import { Tabs, Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb, DatePicker, Badge, Steps } from 'antd';
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
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { CSVLink, CSVDownload } from "react-csv";
import moment from '../../../node_modules/moment/moment';
import '../charts/chart-styles.css';

const FieldInspection = () => {

    const [selectedFieldInfo, setSelectedFieldInfo] = useState({});
    const [ownerDetails, setOwnerDetails] = useState({});

    useEffect(() => {
        fetchSelectedFieldInformation();
    }, []);

    const fetchSelectedFieldInformation = async () => {
        const response = await apiExecutions.getFieldInfoByID(171683694);
        if (response !== null) {
            if (response.success === true) {
                setSelectedFieldInfo(response?.data[0]);
                fetchOwnerByOwnerID(response?.data[0]?.OwnerID);
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



    // {
    //     "0": {
    //         "FieldID": 171683694,
    //         "FieldName": "Field_171683694",
    //         "FieldSize": 3,
    //         "FieldType": "SMALL",
    //         "FieldAddress": "saadsadsad",
    //         "TeaType": "camellia sinensis assamica",
    //         "BaseLocation": "Ratnapura",
    //         "BaseElevation": 10.3,
    //         "SoilType": "Reddish Brown Earths",
    //         "Attitude": "32.00",
    //         "Longitude": "2323.00",
    //         "FieldRegistrationDate": "2024-04-01T18:30:00.000Z",
    //         "RouteID": 513113077,
    //         "OwnerID": 730260954,
    //         "ZoneID": 680653,
    //         "FactoryID": 1
    //     }
    // }
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
                        <span className='textStyles-small'>{selectedFieldInfo?.FieldSize}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Field Size</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.FieldType} Hechtares</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Field Type</span>}>
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
                    <Descriptions.Item label={<span className='textStyles-small' style={{ fontSize: 12, fontWeight: 'bold' }}>Factory ID</span>}>
                        <span className='textStyles-small'>{selectedFieldInfo?.FactoryID}</span>
                    </Descriptions.Item>
                </Descriptions>

                <Descriptions bordered column={2} size='small' className='textStyles-small' style={{ marginTop: 10 }} title={<span className='textStyles-small' style={{ fontSize: 14, fontWeight: 'bold' }}>Owner Details</span>}>
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

            </>
        },
        {
            key: '2',
            label: <span className='textStyles-small'>Inspection Details</span>,
            children: 'Content of Tab Pane 2',
        },
        {
            key: '3',
            label: <span className='textStyles-small'>Inspection Report</span>,
            children: 'Content of Tab Pane 3',
        },
        {
            key: '4',
            label: <span className='textStyles-small'>Inspection Report</span>,
            children: 'Content of Tab Pane 4',
        },
        {
            key: '5',
            label: <span className='textStyles-small'>Inspection Report</span>,
            children: 'Content of Tab Pane 5',
        }
    ];

    const onChange = (key) => {
        console.log(key);
    };


    return (
        <>
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
                                <span>Utils</span>
                            </>
                        ),
                    },
                    {
                        href: '',
                        title: 'Field Inspection',
                    },
                ]}
            />

            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
        </>
    )
}

export default FieldInspection;