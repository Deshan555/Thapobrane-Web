import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message} from 'antd';
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
} from '@ant-design/icons';
import { CSVLink, CSVDownload } from "react-csv";
import './style.css';
const { Option } = Select;

const JobsModule = () => {
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


  const columns = [
    {
      title: <span className='textStyles-small'>Employee ID</span>,
      dataIndex: 'EmployeeID',
      key: 'EmployeeID',
      render: (id) => {
        return <span className='textStyle-small'>EID_{id}</span>;
      }
    },
    {
      title: <span className='textStyles-small'>Employee Name</span>,
      dataIndex: 'EmployeeName',
      key: 'EmployeeName',
      render: (name) => {
        return <span className='textStyle-small'>{name}</span>;
      }
    },
    {
      title: <span className='textStyles-small'>Employee Mobile</span>,
      dataIndex: 'Mobile',
      key: 'Mobile',
      render: (mobile) => {
        return (
          <a href={`tel:${mobile}`} className='textStyle-small'>
            <span>
              <PhoneOutlined /> {mobile}
            </span>
          </a>
        );
      }
    },
    {
      title: <span className='textStyles-small'>Employee Email</span>,
      dataIndex: 'Email',
      key: 'Email',
      render: (email) => {
        return (
          <a href={`mailto:${email}`}className='textStyle-small'>
            <span>
              <MailOutlined /> {email}
            </span>
          </a>
        );
      }
    },
    {
      title: <span className='textStyles-small'>Employee Type</span>,
      dataIndex: 'RoleID',
      key: 'EmployeeType',
      render: (roleId) => {
        return <span style={{ textTransform: 'capitalize' }} className='textStyle-small'>
          {employeeRoles.get(roleId) ? employeeRoles.get(roleId).split('ROLE.').join('').toLowerCase() : "N/A"}
        </span>;
      }
    },
    {
      title: <span className='textStyles-small'>Factory ID</span>,
      dataIndex: 'FactoryID',
      key: 'FactoryID',
      render: (factoryId) => {
        return <span className='textStyle-small'>FID_{factoryId}</span>;
      }
    },
    {
      title: <span className='textStyles-small'>Action</span>,
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>
            <EyeOutlined
              className='textStyle-small'
              style={{ color: 'blue' }}
              onClick={() => showDetailsModel(record)}
            />
          </a>
          <a>
            <EditOutlined
              className='textStyle-small'
              style={{ color: 'blue' }}
              onClick={() => showEditModel(record)}
            />
          </a>
          <a>
            <DeleteOutlined
              className='textStyle-small'
              style={{ color: 'red' }}
              onClick={() => handleDelete(record.EmployeeID)}
            />
          </a>
        </Space>
      ),
    },
  ];

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
      setEmployeeTypes(response.data);
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
      setFilterData(response.data);
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

const handleDelete = (id) => {
  Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete this employee?`,
      onOk: () => {
          deleteEmplyeeFunction(id);
      },
      onCancel: () => { },
  });
};

const handleUpdate = (id, record) => {
  Modal.confirm({
      title: "Confirm Update",
      content: `Are you sure you want to update this employee?`,
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
        console.log(response);
        if (response !== null) {
          if (response?.data?.success) {
            message.success('Employee registered successfully');
            getAllRegisteredEmployees();
            handleCancel();
          } else {
            message.error('Failed to register employee : '+response?.message);
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
          getAllRegisteredEmployees();
          handleCancel();
        } else {
          message.error('Failed to update employee : '+response?.message);
        }
      }
    } catch (error) {
      message.error('Error updating employee:', error);
    }
  }

  const deleteEmplyeeFunction = async (empID) => {
    try {
      const response = await apiExecutions.deleteEmployee(empID);
      if (response !== null) {
        if (response?.data?.success) {
          message.success('Employee deleted successfully');
          getAllRegisteredEmployees();
        } else {
          message.error('Failed to delete employee : '+response?.message);
        }
      }
    } catch (error) {
      message.error('Error deleting employee:', error);
    }
  }

  const filterByROLES = (e) => {
    setFilterData([]);
    setFilterROLE(e);
    if (e === 'ALL') {
      setFilterData(registeredUsers);
    } else {
      const filteredData = registeredUsers.filter((user) => user.RoleID === e);
      setFilterData(filteredData);
    }
  }

  const filterByUserName = (e) => {
  console.log(e);
    if (e === '' && filterROLE !== 'ALL') {
      const filteredData = registeredUsers.filter((user) => user.RoleID === filterROLE);
      setFilterData(filteredData);
    } else if(e === '' && filterROLE === 'ALL') {
      setFilterData(registeredUsers);
    } else if (e !== 'ALL') {
      const filteredData = registeredUsers.filter((user) =>
        user.EmployeeName.toLowerCase().includes(e.toLowerCase()) && user.RoleID === filterROLE
      );
      setFilterData(filteredData);
    } else {
      const filteredData = registeredUsers.filter((user) =>
        user.EmployeeName.toLowerCase().includes(e.toLowerCase())
      );
      setFilterData(filteredData);
    }
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
              {employeeTypes.map((type) => (
                <Option key={type.RoleID} value={type.RoleID}>
                  {type.RoleName}
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
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
                onChange={(e) => filterByUserName(e.target.value)}
                suffix={<SearchOutlined />}
              />
              <Select style={{ width: 200, textTransform: 'capitalize'}} placeholder="Select employee type"
                 defaultValue={filterROLE} 
                //  onChange={(e) => setFilterROLE(e)}
                  onChange={filterByROLES}
              >
                <Option value="ALL">All</Option>
                {Array.from(employeeRoles.entries()).map(([roleId, roleName]) => (
                  <Option
                    key={roleId}
                    value={roleId}
                    style={{ textTransform: 'capitalize' }}
                    >
                    {roleName.split('ROLE.').join('').toLowerCase()}
                  </Option>
                ))}
              </Select>
              <Button type="primary" style={{ borderRadius: "50px"}}>
                <CloseCircleOutlined /> <span className='textStyle-small'>Export List</span>
              </Button>
              <Button type="primary" onClick={showModal} style={{ borderRadius: "50px"}}>
                <PlusOutlined /> <span className='textStyle-small'>New Employee</span>
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
          dataSource={filterData}
          columns={columns}
          pagination={true}
          loading={registeredUsers.length > 0 ? false : true}
        />
      </div>
    </>
  )
}

export default JobsModule;