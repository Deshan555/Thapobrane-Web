import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Popover, Row, Descriptions, Tag} from 'antd';
import { Dropdown, notification } from '../../../node_modules/antd/es/index';
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
  // That Is Notification Function For Create Notifications Over Web Page
  const openNotificationWithIcon = (type, message, title) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  // That Is Handle Change Function For Employee Registeration Form
  const handleEmployeeNameChange = (e) => {
    setEmployeeRegister({ ...employeeRegister, EmployeeName: e });
  }

  const handleEmployeeMobileChange = (e) => {
    setEmployeeRegister({ ...employeeRegister, EmployeeMobile: e });
  }

  const handleEmployeeEmailChange = (e) => {
    setEmployeeRegister({ ...employeeRegister, EmployeeEmail: e });
  }

  const handleEmployeeTypeChange = (e) => {
    setEmployeeRegister({ ...employeeRegister, EmployeeType: e });
  }

  const handleFactoryIDChange = (e) => {
    setEmployeeRegister({ ...employeeRegister, FactoryID: e });
  }

  const handlePasswordChange = (e) => {
    setEmployeeRegister({ ...employeeRegister, Password: e });
  }

  const filteredData = registeredUsers.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleSearch = () => {
    // You can perform additional search logic here if needed
    // For now, we are using a simple filter based on the search text
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
  }, []);

  useEffect(() => {
    // Log employeeRoles when it changes
    console.log(employeeRoles);
  }, [employeeRoles]);

  useEffect(() => {
    // Log employeeRegister when it changes
    console.log(employeeRegister);
  }, [employeeRegister]);

  useEffect(() => {
    // Log selectedUser when it changes
    console.log(selectedUser);
  }, [selectedUser]);

  const showModal = () => {
    setOpen(true);
  };

  // const showEditModal = () => {
  //   setOpenEdit(true);
  // };

  

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

  const apiCall = async () => {
    const response = await apiExecutions.authEmployee("john.doe@example5.com", "securePassword123");
    console.log(response);
  }

  const getAllEmpRoles = async () => {
    const response = await apiExecutions.getAllEmployeeRoles();
    console.log(response);
    if (response.success === true) {
      console.log('==========================================================');

      const rolesData = response.data || [];
      const rolesMap = new Map();

      rolesData.forEach(role => {
        rolesMap.set(role.RoleID, role.RoleName);
      });

      setEmployeeRoles(rolesMap);

      //setEmployeeRegister({...employeeRegister, EmployeeType: rolesData[0].EmployeeTypeID});

      //console.log(rolesMap);
      console.log(employeeRoles);
    }
  }

  const registerEmployee = async (employeeRegisterInfo) => {
    //const response = await apiExecutions.registerNewEmployee(employeeRegisterInfo);
    notification.success(
      {
        message: 'Employee registeration successful',
        description: 'Employee Registeration',
      }
    );

    // openNotificationWithIcon('success', 'Employee registeration successful', 'Employee Registeration');
    // console.log(response);
    // if (response.success === true) {
    //   console.log('=====================================================');
    //   console.log("employee registeration sucessful");
    // } else {
    //   console.log('=====================================================');
    //   console.log("employee registeration failed");
    // }
  }

  const getAllRegisteredEmployees = async () => {
    const response = await apiExecutions.getAllEmployees();
    console.log(response);
    if (response.success === true) {
      console.log('==========================================================');
      console.log(response.data);
      setRegisteredUsers(response.data);
    } else {
      console.log('==========================================================');
      console.log("employee registeration failed");
    }
  }

  const onFinish = (values) => {
    // Handle form submission here
    console.log('Received values:', values);
    registerEmployee(values);
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

  const searchCreadentials = (e) => {
    setSearchText(e.target.value);
    handleSearch();
  }


  return (
    <>
      <Modal
        title="Register New Employee"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>

        {/*EmployeeName, EmployeeMobile, EmployeeEmail, EmployeeType, FactoryID, Password */}

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="Employee Name" name="name" rules={[{ required: true, message: 'Please enter employee name' }]}>
            <Input
              defaultValue={selectedUser.EmployeeName}
              onChange={(e) => handleEmployeeNameChange(e)}
            />
          </Form.Item>

          <Form.Item label="Employee Mobile" name="mobile" rules={[{ required: true, message: 'Please enter employee mobile' }]}>
            <Input
              defaultValue={selectedUser.EmployeeMobile}
              onChange={(e) => handleEmployeeMobileChange(e)}
            />
          </Form.Item>

          <Form.Item label="Employee Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input
              defaultValue={selectedUser.EmployeeEmail}
              onChange={(e) => handleEmployeeEmailChange(e)}
            />
          </Form.Item>

          <Form.Item label="Employee Type" name="type" rules={[{ required: true, message: 'Please select employee type' }]}>
            <Select>
              {Array.from(employeeRoles.entries()).map(([roleId, roleName]) => (
                <Option
                  defaultValue={employeeRegister.EmployeeType}
                  onChange={(e) => handleEmployeeTypeChange(e)}
                  key={roleId}
                  value={roleId}>
                  {roleName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Factory ID" name="factory" rules={[{ required: true, message: 'Please enter factory ID' }]}>
            <Input
              defaultValue={selectedUser.FactoryID}
              onChange={(e) => handleFactoryIDChange(e)}
            />
          </Form.Item>

          {
            isEdit != true ? (
              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
                <Input.Password
                  onChange={(e) => handlePasswordChange(e)}
                  value={{}}
                />
              </Form.Item>
            ) : (null
            )
          }
          {/* <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
            <Input.Password
              onchange={(e) => handlePasswordChange(e)}
              value={{}}
            />
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={registerEmployee}>
              Register Employee
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal 
        title="Edit Employee"
        open={openEdit}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
        
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="Employee Name" name="name" rules={[{ required: true, message: 'Please enter employee name' }]}>
            <Input
              defaultValue={selectedUser.EmployeeName? selectedUser.EmployeeName : "N/A"}
              onchange={(e) => handleEmployeeNameChange(e)}
            />
          </Form.Item>

          <Form.Item label="Employee Mobile" name="mobile" rules={[{ required: true, message: 'Please enter employee mobile' }]}>
            <Input
              defaultValue={selectedUser.EmployeeMobile}
              onchange={(e) => handleEmployeeMobileChange(e)}
            />
          </Form.Item>

          <Form.Item label="Employee Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input
              defaultValue={selectedUser.EmployeeEmail}
              onchange={(e) => handleEmployeeEmailChange(e)}
            />
          </Form.Item>

          <Form.Item label="Employee Type" name="type" rules={[{ required: true, message: 'Please select employee type' }]}>
            <Select>
              {Array.from(employeeRoles.entries()).map(([roleId, roleName]) => (
                <Option
                  defaultValue={employeeRegister.EmployeeType}
                  onchange={(e) => handleEmployeeTypeChange(e)}
                  key={roleId}
                  value={roleId}>
                  {roleName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Factory ID" name="factory" rules={[{ required: true, message: 'Please enter factory ID' }]}>
            <Input
              defaultValue={selectedUser.FactoryID}
              onchange={(e) => handleFactoryIDChange(e)}
            />
          </Form.Item>

          {
            isEdit != true ? (
              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
                <Input.Password
                  onchange={(e) => handlePasswordChange(e)}
                  value={{}}
                />
              </Form.Item>
            ) : (null
            )
          }
          {/* <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
            <Input.Password
              onchange={(e) => handlePasswordChange(e)}
              value={{}}
            />
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={registerEmployee}>
              Register Employee
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