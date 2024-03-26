import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag} from 'antd';
import { message, notification } from '../../../node_modules/antd/es/index';
import {
  MailOutlined,
  DeleteOutlined,
  PhoneOutlined,
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { random } from 'lodash';
const { Option } = Select;

const JobsModule = () => {
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
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


  const openNotificationWithIcon = (type, message, title) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'EmployeeName',
      key: 'EmployeeName',
      render: (name) => {
        return <b>{name}</b>;
      }
    },
    {
      title: 'Employee Mobile',
      dataIndex: 'Mobile',
      key: 'Mobile',
      render: (mobile) => {
        return (
          <a href={`tel:${mobile}`}>
            <b>
              <PhoneOutlined /> {mobile}
            </b>
          </a>
        );
      }
    },
    {
      title: 'Employee Email',
      dataIndex: 'Email',
      key: 'Email',
      render: (email) => {
        return (
          <a href={`mailto:${email}`}>
            <b>
              <MailOutlined /> {email}
            </b>
          </a>
        );
      }
    },
    {
      title: 'Employee Type',
      dataIndex: 'RoleID',
      key: 'EmployeeType',
      render: (roleId) => {
        return <b>{employeeRoles.get(roleId) ? employeeRoles.get(roleId) : "N/A"}</b>;
      }
    },
    {
      title: 'Factory ID',
      dataIndex: 'FactoryID',
      key: 'FactoryID',
      render: (factoryId) => {
        return <b>FID_{factoryId}</b>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>
            <EyeOutlined
              style={{ color: 'blue' }}
              onClick={() => showDetailsModel(record)}
            />
          </a>
          <a>
            <EditOutlined
              style={{ color: 'blue' }}
              onClick={() => showEditModel(record)}
            />
          </a>
          <a>
            <DeleteOutlined
              style={{ color: 'red' }}
            />
          </a>
        </Space>
      ),
    },
  ];


  const filteredData = registeredUsers.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleSearch = () => {
    const filteredData = registeredUsers.filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilterData(filteredData);
  };


  useEffect(() => {
    getAllEmpRoles();
    getAllRegisteredEmployees();
    fetchAllFactories();
  }, []);

  const showModal = () => {
    setOpen(true);
  };


  const showDetailsModel = (userObj) => {
    setSelectedUser({
      EmployeeID : userObj.EmployeeID,
      EmployeeName: userObj.EmployeeName,
      EmployeeMobile: userObj.Mobile,
      EmployeeEmail: userObj.Email,
      EmployeeType: employeeRoles?.get(userObj?.RoleID)? employeeRoles?.get(userObj?.RoleID) : "N/A",
      FactoryID: userObj.FactoryID,
      RegisterDate: userObj.JoiningDate,
    });
    setDisplay(true);
  };

  const showEditModel = (userObj) => {
    console.log(userObj);
    setIsEdit(true);
    setSelectedUser({
      EmployeeID : userObj.EmployeeID,
      EmployeeName: userObj.EmployeeName,
      EmployeeMobile: userObj.Mobile,
      EmployeeEmail: userObj.Email,
      EmployeeType: employeeRoles?.get(userObj?.RoleID)? employeeRoles?.get(userObj?.RoleID) : "N/A",
      FactoryID: userObj.FactoryID,
      RegisterDate: userObj.JoiningDate,
    });
    console.log(selectedUser);
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

  const handleOk = () => {
    setModalText('That Employee Registeration Process Related To Only That Digitalization Process');
    setConfirmLoading(true);
    registerEmployee();
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    resetEmployeeRegisterData();
    setIsEdit(false);
    resetSelectedData();
    setOpen(false);
  };

  const handleDisplayCancel = () => {
    resetSelectedData();
    resetEmployeeRegisterData();
    setDisplay(false);
  };

  const getAllEmpRoles = async () => {
    const response = await apiExecutions.getAllEmployeeRoles();
    if (response.success === true) {
      const rolesData = response.data || [];
      const rolesMap = new Map();
      rolesData.forEach(role => {
        rolesMap.set(role.RoleID, role.RoleName);
      });
      setEmployeeRoles(rolesMap);
    } else {
      message.error('Failed to fetch employee roles');
    }
  }

  const getAllRegisteredEmployees = async () => {
    const response = await apiExecutions.getAllEmployees();
    console.log(response);
    if (response.success === true) {
      setRegisteredUsers(response.data);
    } else {
      message.error('Failed to fetch registered employees');
    }
  }

  const fetchAllFactories = async () => {
    const response = await apiExecutions.getAllFactories();
    if (response.success === true) {
      setAllFactories(response.data);
    } else {
      message.error('Failed to fetch factories');
    }
  }

  const registerEmployee = async (employeeRegisterInfo) => {
    try {
        const response = await apiExecutions.registerNewEmployee(employeeRegisterInfo);
        console.log("Response:", response);

        if (response && response.success === true) {
            console.log('Employee registration successful');
        } else {
            console.error('Employee registration failed:', response);
        }
    } catch (error) {
        console.error('Error registering employee:', error);
    }
}
  

  const employeeRegisteration = async (values) => {
  }



  const onFinish = async (values) => {
    console.log(values);
    // {
    //   "name": "xcxc",
    //   "mobile": "xcxcxc",
    //   "email": "john.doe@example5.com",
    //   "type": 7,
    //   "factory": "xcxc",
    //   "password": "securePassword123"
    // }
    // EmployeeName: employeeDetails.name,
    // EmployeeMobile: employeeDetails.mobile,
    // EmployeeEmail: employeeDetails.email,
    // EmployeeType: employeeDetails.type,
    // FactoryID: employeeDetails.factory,
    // Password: employeeDetails.password
    const randomPassword = Math.random().toString(36).slice(-8);

    try {
      const employeeDetails = {
        name: values.name,
        mobile: values.mobile,
        email: values.email,
        type: values.type,
        factory: values.factory,
        password: randomPassword
      };
      await registerEmployee(employeeDetails);
  } catch (error) {
      console.error('Error registering employee:', error);
  }
  };


  const searchCreadentials = (e) => {
    setSearchText(e.target.value);
    handleSearch();
  }


  return (
    <>
      <Modal
        title={
          isEdit != true ? (
            "Register Employee"
          ) : (
            "Update Employee"
          )
        }
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <p>{modalText}</p>

        {/*EmployeeName, EmployeeMobile, EmployeeEmail, EmployeeType, FactoryID, Password */}

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="Employee Name" name="name" 
          rules={[{ required: true, message: 'Please enter employee name' }]}
          initialValue={selectedUser?.EmployeeName ? selectedUser?.EmployeeName : ""}
          >
            <Input
            type="text"
            />
          </Form.Item>

          <Form.Item label="Employee Mobile" name="mobile" 
          initialValue={selectedUser?.EmployeeMobile ? selectedUser?.EmployeeMobile : ""}
          rules={[{ required: true, message: 'Please enter employee mobile' }]}>
            <Input
              type="tel"
            />
          </Form.Item>

          <Form.Item label="Employee Email" name="email" 
          initialValue={selectedUser?.EmployeeEmail ? selectedUser?.EmployeeEmail : ""}
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input
              type="email"
            />
          </Form.Item>

          <Form.Item label="Employee Type" name="type" 
          initialValue={selectedUser?.EmployeeType ? selectedUser?.EmployeeType : ""}
          rules={[{ required: true, message: 'Please select employee type' }]}
          >
            <Select>
              {Array.from(employeeRoles.entries()).map(([roleId, roleName]) => (
                <Option
                  key={roleId}
                  value={roleId}>
                  {roleName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Factory Name"
          name="factory" 
          initialValue={selectedUser?.FactoryID ? selectedUser?.FactoryID : ""}
          rules={[{ required: true, message: 'Please enter factory ID' }]}>
            <Select
              placeholder="Select Factory"
              style={{ width: '100%' }}
            >
              {allFactories.map((factory) => (
                <Option key={factory.FactoryID} value={factory.FactoryID}>
                  {factory.FactoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {
            isEdit != true ? (
              <Form.Item label="Password" name="password" 
              rules={[{ required: true, message: 'Please enter a password' }]}>
                <Input.Password
                  type="password"
                />
              </Form.Item>
            ) : (null
            )
          }
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={registerEmployee}>
              {
                isEdit != true ? (
                  "Register Employee"
                ) : (
                  "Update Employee"
                )
              }
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Model For Show Selected Employee Details */}
      <Modal
        title="Employee Details"
        visible={display}
        //onOk={handleOk}
        cancelText="Close View"
        okText=""
        confirmLoading={confirmLoading}
        onCancel={handleDisplayCancel}
        destroyOnClose={true}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="Employee ID"> 
            <b>EID_{selectedUser.EmployeeID ? selectedUser.EmployeeID : <Tag color="default">N/A</Tag>}</b>
          </Descriptions.Item>
          <Descriptions.Item label="Employee Name">
            <b>{selectedUser.EmployeeName ? selectedUser.EmployeeName : <Tag color="default">N/A</Tag>}</b>
          </Descriptions.Item>
          <Descriptions.Item label="Employee Mobile">
            <b><a href={`tel:${selectedUser.EmployeeMobile}`}><PhoneOutlined/> {selectedUser.EmployeeMobile ? selectedUser.EmployeeMobile : <Tag color="default">N/A</Tag>}</a></b>
          </Descriptions.Item>
          <Descriptions.Item label="Employee Email">
            <b><a href={`mailto:${selectedUser.EmployeeEmail}`}><MailOutlined/> {selectedUser.EmployeeEmail ? selectedUser.EmployeeEmail : <Tag color="default">N/A</Tag>}</a></b>
          </Descriptions.Item>
          <Descriptions.Item label="Employee Type">
            <b>{selectedUser.EmployeeType ? selectedUser.EmployeeType : <Tag color="default">N/A</Tag>}</b>
          </Descriptions.Item>
          <Descriptions.Item label="Factory ID">
            <b>FID_{selectedUser.FactoryID ? selectedUser.FactoryID : <Tag color="default">N/A</Tag>}</b>
          </Descriptions.Item>
          <Descriptions.Item label="Registered Date">
            <b>{selectedUser.RegisterDate ? selectedUser.RegisterDate : <Tag color="default">N/A</Tag>}</b>
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
        <Space>
          <div style={{ padding: 10, background: 'white', borderRadius: 10,  display: 'flex', justifyContent: 'flex-end'}}>
            <Space align="end">
              <Input
                placeholder="Search employee"
                value={searchText}
                onChange={searchCreadentials}
                suffix={<SearchOutlined />}
              />
              <Select style={{ width: 200 }} placeholder="Select employee type">
                {Array.from(employeeRoles.entries()).map(([roleId, roleName]) => (
                  <Option
                    onchange={(e) => handleEmployeeTypeChange(e)}
                    key={roleId}
                    value={roleId}>
                    {roleName}
                  </Option>
                ))}
              </Select>
              <Button type="primary" onClick={handleSearch} style={{ borderRadius: "50px"}}>
                <SearchOutlined />
              </Button>
              <Button type="primary" danger style={{ borderRadius: "50px"}}>
                <CloseCircleOutlined /> 
              </Button>
              <Button type="primary" style={{ borderRadius: "50px"}}>
                <CloseCircleOutlined /> Export List
              </Button>
              <Button type="primary" onClick={showModal} style={{ borderRadius: "50px"}}>
                <PlusOutlined /> Add Employee
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
          dataSource={filterData.length > 0 ? filterData : registeredUsers}
          columns={columns}
          pagination={true}
          loading={registeredUsers.length > 0 ? false : true}
        />
      </div>
    </>
  )
}

export default JobsModule;