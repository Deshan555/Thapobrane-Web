import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticationCheck } from '../vehicleModule/AuthChecker';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb, Avatar, Card, Badge, Divider, Tabs, Steps } from 'antd';
import {
    MailOutlined,
    DeleteOutlined,
    PhoneOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    ShoppingCartOutlined,
    EyeOutlined,
    HomeOutlined, EllipsisOutlined, SettingOutlined
} from '@ant-design/icons';
import { CSVLink, CSVDownload } from "react-csv";
import './style.css';
import dayjs from 'dayjs';
import { max } from 'lodash';
import { DatePicker } from '../../../node_modules/antd/es/index';
const { Meta } = Card;

const Complaints = () => {
    const [selectedRecord, setSelectedRecord] = useState({});
    const [allRecords, setAllRecords] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isView, setIsView] = useState(false);
    const [fieldList, setFieldList] = useState([]);
    const [orderPriceCal, setOrderPrice] = useState(0);
    const [infoModal, setInfoModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [current, setCurrent] = useState(0);
    const [isReject, setIsReject] = useState(false);
    const navigate = useNavigate();
    const [fetchAllFertilizerRecords, setFetchAllFertilizerRecords] = useState([]);
    const [unitDetails, setUnitDetails] = useState({
        FertilizerName: null,
        AvailableQuentity: 0,
        PricePerUnit: 0,
    });
    const [fetilizerInformations, setFetilizerInformations] = useState([]);

    useEffect(() => {
        fetchAllRecords();
    }, []);

    const fetchAllRecords = async () => {
        const result = await apiExecutions.getAllComplaints();
        if (result !== null) {
            if (result.success === true) {
                setAllRecords(result?.data?.reverse());
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    return (
        <>
            <h1 className="headingStyle2">Complaints </h1>
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
                                <span>Support</span>
                            </>
                        ),
                    },
                    {
                        href: '',
                        title: 'Complaints',
                    },
                ]}
            />
            <Row>
                {
                    allRecords?.map((item, index) => {
                        return (
                            <Card
                                key={index}
                                style={{
                                    width: 300,
                                    height: 'auto',
                                    margin: '10px',
                                    borderRadius: 10,
                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                    transition: '0.3s',
                                }}
                            // actions={[
                            //     <EyeOutlined key="view"
                            //         onClick={() => {
                            //             // setSelectedRecord([]);
                            //             // setIsEdit(false);
                            //             // setIsView(true);
                            //             // fetchDataByID(item?.FertilizerID);
                            //         }} />,
                            //     <ShoppingCartOutlined key="edit" onClick={() => {
                            //         // setIsEdit(true);
                            //         // setIsView(false);
                            //         // fetchDataByID(item?.FertilizerID);
                            //     }} />,
                            //     <EllipsisOutlined key="ellipsis" />,
                            // ]}
                            >
                                <Meta
                                    style={{ height: "75%" }}
                                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                                    title={item?.ComplaintDate ? new Date(item?.ComplaintDate).toDateString() : 'No Date'}
                                    description={<>
                                        <div style={{ height: '140px' }}>
                                            <span className='textStyle-small'>{item?.ComplaintDescription}</span><br></br>
                                            <Badge status="success" style={{ marginTop: 5 }}
                                                text={<span className='textStyle-small'>About {item?.ComplaintType}</span>}
                                            /><br></br>
                                            <Badge status="success" text={<span className='textStyle-small'>By {item?.ComplainerName}</span>} />
                                        </div>
                                    </>}
                                />
                            </Card>
                        )
                    })
                }
            </Row>
        </>
    )
}

export default Complaints;