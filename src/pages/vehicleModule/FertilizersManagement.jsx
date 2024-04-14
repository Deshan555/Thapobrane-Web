import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb, DatePicker, Badge } from 'antd';
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
import { CSVLink, CSVDownload } from "react-csv";
import './style.css';
import dayjs from 'dayjs';
import moment from '../../../node_modules/moment/moment';
import { max, min, set } from 'lodash';

const FertilizerManagement = () => {
    const [fetchAllFertilizerRecords, setFetchAllFertilizerRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [isReject, setIsReject] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [fetilizerInformations, setFetilizerInformations] = useState([]);
    const [unitDetails, setUnitDetails] = useState({
        FertilizerName : null,
        AvailableQuentity : 0,
        PricePerUnit : 0,
    });

    const openDetailsModal = (edit) => {
        setOpenModal(true);
        setInfoModal(edit);
    }

    const closeDetailsModal = () => {
        setOpenModal(false);
        setInfoModal(false);
    }

    useEffect(() => {
        fetchAllRecords();
        fetchAllFertilizerRecordsList();
    }, []);

    const fetchAllFertilizerRecordsList = async () => {
        const result = await apiExecutions.getAllDertilizerOrdersList();
        if (result !== null) {
            if (result?.success === true) {
                setFetchAllFertilizerRecords(result?.data);
            } else {
                message.error('Error : ' + result?.data?.message);
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

    /*
    ORDER_ID	3
FertilizerID	389804
FieldID	787328625
OrderQuentity	100
OrderDate	"2024-04-12T18:30:00.000Z"
RequestedDeadLine	"2024-04-30T18:30:00.000Z"
CustomerOrderStatus	"PENDING"
ApprovalStatus	"PENDING"
ApprovedQuantity	0
ApprovedBy	null
PaymentStatus	"UNPAID"
Remarks	null
ApproveDate	null
SupposedDeliveryDate	null
IsDelivered	"NO"
*/
    const columns = [
        {
            title: <span className="textStyles-small">Tracking ID</span>,
            dataIndex: 'TrackingID',
            key: 'TrackingID',
            render: (text) => <span className="textStyle-small">{text}</span>,
        },
        {
            title: <span className="textStyles-small">Order Quantity</span>,
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
        // {
        //     title: <span className="textStyles-small">Approved Quantity</span>,
        //     dataIndex: 'ApprovedQuantity',
        //     key: 'ApprovedQuantity',
        //     render: (text) => <span className="textStyle-small">{text}</span>,
        // },
        // {
        //     title: <span className="textStyles-small">Approved By</span>,
        //     dataIndex: 'ApprovedBy',
        //     key: 'ApprovedBy',
        //     render: (text) => <span className="textStyle-small">{text}</span>,
        // },
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
        // {
        //     title: <span className="textStyles-small">Remarks</span>,
        //     dataIndex: 'Remarks',
        //     key: 'Remarks',
        //     render: (text) => <span className="textStyle-small">{text}</span>,
        // },
        // {
        //     title: <span className="textStyles-small">Approve Date</span>,
        //     dataIndex: 'ApproveDate',
        //     key: 'ApproveDate',
        //     render: (text) => <span className="textStyle-small">{dayjs(text).format('DD/MM/YYYY')}</span>,
        // },
        // {
        //     title: <span className="textStyles-small">Supposed Delivery Date</span>,
        //     dataIndex: 'SupposedDeliveryDate',
        //     key: 'SupposedDeliveryDate',
        //     render: (text) => <span className="textStyle-small">{dayjs(text).format('DD/MM/YYYY')}</span>,
        // },
        {
            title: <span className="textStyles-small">Is Delivered</span>,
            dataIndex: 'IsDelivered',
            key: 'IsDelivered',
            render: (text) => <>
            {text === 'NO' ? <Badge status="error" text={<span className='textStyle-small'>NO</span>} /> :
            text === 'ONTHEWAY' ? <Badge status="processing" text={<span className='textStyle-small'>ON THE WAY</span>} /> :
            text === 'YES' ? <Badge status="success" text={<span className='textStyle-small'>YES</span>} /> : null 
            }</>,
        },
        {
            title: <span className="textStyles-small">Action</span>,
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {
                        record?.CustomerOrderStatus === 'REQUESTED' && record?.ApprovalStatus !== 'REJECTED' ? (
                            <Button type="primary"
                            icon={<EditOutlined />}
                            shape="circle"
                            size="small"
                            onClick={() => { getOrderDetailsByOrderID(record.ORDER_ID, false) }} 
                        />
                        ) : null
                    }

                    <Button type="primary"
                        icon={<EyeOutlined />}
                        shape="circle"
                        size="small"
                        onClick={() => { getOrderDetailsByOrderID(record.ORDER_ID, true) }}
                    />

                    <Button type="primary"
                danger
                icon={<DeleteOutlined />}
                        shape="circle"
                        size="small"
                        onClick={() => { deleteFertilizerOrder(record) }}
                    />
                
                </Space>
            ),
        },
    ];

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
                        
                openDetailsModal(modalType);
            } else {
                message.error('Error : ' + result?.data?.message);
            }
        }
    }

    const updateOrderDetails = async (id, record) => {
        const result = await apiExecutions.approveFertilizerOrder(id, record);
        if (result !== null) {
            if (result?.success === true) {
                message.success('Order Updated Successfully');
                fetchAllFertilizerRecordsList();
            } else {
                message.error('Error : ' + result?.data?.message);
            }
        }
    }

    const editFertilizerOrder = (record) => {
        // setSelectedRecord(record);
        console.log('Edit Record : ', record);

        const requestJson = {
            ORDER_ID: selectedRecord.ORDER_ID,
            ApprovalStatus: record.ApprovalStatus ? record.ApprovalStatus : null,
            Remarks: record.Remarks,
            PaymentStatus: record.PaymentStatus,
            ApprovedQuantity: record.ApprovedQuantity,
            ApproveDate: record.ApproveDate ? record?.ApproveDate?.format('YYYY-MM-DD') : null,
            SupposedDeliveryDate: record.SupposedDeliveryDate ? record?.SupposedDeliveryDate?.format('YYYY-MM-DD') : null,
            IsDelivered: record.IsDelivered,
            ApprovedBy: localStorage.getItem('user_id') ? localStorage.getItem('user_id') : null
        }

        updateOrderDetails(selectedRecord.ORDER_ID, requestJson);
    }


    return (
        <>
            <h1 className="headingStyle2">Fertilizer Orders </h1>
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
                        title: 'Fertilizer Orders',
                    },
                ]}
            />

        <pre>
            {JSON.stringify(selectedRecord, null, 2)}
        </pre>


        {/* {
  "ORDER_ID": 6,
  "FertilizerID": 389804,
  "FieldID": 787328625,
  "OrderQuentity": 100,
  "OrderDate": "2024-04-12T18:30:00.000Z",
  "RequestedDeadLine": "2024-04-30T18:30:00.000Z",
  "CustomerOrderStatus": "PENDING",
  "ApprovalStatus": "REJECTED",
  "ApprovedQuantity": null,
  "ApprovedBy": null,
  "PaymentStatus": null,
  "Remarks": null,
  "ApproveDate": null,
  "SupposedDeliveryDate": null,
  "IsDelivered": null
}
 */}








            <Table columns={columns} dataSource={fetchAllFertilizerRecords} />

            {/* ApprovalStatus, ApprovedQuantity, ApprovedBy, PaymentStatus, Remarks, ApproveDate, SupposedDeliveryDate, IsDelivered */}

            <Modal
                width={800}
                title={<span className="textStyle-small" style={{ fontSize: 14 }}>
                    Fertilizer Order Management
                </span>}
                visible={openModal}
            //onOk={handleOk}
            //onCancel={handleCancel}
            onOk={closeDetailsModal}
                onCancel={closeDetailsModal}
                footer={null}
                destroyOnClose={true}
            >
                <div>
                    <Form
                        name="basic"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        style={{ padding: 20, marginTop: 10 }}
                        onFinish={editFertilizerOrder}
                    >
                        <Row>
                            <Descriptions
                                bordered
                                column={2}
                                size="small"
                                style={{ width: '100%', marginBottom: 10 }}
                            >
                                <Descriptions.Item label={<span className='textStyle-small'>Tracking ID</span>} span={1}>
                                    <span className='textStyle-small'>{selectedRecord.TrackingID}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label={<span className='textStyle-small'>Field ID</span>} span={1}>
                                    <span className='textStyle-small'>{selectedRecord.FieldID}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label={<span className='textStyle-small'>Fertilizer Name </span>} span={1}>
                                    {
                                        fetilizerInformations?.length > 0 ? (
                                            fetilizerInformations?.map((item, index) => {
                                                if (item?.FertilizerID === selectedRecord?.FertilizerID) {
                                                    return (
                                                        <span className='textStyle-small'>{item?.FertilizerName}</span>
                                                    )
                                                }
                                            })
                                        ) : null
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label={<span className='textStyle-small'>Order Quantity</span>} span={1}>
                                    <span className='textStyle-small'>{selectedRecord.OrderQuentity} Kg</span>
                                </Descriptions.Item>
                                <Descriptions.Item label={<span className='textStyle-small'>Available Quantity In Stocks </span>} span={1}>
                                    {
                                        fetilizerInformations?.length > 0 ? (
                                            fetilizerInformations?.map((item, index) => {
                                                if (item?.FertilizerID === selectedRecord?.FertilizerID) {
                                                    return (
                                                        <span className='textStyle-small'>{item?.FertilizerQuantity} Kg</span>
                                                    )
                                                }
                                            })
                                        ) : null
                                    }
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
                            </Descriptions>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className='textStyle-small'>Approval Status</span>}
                                    initialValue={selectedRecord.ApprovalStatus}
                                    name="ApprovalStatus"
                                >
                                    <Select
                                        style={{ width: '90%' }}
                                        placeholder="Select Approval Status"
                                        allowClear
                                        className="textStyle-small"
                                        onChange={(value) => {
                                            if (value === 'REJECTED') {
                                                setIsReject(true);
                                            } else {
                                                setIsReject(false);
                                            }
                                        }}
                                    >
                                        <Select.Option value="PENDING" className="textStyle-small">PENDING</Select.Option>
                                        <Select.Option value="APPROVED" className="textStyle-small">APPROVED</Select.Option>
                                        <Select.Option value="REJECTED" className="textStyle-small">REJECTED</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                    label={<span className='textStyle-small'>Remarks</span>}
                                    initialValue={selectedRecord.Remarks}
                                    name="Remarks"
                                >
                                    <Input
                                        placeholder="Remarks"
                                        className="textStyle-small"
                                        style={{ width: '90%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {
                            isReject !== true && (
                                <>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item
                                                label={<span className='textStyle-small'>Payment Status</span>}
                                                initialValue={selectedRecord.PaymentStatus}
                                                name="PaymentStatus"
                                            >
                                                <Select
                                                    style={{ width: '90%' }}
                                                    placeholder="Select Payment Status"
                                                    allowClear
                                                    className="textStyle-small"
                                                >
                                                    <Select.Option value="UNPAID" className="textStyle-small">UNPAID</Select.Option>
                                                    <Select.Option value="PAID" className="textStyle-small">PAID</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label={<span className='textStyle-small'>Approved Quantity ({unitDetails.AvailableQuentity} Kg In Stock)</span>}
                                                initialValue={selectedRecord.ApprovedQuantity ? selectedRecord.ApprovedQuantity : 0}
                                                name="ApprovedQuantity"
                                                rules={[
                                                    { required: true, message: 'Please input Approved Quantity!' },
                                                    { 
                                                        validator: (_, value) => {
                                                            if (value < 1) {
                                                                return Promise.reject('Approved Quantity should be greater than 0');
                                                            }
                                                            if (value > Math.min(selectedRecord.OrderQuentity)) {
                                                                return Promise.reject('Approved Quantity should be less than Order Quantity');
                                                            }
                                                            if (value > unitDetails.AvailableQuentity) {
                                                                return Promise.reject('Approved Quantity should be less than In Stock Quantity');
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    }
                                                ]}
                                            >
                                                <Input
                                                    placeholder="Approved Quantity"
                                                    className="textStyle-small"
                                                    type="number"
                                                    style={{ width: '90%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item
                                                label={<span className='textStyle-small'>Approve Date</span>}
                                                initialValue={selectedRecord?.ApproveDate ? moment(selectedRecord?.ApproveDate) : null}
                                                name="ApproveDate"
                                            >
                                                <DatePicker
                                                    placeholder="Approve Date"
                                                    style={{ width: '90%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label={<span className='textStyle-small'>Supposed Delivery Date</span>}
                                                // 2024-04-13T18:30:00.000Z
                                                initialValue={selectedRecord?.SupposedDeliveryDate ? moment(selectedRecord?.SupposedDeliveryDate) : null}
                                                name="SupposedDeliveryDate"
                                            >
                                                <DatePicker
                                                    placeholder="Supposed Delivery Date"
                                                    style={{ width: '90%', fontSize: 10 }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item
                                                label={<span className='textStyle-small'>Is Delivered</span>}
                                                initialValue={selectedRecord.IsDelivered}
                                                name="IsDelivered"
                                            >
                                                <Select
                                                    style={{ width: '90%' }}
                                                    placeholder="Select Is Delivered"
                                                    allowClear
                                                    className="textStyle-small"
                                                >
                                                    <Select.Option value="NO" className="textStyle-small">NO</Select.Option>
                                                    {
                                                        selectedRecord?.ApprovalStatus === 'APPROVED' && selectedRecord?.PaymentStatus === 'PAID' ? (
                                                            <>
                                                                <Select.Option value="ONTHEWAY" className="textStyle-small">ON THE WAY</Select.Option>
                                                                <Select.Option value="YES" className="textStyle-small">YES</Select.Option>
                                                            </>
                                                        ) : null
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </>
                            ) 
                        }

                        <Row>
                            <Col span={24}>
                                <Form.Item>
{
    isReject === true ? (
        <Button
            type="primary"
            danger
            htmlType="submit"
            className="textStyle-small"
            style={{ width: '120px'}}>
            Reject Order
        </Button>
    ) : (
        <Button
            type="primary"
            htmlType="submit"
            className="textStyle-small"
            style={{ width: '120px'}}>
            Approve Order
        </Button>
    )
}
                                    <Button
                                        type="secondary"
                                        onClick={closeDetailsModal}
                                        className="textStyle-small"
                                        style={{ width: '120px', marginLeft: 10, borderColor: 'red', color: 'red' }}>
                                        Close Modal
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default FertilizerManagement;