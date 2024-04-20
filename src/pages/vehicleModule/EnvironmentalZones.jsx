import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticationCheck } from '../vehicleModule/AuthChecker';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { apiExecutions } from '../../api/api-call';
import { Table, Space, Breadcrumb } from 'antd';
import {
    MailOutlined,
    DeleteOutlined,
    PhoneOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    AimOutlined,
    HomeOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import './style.css';

const EnvironmentalZones = () => {

    const [EnvironmentalZones, setEnvironmentalZones] = useState([]);
    const navigate = useNavigate();

    const fetchAllEnvironmentalZones = async () => {
        const response = await apiExecutions.getAllEnvironmentZoneInfo();
        if (response !== null) {
            if (response.success === true) {
                setEnvironmentalZones(response.data);
            }
        }
    }

    const columns = [
        {
            title: 'ZoneID',
            dataIndex: 'ZoneID',
            key: 'ZoneID',
            render: (value) => {
                return <span className='textStyle-small'>{value}</span>;
            }
        },
        {
            title: 'ZoneName',
            dataIndex: 'ZoneName',
            key: 'ZoneName',
            render: (value) => {
                return <span className='textStyle-small'>{value}</span>;
            }
        },
        {
            title: 'BaseLocation',
            dataIndex: 'BaseLocation',
            key: 'BaseLocation',
            render: (value) => {
                const [latitude, longitude] = value.split(',').map(Number);
                return <span className='textStyle-small'>
                    <a href="#" onClick={() => openLocationGoogleMaps(latitude, longitude)}>
                        <AimOutlined /> {value}
                    </a>
                </span>;
            }
        },
        {
            title: 'CreationDate',
            dataIndex: 'CreationDate',
            key: 'CreationDate',
            render: (value) => {
                return <span className='textStyle-small'>{value}</span>;
            }
        },
        {
            title: 'Number Of Fields',
            dataIndex: 'NumberOfFieldsRegistered',
            key: 'NumberOfFieldsRegistered',
            render: (value) => {
                return <span className='textStyle-small'>{value ? value : 0} Fields</span>;
            }
        },
    ];

    const openLocationGoogleMaps = (latitude, longitude) => {
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(googleMapsUrl, '_blank');
    };

    const locations = EnvironmentalZones.map((zone) => {
        const [latitude, longitude] = zone.BaseLocation.split(',').map(Number);
        return {
            name: zone.ZoneName,
            coordinates: [latitude, longitude]
        };
    });

    useEffect(() => {
        authenticationCheck(navigate);
        fetchAllEnvironmentalZones();
    }, []);

    const mapContainerStyle = {
        width: '100%',
        height: '50vh',
        zIndex: 1,
        borderRadius: '15px',
    };
    const customIcon = new L.Icon({
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    return (
        <>            
        <h1 className="headingStyle2">Environmental Zones</h1>
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
            title: 'Environmental Zones',
          },
        ]}
      />


            <MapContainer center={[7.8731, 80.7718]} zoom={7} style={mapContainerStyle}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((location, index) => (
                    <Marker
                        key={index}
                        position={location.coordinates}
                        icon={customIcon} // Set the custom marker icon
                    >
                        <Popup>{location.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
            <div style={{
                padding: 10,
                background: 'white',
                borderRadius: 10,
                marginTop: 10,
            }}>

                <Table dataSource={EnvironmentalZones} columns={columns} />

            </div>
        </>
    );
};

export default EnvironmentalZones;
