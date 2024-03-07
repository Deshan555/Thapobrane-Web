import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { Table, Space } from 'antd';
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
import { number } from 'prop-types';

const Customers = () => {

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        //apiCall();
        getAllCustomers();
    }, []);

    // sample login auth 
    const apiCall = async () => {
        const response = await apiExecutions.authEmployee("john.doe@example5.com", "securePassword123");
        console.log(response);
      }
    
    const getAllCustomers = async () => {
        console.log('getAllCustomers-----------------------------------------------------------');
        const customers = await apiExecutions.getAllCustomers();
        console.log(customers);
        setCustomers(customers.data);
    }
    /*
          "CustomerID": 629,
      "CustomerName": "Eva Wilson",
      "CustomerMobile": "6789012345",
      "CustomerAddress": "303 Maple St, Suburbia",
      "CustomerEmail": "eva.wilson@example.com",
      "CustomerType": "",
      "RegistrationDate": "2023-11-30T18:30:00.000Z",
      "Password": "$2b$10$YYXdHq3BDWaPtOQZ6dQZf.8DfMUA2WRwAAAi93lKLelzk9urRv5jO",
      "FactoryID": 6,
      "IdentitiCardNumber": null
      */

    const columns = [
        {
            title : 'CustomerID',
            dataIndex : 'CustomerID',
            key : 'CustomerID',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        {
            title : 'CustomerName',
            dataIndex : 'CustomerName',
            key : 'CustomerName',
            render: (value) => {
                return <b>{value}</b>;
            }
        },
        {
            title : 'CustomerMobile',
            dataIndex : 'CustomerMobile',
            key : 'CustomerMobile',
            render: (number) => {
                return (
                    <a href={`tel:${number}`}>
                      <b>
                        <PhoneOutlined /> {number}
                      </b>
                    </a>
                );
            }
        },
        {
            title : 'CustomerEmail',
            dataIndex : 'CustomerEmail',
            key : 'CustomerEmail',
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
            title : 'CustomerAddress',
            dataIndex : 'CustomerAddress',
            key : 'CustomerAddress',
            render: (address) => {
                return <b>{address}</b>;
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
                    //onClick={() => showDetailsModel(record)}
                  />
                </a>
                <a>
                  <EditOutlined
                    style={{ color: 'blue' }}
                    //onClick={() => showEditModel(record)}
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

    return (
        <>
        <h1>
            Customers
        </h1>
        <Table 
        dataSource={customers} 
        columns={columns}
        loading={customers.length === 0}
        pagination={true}
        />
      </>
    )
}

export default Customers;