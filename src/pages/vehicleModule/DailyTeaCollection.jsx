import React, { useState, useEffect } from 'react';
import { apiExecutions } from '../../api/api-call';
import { allCities } from '../../api/cities';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, Row, Col, DatePicker, Drawer, message } from 'antd';
import './style.css';

// SourceFactoryID, Destination, RoundTrip, StartLongitude, StartLatitude, EndLongitude, EndLatitude

const DailyTeaCollection = () => {
  const [allRoadRoutings, setAllRoadRoutings] = useState([]);

  useEffect(() => {
    fetchAllRoadRoutings();
  }, []);

  const fetchAllRoadRoutings = async () => {
    const response = await apiExecutions.getAllRoadRoutings();
    if (response !== null && response !== undefined) {
        if (response.success === true) {
            setAllRoadRoutings(response.data);
        } else {
            message.error('Failed to fetch Road Routings');
        }
    }
  }

  const columns = [
    {
      title: <span className='textStyle'>Routing ID</span>,
      dataIndex: 'RoutingID',
      key: 'RoutingID',
      render: text => <b className='textStyles-small'>{text}</b>,
    },
    // {
    //   title: <span className='textStyle'>Source Factory ID</span>,
    //   dataIndex: 'SourceFactoryID',
    //   key: 'SourceFactoryID',
    //   render: text => <b className='textStyles-small'>{text}</b>,
    // },
    {
      title: <span className='textStyle'>Destination</span>,
      dataIndex: 'Destination',
      key: 'Destination',
      render: text => <b className='textStyles-small'>{text}</b>,
    },
    {
      title: <span className='textStyle'>Round Trip</span>,
      dataIndex: 'RoundTrip',
      key: 'RoundTrip',
      render: text => <b className='textStyles-small'>{text}</b>,
    },
    {
      title: <span className='textStyle'>Start Location</span>,
      dataIndex: 'StartLongitude',
      key: 'StartLongitude',
      render: (text, record) => (
        <Space size="middle">
          <Tag color="blue" className='textStyles-small'>{record.StartLongitude}, {record.StartLatitude}</Tag>
        </Space>
      ),
    },
    {
      title: <span className='textStyle'>End Location</span>,
      dataIndex: 'EndLongitude',
      key: 'EndLongitude',
      render: (text, record) => (
        <Space size="middle">
          <Tag color="blue" className='textStyles-small'>{record.EndLongitude}, {record.EndLatitude}</Tag>
        </Space>
      ),
    },
    {
      title: <span className='textStyle'>Total Stops</span>,
      dataIndex: 'TotalStops',
      key: 'TotalStops',
      render: text => <b className='textStyles-small'>{text}</b>,
    },
    {
      title: <span className='textStyle'>Duration</span>,
      dataIndex: 'Duration',
      key: 'Duration',
      render: text => <b className='textStyles-small'>{text}</b>,
    },
  ];


  return (
    <>
      <h1>Dual Routes Map</h1>
      <div id="map" style={{ height: '400px' }}></div>

      <div style={{
                padding: 10,
                background: 'white',
                borderRadius: 10,
                marginTop: 10,
            }}>
                <Table
                    columns={columns}
                    dataSource={allRoadRoutings}
                    pagination={{ pageSize: 50 }}
                    loading={allRoadRoutings.length === 0}
                    size="small"
                />
            </div>
    </>
  );
};

export default DailyTeaCollection;
