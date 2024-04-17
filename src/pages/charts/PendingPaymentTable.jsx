import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb, DatePicker, Badge, Steps } from 'antd';
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
import moment from '../../../node_modules/moment/moment';
import '../charts/chart-styles.css';

const PendingPaymentTable = () => {
    const [fertilizerTable, setFertilizerTable] = useState([]);

    useEffect(() => {
        fetchPendingPaymentCount();
    }, []);

    const fetchPendingPaymentCount = async () => {
        const response = await apiExecutions.getPendingPaymentsDashboard();
        if (response !== null) {
            if (response.success === true) {
                setFertilizerTable(response?.data);
            }
        }
    }

    const headerData = [
        {
          title: <span className='textStyles-small' style={{ fontSize: '13px' }}>Tracking No.</span>,
          key: 'TrackingID',
          dataIndex: 'TrackingID',
          render: (text) => <span className='textStyles-small'>{text}</span>
        },
        {
          title: <span className='textStyles-small' style={{ fontSize: '13px' }}>Requested DeadLine</span>,
          key: 'RequestedDeadLine',
          dataIndex: 'RequestedDeadLine',
          render: (text) => <span className='textStyles-small'>{moment(text).format('DD-MM-YYYY')}</span>
        },
        {
          title: <span className='textStyles-small' style={{ fontSize: '13px' }}>Approval Status</span>,
          key: 'ApprovalStatus',
          dataIndex: 'ApprovalStatus',
          render: (text) => {
            if (text === 'PENDING'){
                return <Badge status="processing" text={<span className='textStyles-small'>{text}</span>} />
            } else if (text === 'APPROVED'){
                return <Badge status="success" text={<span className='textStyles-small'>{text}</span>} />
            } else if (text === 'REJECTED'){
                return <Badge status="error" text={<span className='textStyles-small'>{text}</span>} />
            }
          }
        },
        {
            title: <span className='textStyles-small' style={{ fontSize: '13px' }}>Payment Status</span>,
            key: 'PaymentStatus',
            dataIndex: 'PaymentStatus',
            render: (text) => {
                if (text === 'UNPAID'){
                    return <Badge status="processing" text={<span className='textStyles-small'>{text}</span>} />
                } else if (text === 'PAID'){
                    return <Badge status="success" text={<span className='textStyles-small'>{text}</span>} />
                } else if (text === 'REJECTED'){
                    return <Badge status="error" text={<span className='textStyles-small'>{text}</span>} />
            }
          },
        },
        {
            title: <span className='textStyles-small' style={{ fontSize: '13px' }}>Total Amount</span>,
            key: 'OrderValue',
            dataIndex: 'OrderValue',
            render: (text) => <span className='textStyles-small'>LKR {text}.00</span>
          },
      ]
      
      return (
        <div>
          <Table
            columns={headerData}
            dataSource={fertilizerTable}
            pagination={false}
            bordered = {false}
            size='small'
            // scroll={{ x: 800 }}
          />
        </div>
      );

}

export default PendingPaymentTable;