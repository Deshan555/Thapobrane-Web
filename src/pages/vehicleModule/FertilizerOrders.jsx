import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticationCheck } from '../vehicleModule/AuthChecker';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb, Avatar, Card, Badge, Divider, Tabs, Steps  } from 'antd';
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

const FOrder = () => {
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
        authenticationCheck(navigate);
        fetchAllRecords();
        getFieldListByOwnerID(localStorage.getItem("custID"));
    }, []);

    
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

    const rejectOrderByCustomers = async (orderID) => {
        const result = await apiExecutions.rejectFertilizerOrder(orderID);
        if (result !== null) {
            if (result.success === true) {
                message.success('Order Rejected Successfully');
                getFieldListByOwnerID(localStorage.getItem("custID"));
                closeDetailsModal();
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const orderRejectionModal = (orderID) => {
        const { confirm } = Modal;
        confirm({
            title: "Are you sure you want to reject this order?",
            onOk: async () => {
                rejectOrderByCustomers(orderID);
            },
            onCancel() { },
        });
    }

    const openDetailsModal = (edit) => {
        setOpenModal(true);
        setInfoModal(edit);
    }

    const closeDetailsModal = () => {
        setOpenModal(false);
        setInfoModal(false);
    }

    const getFieldListByOwnerID = async (ownerID) => {
        const result = await apiExecutions.getFieldInfoByOwnerID(ownerID);
        if (result !== null) {
            const fieldArray = [];
            if (result.success === true) {
                setFieldList(result?.data);
                result?.data?.map((item, index) => {
                    fieldArray.push(item.FieldID);
                })
            }
            fetchFertilizerRecords(fieldArray);
        }
    }

    const fetchFertilizerRecords = async (fieldID) => {
        const dataArr = [];

        fieldID?.map(async (item, index) => {
            const response = await apiExecutions.getFertilizerOrdersByFieldID(item);
            if (response !== null) {
                if (response.success === true) {
                    response?.data?.map((item, index) => {
                        dataArr.push(item);
                    })
                }
            }
        })
        const sortArr = dataArr.sort((a, b) => {
            return new Date(b.OrderDate) - new Date(a.OrderDate);
        });
        setFetchAllFertilizerRecords(sortArr);
    }

    const onFinishForm = (values) => {
        const requestJson = {
            FertilizerID: selectedRecord.FertilizerID,
            FieldID: values.FieldID,
            OrderQuentity: values.OrderQuentity,
            OrderDate: dayjs().format('YYYY-MM-DD'),
            RequestedDeadLine: dayjs(values.RequestedDeadLine).format('YYYY-MM-DD'),
            CustomerOrderStatus: 'REQUESTED'
        }
        confirmationCreateModal(requestJson);
    }

    const confirmationCreateModal = (data) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are you sure you want to place that order ?",
            onOk: async () => {
                makeFertilizerOrder(data);
            },
            onCancel() { },
        });
    };
    
    const makeFertilizerOrder = async (requestJson) => {
        const response = await apiExecutions.placeFertilizerOrder(requestJson);
        console.log(response);
        if (response !== null) {
            console.log(response);
            if (response.success === true) {
                message.success('Fertilizer Order Placed Successfully');
                getFieldListByOwnerID(localStorage.getItem("custID"));
                modalClose();
            } else {
                message.error('Error : ' + response.message);
            }
        }
    }

    const fetchAllRecords = async () => {
        const result = await apiExecutions.getAllFertilizerInfo();
        if (result !== null) {
            if (result.success === true) {
                setAllRecords(result?.data);
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const updateRecords = async (id, data) => {
        const result = await apiExecutions.updateFertilizerInfo(id, data);
        if (result !== null) {
            if (result.success === true) {
                message.success('Fertilizer Record Updated Successfully');
                fetchAllRecords();
                modalClose();
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const deleteRecordByID = async (id) => {
        const result = await apiExecutions.deleteFertilizerInfo(id);
        if (result !== null) {
            if (result.success === true) {
                message.success('Fertilizer Record Deleted Successfully');
                fetchAllRecords();
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const fetchDataByID = async (id) => {
        const result = await apiExecutions.getFertilizerInfoByID(id);
        if (result !== null) {
            if (result.success === true) {
                setSelectedRecord(result.data[0]);
                setIsModalVisible(true);
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const confirmUpdateModal = (id, data) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are you sure you want to update this Fertilizer Record?",
            onOk: async () => {
                updateRecords(id, data);
            },
            onCancel() { },
        });
    }

    const confirmDeleteModal = (id) => {
        const { confirm } = Modal;
        confirm({
            title: "Are you sure you want to delete this Fertilizer Record?",
            onOk: async () => {
                deleteRecordByID(id);
            },
            onCancel() { },
        });
    }

    const modalClose = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
        setIsEdit(false);
        setIsView(false);
    }

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
                    {
                        record?.ApprovalStatus === 'PENDING' ? (
                            <Button type="primary"
                                icon={<CloseCircleOutlined />}
                                style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}
                                shape="circle"
                                size="small"
                                onClick={() => { orderRejectionModal(record.ORDER_ID) }}
                            />
                        ) : null
                    }
                </Space>
            ),
        },
    ];


    const items = [
        {
          key: '1',
          label: <span className='textStyle-small'>Products Page</span>,
          children: <>
          <h1 className='textStyle-small' style={{ fontSize: '20px' }}>
            Hey, <span style={{color: 'gray'}}>WelCome To Mini Mart
            </span>
          </h1>
          <span className='textStyle-small'>
          Welcome to our Tea Field Fertilizer Emporium! We've got the perfect fertilizers for your tea plants, whether you need organic or quick-acting blends. And right now, we're offering special discounts and free delivery. Shop now to give your tea field the nourishment it needs to thrive!
          </span>
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
                                actions={[
                                    <EyeOutlined key="view"
                                        onClick={() => {
                                            setSelectedRecord([]);
                                            setIsEdit(false);
                                            setIsView(true);
                                            fetchDataByID(item?.FertilizerID);
                                        }} />,
                                    <ShoppingCartOutlined key="edit" onClick={() => {
                                        setIsEdit(true);
                                        setIsView(false);
                                        fetchDataByID(item?.FertilizerID);
                                    }} />,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                            >
                                <Meta
                                    style={{ height: "75%" }}
                                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                                    title={item.FertilizerName}
                                    description={<>
                                        <div style={{ height: '140px' }}>
                                            <span className='textStyle-small'>{item.FertilizerDescription}</span><br></br>
                                            <Badge status="success" style={{ marginTop: 5 }}
                                                text={<span className='textStyle-small'>Available {item.FertilizerQuantity} Kg/l</span>}
                                            /><br></br>
                                            <Badge status="success" text={<span className='textStyle-small'>Price {item.FertilizerPrice} LKR</span>} />
                                        </div>
                                    </>}
                                />
                            </Card>
                        )
                    })
                }
            </Row>
          </>,
        },
        {
          key: '2',
          label: <span className='textStyle-small'>My Orders</span>,
          children:  <>
          <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
              <Table
                  columns={Fcolumns}
                  dataSource={fetchAllFertilizerRecords} />
          </div>
      </>
        },
      ];

    return (
        <>
            <h1 className="headingStyle2">Mini Mart </h1>
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
                        title: 'Mini Mart',
                    },
                ]}
            />

            <Modal
                title={
                    isEdit ? (
                        <span className="textStyles-small" style={{ fontSize: '14px' }}>Place Fertilizer Order</span>
                    ) : isView ? (
                        <span className="textStyles-small" style={{ fontSize: '14px' }}>View Fertilizer Record</span>
                    ) : (
                        <span className="textStyles-small" style={{ fontSize: '14px' }}>Add Fertilizer Record</span>
                    )
                }
                visible={isModalVisible}
                footer={null}
                handleOk={modalClose}
                handleCancel={modalClose}
                width={800}
                destroyOnClose={true}
            >
                <div style={{ margin: '20px 20px 20px 20px' }}>
                    {
                        isView === false ? (
                            <>
                                <Descriptions
                                    bordered
                                    size="small"
                                    column={2}
                                    style={{ marginTop: 20 }}>
                                    <Descriptions.Item label="Fertilizer Name" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerName}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Code Name" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.CodeName}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Type" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerType}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Price" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerPrice} Per Unit</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Quantity" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerQuantity}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Vendor Name" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.VendorName}</span>
                                    </Descriptions.Item>
                                </Descriptions>

                                <Form
                                    layout="vertical"
                                    name="basic"
                                    onFinish={onFinishForm}
                                    className="textStyles-small"
                                    style={{ marginTop: '20px' }}
                                >
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item
                                                label={<span className='textStyle-small'>
                                                    Order Quentity (Max {selectedRecord?.FertilizerQuantity}Units)
                                                </span>}
                                                name="OrderQuentity"
                                                rules={[
                                                    { required: true, message: 'Please input Order Quantity!' },
                                                    {
                                                        validator(_, value) {
                                                            if (!value || (value >= 1 && value <= selectedRecord?.FertilizerQuantity)) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(new Error('Order Quantity must be between 1 and ' + selectedRecord?.FertilizerQuantity));
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Input style={{ width: '90%' }} type='number'
                                                    onChange={(e) => {
                                                        setOrderPrice(e.target.value * selectedRecord?.FertilizerPrice);
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label={<span className='textStyle-small'>
                                                    Requested Delivery Date
                                                </span>}
                                                rules={[{ required: true, message: 'Please input Requested Delivery Date!' }]}
                                                name="RequestedDeadLine">
                                                <DatePicker style={{ width: '90%' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col span={12}>
                                            <Form.Item
                                                label={<span className='textStyle-small'>Field Name</span>}
                                                name="FieldID"
                                                rules={[{ required: true, message: 'Please select Field Name!' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    style={{ width: '90%' }}
                                                    placeholder="Select Field Name"
                                                    optionFilterProp="children"
                                                >
                                                    {
                                                        fieldList?.map((item, index) => {
                                                            return (
                                                                <Select.Option key={index} value={item.FieldID}>
                                                                    {item.FieldName}
                                                                </Select.Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {
                                        orderPriceCal ? (
                                            <>
                                                <Divider type="horizontal" style={{ marginTop: '10px' }} />
                                                <Row>
                                                    <Col span={24}>
                                                        <span className='textStyle-small'> Total Order Price</span><br></br>
                                                        <span className='textStyle-small' style={{ fontSize: '20px' }}>
                                                            = {orderPriceCal} LKR</span>
                                                    </Col>
                                                </Row>
                                            </>
                                        ) : null
                                    }

                                    <Row>
                                        <Col span={24}>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" style={{marginTop: 10, width: '150px'}}>
                                                    <span className='textStyle-small'>
                                                        Place Order
                                                    </span>
                                                </Button>
                                                <Button type="primary" style={{ width: '150px', marginTop: '10px', marginLeft: 10 }} danger onClick={modalClose}>
                                    <span className="textStyles-small">Close View</span>
                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form></>) : null
                    }

                    {
                        isView ? (
                            <div>
                                <Descriptions
                                    bordered
                                    size="small"
                                    column={2}
                                    style={{ marginTop: 20 }}>
                                    <Descriptions.Item label="Fertilizer Name" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerName}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Code Name" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.CodeName}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Type" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerType}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Price" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerPrice} Per Unit</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Quantity" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerQuantity}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Vendor Name" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.VendorName}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Fertilizer Description" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.FertilizerDescription}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Instructions To Store" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.InstructionsToStore}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Instructions To Use" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{selectedRecord?.InstructionsToUse}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Last Update" className="textStyle-small" style={{ fontSize: '12px' }}>
                                        <span className="textStyle-small">{dayjs(selectedRecord?.LastUpdate).format('MMMM D, YYYY h:mm A')}</span>
                                    </Descriptions.Item>
                                </Descriptions>

                                <Button type="primary" style={{ width: '150px', marginTop: '10px' }} danger onClick={modalClose}>
                                    <span className="textStyles-small">Close View</span>
                                </Button>
                            </div>
                        ) : null
                    }
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

            <Tabs defaultActiveKey="1" items={items} />
        </>
    )
}

export default FOrder;