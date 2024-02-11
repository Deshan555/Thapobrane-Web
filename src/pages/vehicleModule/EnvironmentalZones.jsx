import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import { apiExecutions } from '../../api/api-call';
import {Table, Space} from 'antd';
import {
    MailOutlined,
    DeleteOutlined,
    PhoneOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    AimOutlined
  } from '@ant-design/icons';

const EnvironmentalZones = () => {

    const [EnvironmentalZones, setEnvironmentalZones] = useState([]);


    const fetchAllEnvironmentalZones = async () => {
        const response = await apiExecutions.getAllEnvironmentZoneInfo();
        console.log(response);
        setEnvironmentalZones(response.data);
        //setAllBaseLocations(response.data[0].BaseLocation);
    }



const columns = [
    {
        title: 'ZoneID',
        dataIndex: 'ZoneID',
        key: 'ZoneID',
        render : (value) => {
            return <b>{value}</b>;
        }
    },
    {
        title: 'ZoneName',
        dataIndex: 'ZoneName',
        key: 'ZoneName',
        render : (value) => {
            return <b>{value}</b>;
        }
    },
    {
        title: 'BaseLocation',
        dataIndex: 'BaseLocation',
        key: 'BaseLocation',
        render : (value) => {
            const [latitude, longitude] = value.split(',').map(Number);
            return <b>
                <a href="#" onClick={() => openLocationGoogleMaps(latitude, longitude)}>
                    <AimOutlined /> {value}
                </a>
            </b>;
        }
    },
    {
        title: 'CreationDate',
        dataIndex: 'CreationDate',
        key: 'CreationDate',
        render : (value) => {
            return <b>{value}</b>;
        }
    },
    {
        title: 'Number Of Fields',
        dataIndex: 'NumberOfFields',
        key: 'NumberOfFields',
        render : (value) => {
            return <b>{value? value : 0}</b>;
        }
    },
    {
        title: 'Production (KG)',
        dataIndex: 'Production',
        key: 'Production',
        render : (value) => {
            return <b>{value? value : 0} KG</b>;
        }
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <a href="#"><EditOutlined /></a>
                <a href="#"><DeleteOutlined style={{ color: 'red' }} /></a>
            </Space>
        ),
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
        fetchAllEnvironmentalZones();
    }, []);

    const mapContainerStyle = {
        width: '100%',
        height: '50vh',
        zIndex: 1,
        borderRadius: '15px',
    };

        // Define a custom marker icon
        const customIcon = new L.Icon({
            iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png', // You can use your own marker icon URL
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

  

    return (
        <>
            <h1>Environmental Zones</h1>
            
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
