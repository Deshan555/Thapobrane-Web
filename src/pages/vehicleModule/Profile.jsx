import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Breadcrumb, Row, Col, Switch, Tabs } from 'antd';
import { notification } from '../../../node_modules/antd/es/index';
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
import { CSVLink, CSVDownload } from "react-csv";
import './style.css';
const { Option } = Select;

const Profile = () => {
    const [open, setOpen] = useState(false);
    const [display, setDisplay] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [employeeRegister, setEmployeeRegister] = useState({
        EmployeeName: "",
        EmployeeMobile: "",
        EmployeeEmail: "",
        EmployeeType: "",
        FactoryID: "",
        Password: ""
    });
    const [selectedUser, setSelectedUser] = useState({
        EmployeeID: "",
        EmployeeName: "",
        EmployeeMobile: "",
        EmployeeEmail: "",
        EmployeeType: "",
        FactoryID: "",
        RegisterDate: ""
    });
    const [employeeRoles, setEmployeeRoles] = useState(new Map());
    const [api, contextHolder] = notification.useNotification();
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [allFactories, setAllFactories] = useState([]);
    const [filterROLE, setFilterROLE] = useState('ALL');


    useEffect(() => {
        getAllEmpRoles();
        getAllRegisteredEmployees();
        fetchAllFactories();

        getAllRegisteredEmployees(localStorage.getItem('empID'));
    }, []);

    const showModal = () => {
        setOpen(true);
    };

    const resetSelectedData = () => {
        setSelectedUser({
            EmployeeID: "",
            EmployeeName: "",
            EmployeeMobile: "",
            EmployeeEmail: "",
            EmployeeType: "",
            FactoryID: "",
            RegisterDate: ""
        });
    }

    const resetEmployeeRegisterData = () => {
        setEmployeeRegister({
            EmployeeName: "",
            EmployeeMobile: "",
            EmployeeEmail: "",
            EmployeeType: "",
            FactoryID: "",
            Password: ""
        });
    }

    const handleCancel = () => {
        resetEmployeeRegisterData();
        setIsEdit(false);
        resetSelectedData();
        setOpen(false);
    };

    const getAllEmpRoles = async () => {
        const response = await apiExecutions.getAllEmployeeRoles();
        if (response !== null) {
            if (response.success === true) {
                setEmployeeTypes(response.data);
                const rolesData = response.data || [];
                const rolesMap = new Map();
                rolesData.forEach(role => {
                    rolesMap.set(role.RoleID, role.RoleName);
                });
                setEmployeeRoles(rolesMap);
            }
        } else {
            message.error('Failed to fetch employee roles');
        }
    }

    const getAllRegisteredEmployees = async (employeeID) => {
        const response = await apiExecutions.getEmployeeDetailsByID(employeeID);
        if (response !== null) {
            if (response.success === true) {
                setSelectedUser(response?.data[0]);
            }
        } else {
            message.error(response?.message);
        }
    }

    const fetchAllFactories = async () => {
        const response = await apiExecutions.getAllFactories();
        if (response !== null) {
            if (response.success === true) {
                setAllFactories(response.data);
            }
        } else {
            message.error(response?.message);
        }
    }

    const handleUpdate = (id, record) => {
        Modal.confirm({
            title: "Confirm Update",
            content: `Are you sure you want to update your profile?`,
            onOk: () => {
                updateEmployeeFunction(id, record);
            },
            onCancel: () => { },
        });
    };

    const handleRegister = (record) => {
        Modal.confirm({
            title: "Confirm Register",
            content: `Are you sure you want to register this employee?`,
            onOk: () => {
                registerNewEmployeeFunction(record);
            },
            onCancel: () => { },
        });
    };

    const onFinish = (values) => {
        if (isEdit != true) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const employeeDetails = {
                name: values.name,
                mobile: values.mobile,
                email: values.email,
                type: values.type,
                factory: values.factory,
                password: randomPassword
            };
            handleRegister(employeeDetails);
        } else {
            console.log("update modal");
            console.log(values);
            const employeeDetails = {
                name: values.name,
                mobile: values.mobile,
                email: values.email,
                type: values.type,
                factory: values.factory
            };
            handleUpdate(selectedUser.EmployeeID, employeeDetails);
        }
    }

    const registerNewEmployeeFunction = async (requestJson) => {
        try {
            const response = await apiExecutions.registerNewEmployee(requestJson);
            if (response !== null) {
                if (response?.data?.success) {
                    message.success('Employee registered successfully');
                    getAllRegisteredEmployees();
                    handleCancel();
                } else {
                    message.error('Failed to register employee : ' + response?.message);
                }
            }
        } catch (error) {
            message.error('Error registering employee:', error);
        }
    }

    const updateEmployeeFunction = async (empID, requestJson) => {
        try {
            const response = await apiExecutions.updateEmployee(empID, requestJson);
            if (response !== null) {
                if (response?.data?.success) {
                    message.success('Employee updated successfully');
                    getAllRegisteredEmployees(localStorage.getItem('empID'));
                } else {
                    message.error('Failed to update employee : ' + response?.message);
                }
            }
        } catch (error) {
            message.error('Error updating employee:', error);
        }
    }

    const passChange = (values) => {
        handleDelete(values.oldPassword, values.newPassword, localStorage.getItem('empID'), values.newPassword);
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
            const response = await apiExecutions.updateEmployeePassword(oldPassword, newPassword, empID, mail);
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
               <h3 className='textStyle-small' style={{fontSize: '14px'}}>
                Profile Informations
                </h3>
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label={<span className='textStyle-small'>Employee Register ID</span>}>
                        <span className='textStyle-small'>
                            EID-{selectedUser.EmployeeID ? selectedUser?.EmployeeID : 'N/A'}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyle-small'>Employee Name</span>}>
                        <span className='textStyle-small'>
                            {selectedUser.EmployeeName ? selectedUser.EmployeeName : 'N/A'}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyle-small'>Employee Mobile</span>}>
                        <span className='textStyle-small'><a href={`tel:${selectedUser.Mobile}`}><PhoneOutlined /> {selectedUser.Mobile ? selectedUser.Mobile : <Tag color="default">N/A</Tag>}</a></span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyle-small'>Employee Email</span>}>
                        <span className='textStyle-small'><a href={`mailto:${selectedUser.Email}`}><MailOutlined /> {selectedUser.Email ? selectedUser.Email : <Tag color="default">N/A</Tag>}</a></span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyle-small'>Employee Type</span>}>
                        {
                            employeeRoles.get(selectedUser.RoleID) ? (
                                <Tag color="green"><span className='textStyle-small'>{employeeRoles.get(selectedUser.RoleID)}</span></Tag>
                            ) : (
                                <Tag color="default">N/A</Tag>
                            )
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyle-small'>Factory ID</span>}>
                        {
                            allFactories.map((factory) => {
                                if (factory.FactoryID === selectedUser.FactoryID) {
                                    return (
                                        <span className='textStyle-small'> {factory.FactoryName}</span>
                                    )
                                }
                            })
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className='textStyle-small'>
                        Registered Date
                    </span>}>
                        <span className='textStyle-small'>{selectedUser.JoiningDate ? new Date(selectedUser?.JoiningDate).toLocaleDateString()
                            : 'Not Provided'}</span>
                    </Descriptions.Item>
                </Descriptions>
            </>,
        },
        {
            key: '2',
            label: <span className='textStyle-small'>Edit Profile</span>,
            children: <>
                           <h3 className='textStyle-small' style={{fontSize: '14px'}}>
                Edit Profile
                </h3>
                <Form
                    onFinish={onFinish} layout="vertical">
                    <Row>
                        <Col span={12}>
                            <Form.Item label={<span className='textStyle-small'>Employee Name</span>}
                                name="name"
                                rules={[{ required: true, message: 'Please enter employee name' }]}
                                initialValue={selectedUser?.EmployeeName ? selectedUser?.EmployeeName : ""}
                            >
                                <Input
                                    type="text" style={{ width: '90%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label={<span className='textStyle-small'>Employee Mobile </span>}
                                name="mobile"
                                initialValue={selectedUser?.Mobile ? selectedUser?.Mobile : ""}
                                rules={[{ required: true, message: 'Please enter employee mobile' }]}>
                                <Input
                                    type="tel" style={{ width: '90%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item label={<span className='textStyle-small'>Employee Email</span>}
                                name="email"
                                initialValue={selectedUser?.Email ? selectedUser?.Email : ""}
                                rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                                <Input
                                    type="email" style={{ width: '90%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<span className='textStyle-small'>Employee Type</span>}
                                name="type"
                                initialValue={selectedUser?.RoleID ? selectedUser?.RoleID : ""}
                                rules={[{ required: true, message: 'Please select employee type' }]}
                            >
                                <Select style={{ width: '90%' }}>
                                    {employeeTypes.map((type) => (
                                        <Option key={type.RoleID} value={type.RoleID}>
                                            {type.RoleName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item label={<span className='textStyle-small'>Factory Name</span>}
                                name="factory"
                                initialValue={selectedUser?.FactoryID ? selectedUser?.FactoryID : ""}
                                rules={[{ required: true, message: 'Please enter factory ID' }]}>
                                <Select
                                    placeholder="Select Factory"
                                    style={{ width: '90%' }}
                                >
                                    {allFactories.map((factory) => (
                                        <Option key={factory.FactoryID} value={factory.FactoryID}>
                                            {factory.FactoryName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" danger>
                            <span className='textStyle-small'>Update Profile</span>
                        </Button>
                    </Form.Item>
                </Form>
            </>
        },
        {
            key: '3',
            label: <span className='textStyle-small'>Privacy Settings</span>,
            children: <>
            <h3 className='textStyle-small' style={{fontSize: '14px'}}>
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
                                style={{width: '80%'}}
                                initialValue={selectedUser?.Email ? selectedUser?.Email : ""}
                            >
                                <Input type="email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className='textStyle-small'>Old Password</span>}
                                name="oldPassword"
                                rules={[{ required: true, message: 'Please enter old password' }]}
                                style={{width: '80%'}}
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
                                style={{width: '80%'}}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<span className='textStyle-small'>Confirm Password</span>}
                                name="confirmPassword"
                                rules={[{ required: true, message: 'Please confirm your password' }]}
                                style={{width: '80%'}}
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
            <h1 className="headingStyle2">Profile Management</h1>
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
                        title: 'Profile Management',
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

export default Profile;