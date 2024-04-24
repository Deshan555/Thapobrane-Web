import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb, Tabs } from 'antd';
import {
    HomeOutlined,
} from '@ant-design/icons';
import './style.css';
import { authenticationCheck } from '../vehicleModule/AuthChecker';

const CProfile = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [factoryList, setFactoryList] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [filterList, setFilterList] = useState([]);

    useEffect(() => {
        getCustomersByCustomerID(localStorage?.getItem("custID"));
        fetchAllFactories();
        authenticationCheck(navigate);
    }, []);

    const getAllCustomers = async () => {
        const customers = await apiExecutions.getAllCustomers();
        if (customers !== null) {
            if (customers.success === true) {
                setCustomers(customers.data);
                setFilterList(customers.data);
            } else {
                message.error(customers.message);
            }
        }

    }

    const fetchAllFactories = async () => {
        const response = await apiExecutions.getAllFactories();
        if (response !== null) {
            if (response.success === true) {
                setFactoryList(response.data);
            }
        } else {
            message.error(response.message);
        }
    }

    const confirmationModelEdit = (fieldID, condition) => {
        const { confirm } = Modal;
        confirm({
            title: "Are you sure you want to edit this profile?",
            onOk: async () => {
                updateCustomerFunction(fieldID, condition);
            },
            onCancel() { },
        });
    };


    const onFinish = (values) => {
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
        confirmationModelEdit(customerDetails?.CustomerID, requestJson);
    }

    const updateCustomerFunction = async (customerID, requestJson) => {
        console.log(requestJson);
        const result = await apiExecutions.updateCustomerDetailsById(customerID, requestJson);
        if (result !== null) {
            if (result.success === true) {
                message.success('Customer Updated Successfully');
                getAllCustomers();
                getCustomersByCustomerID(localStorage?.getItem("custID"));
            } else {
                message.error('Error : ' + result.message);
            }
        }
    }

    const getCustomersByCustomerID = async (customerID) => {
        const fetchCustomerInfo = await apiExecutions.getCustomerByCustomerID(customerID);
        console.log(fetchCustomerInfo);
        if (fetchCustomerInfo !== null) {
            if (fetchCustomerInfo.success === true) {
                setCustomerDetails(fetchCustomerInfo?.data[0]);
            } else {
                message.error('Failed to fetch customer details');
            }
        }
    }

    const passChange = (values) => {
        handleDelete(values.oldPassword, values.newPassword, localStorage?.getItem("custID"), values.newPassword);
    }

    const handleDelete = (oldPassword, newPassword, empID, mail) => {
        Modal.confirm({
            title: "Password Change Request",
            content: `Are you sure you want to update that password ?`,
            onOk: () => {
                changePassword(oldPassword, newPassword, empID, mail);
            },
            onCancel: () => { },
        });
    };

    const changePassword = async (oldPassword, newPassword, empID, mail) => {
        const response = await apiExecutions.updateCustomerPassword(oldPassword, newPassword, empID, mail);
        if (response !== null) {
            if (response.success === true) {
                message.success('Password updated successfully');
            } else {
                message.error('Failed to update password : ' + response.message);
            }
        }
    }

    const items = [
        {
            key: '1',
            label: <span className='textStyle-small'>Profile Details</span>,
            children: <>
                <h3 className='textStyle-small' style={{ fontSize: '14px' }}>
                    Profile Informations
                </h3>
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
                        {factoryList?.map((factory) => {
                            if (factory.FactoryID === customerDetails?.FactoryID) {
                                return factory.FactoryName;
                            }
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Customer NIC" className="textStyles-small" style={{ fontSize: 12 }}>
                        {customerDetails?.IdentitiCardNumber}
                    </Descriptions.Item>
                </Descriptions>
            </>,
        },
        {
            key: '2',
            label: <span className='textStyle-small'>Edit Profile</span>,
            children: <>
                <h3 className='textStyle-small' style={{ fontSize: '14px' }}>
                    Edit Profile
                </h3>
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

                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Customer Address</span>}
                                name="customerAddress"
                                rules={[{ required: true, message: 'Please input customer address!' }]}
                                initialValue={customerDetails?.CustomerAddress}
                                style={{ width: '90%' }}
                            >
                                <Input type="text" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Customer Email</span>}
                                name="customerEmail"
                                rules={[{ required: true, message: 'Please input customer email!' },
                                { type: 'email', message: 'Please enter valid email' }]}
                                initialValue={customerDetails?.CustomerEmail}
                                style={{ width: '90%' }}
                            >
                                <Input type="email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Factory ID</span>}
                                name="factoryID"
                                rules={[{ required: true, message: 'Please input factory ID!' }]}
                                initialValue={customerDetails?.FactoryID}
                                style={{ width: '90%' }}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select a factory"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {factoryList.map((factory) => (
                                        <Select.Option key={factory.FactoryID} value={factory.FactoryID}>
                                            {factory.FactoryName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className="textStyles-small">Customer NIC</span>}
                                name="customerNIC"
                                disabled
                                rules={[{ required: true, message: 'Please input customer NIC!' }]}
                                initialValue={customerDetails?.IdentitiCardNumber}
                                style={{ width: '90%' }}
                            >
                                <Input type="text" />
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
                                isEdit === false ? 'Update Profile' : 'Register Customer'
                            }
                        </Button>
                    </Row>

                </Form>
            </>
        },
        {
            key: '3',
            label: <span className='textStyle-small'>Privacy Settings</span>,
            children: <>
                <h3 className='textStyle-small' style={{ fontSize: '14px' }}>
                    Privacy Settings
                </h3>
                <Form
                    layout="vertical"
                    name="passwordChangeForm"
                    onFinish={passChange}
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label={<span className='textStyle-small'>Email Address</span>}
                                name="newPassword"
                                rules={[{ required: true, message: 'Please enter your email address' }]}
                                style={{ width: '80%' }}
                                initialValue={customerDetails?.CustomerEmail}
                            >
                                <Input type="email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className='textStyle-small'>Old Password</span>}
                                name="oldPassword"
                                rules={[{ required: true, message: 'Please enter old password' }]}
                                style={{ width: '80%' }}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label={<span className='textStyle-small'>New Password</span>}
                                name="newPassword"
                                rules={[{ required: true, message: 'Please enter new password' }]}
                                style={{ width: '80%' }}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className='textStyle-small'>Confirm Password</span>}
                                name="confirmPassword"
                                rules={[{ required: true, message: 'Please confirm your password' }]}
                                style={{ width: '80%' }}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" danger>
                                    <span className='textStyle-small'> Change Password</span>
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </>
        },
    ];

    return (
        <>
            <h1 className="headingStyle2">Customers</h1>
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
                        title: 'Customers',
                    },
                ]}
            />

            <div style={{
                padding: 10,
                background: 'white',
                borderRadius: 10,
                marginTop: 10,
            }}>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    tabPosition="left"

                />
            </div>
        </>
    )
}

export default CProfile;