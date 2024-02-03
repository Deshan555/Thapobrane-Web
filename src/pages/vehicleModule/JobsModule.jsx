import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal } from 'antd';
const { Option } = Select;


const JobsModule = () => {
    const [open, setOpen] = useState(false);
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

    const [employeeRoles, setEmployeeRoles] = useState(new Map());

    const handleEmployeeNameChange = (e) => {
      setEmployeeRegister({...employeeRegister, EmployeeName: e.target.value});
    }

    const handleEmployeeMobileChange = (e) => {
      setEmployeeRegister({...employeeRegister, EmployeeMobile: e.target.value});
    }

    const handleEmployeeEmailChange = (e) => {
      setEmployeeRegister({...employeeRegister, EmployeeEmail: e.target.value});
    }

    const handleEmployeeTypeChange = (e) => {
      setEmployeeRegister({...employeeRegister, EmployeeType: e.target.value});
    }

    const handleFactoryIDChange = (e) => {
      setEmployeeRegister({...employeeRegister, FactoryID: e.target.value});
    }

    const handlePasswordChange = (e) => {
      setEmployeeRegister({...employeeRegister, Password: e.target.value});
    }

    useEffect(() => {
      getAllEmpRoles();
    }, []);
  
    useEffect(() => {
      // Log employeeRoles when it changes
      console.log(employeeRoles);
    }, [employeeRoles]);



    const showModal = () => {
      setOpen(true);
    };

    const handleOk = () => {
      setModalText('That Employee Registeration Process Related To Only That Digitalization Process');
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
    };

    const handleCancel = () => {
      console.log('Clicked cancel button');
      setOpen(false);
    };

    const apiCall = async () => {
      const response = await apiExecutions.authEmployee("john.doe@example5.com", "securePassword123");
      console.log(response);
    }

  const getAllEmpRoles = async () => {
    const response = await apiExecutions.getAllEmployeeRoles();
    console.log(response);
    if (response.success === true) {
      console.log('=====================================================');

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

    const onFinish = (values) => {
      // Handle form submission here
      console.log('Received values:', values);
    };

    const employeeRolesx = {
      role1: 'Role 1',
      role2: 'Role 2',
      role3: 'Role 3',
      // Add more roles as needed
    };

    return (
        <>

        <pre>
          {JSON.stringify(employeeRoles, null, 2)}
        </pre>
        
        <Button type="primary" onClick={apiCall}>
          Open Modal with async logic
        </Button>

        <Button type="primary" onClick={showModal}>
          Open Modal with async logic
        </Button>
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
              <Input />
            </Form.Item>

            <Form.Item label="Employee Mobile" name="mobile" rules={[{ required: true, message: 'Please enter employee mobile' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Employee Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Employee Type" name="type" rules={[{ required: true, message: 'Please select employee type' }]}>
              <Select>
              {Array.from(employeeRoles.entries()).map(([roleId, roleName]) => (
                <Option key={roleId} value={roleId}>
                  {roleName}
                </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Factory ID" name="factory" rules={[{ required: true, message: 'Please enter factory ID' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
              <Input.Password 
              {/* Random strong password generator, and set password to default value */}
              value={ 
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Register Employee
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
}

export default JobsModule;