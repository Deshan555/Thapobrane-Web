import React, { useState, useEffect } from "react";
import { Table, Input, Select, Button, Modal, Space, Tag, Tooltip, Row, Col } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { FilePdfOutlined, FileWordOutlined } from "@ant-design/icons";
import { Container } from "../../../node_modules/@mui/material/index";


const { Option } = Select;

const VehicleModule = () => {
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedVehicleType, setSelectedVehicleType] = useState("");
    const [visible, setVisible] = useState(false);

    const vehicleTypes = ["Trcuks", "Mini Trucks", "Heavy Trucks", "Container Trucks"];
    const truckSubTypes = ["4-WHEEL", "6-WHEEL", "8-WHEEL", "10-WHEEL", "12-WHEEL"];
    const truckBrandNames = ["Toyota", "Nissan", "Mitsubishi", "Isuzu", "Hino", "Fuso"]

    const getRandomElement = (arrayName) => {
        return arrayName[Math.floor(Math.random() * arrayName.length)];
    }

    useEffect(() => {
        // Fetch data from the API
        axios.get("https://jsonplaceholder.typicode.com/posts").then((response) => {
            // Map the API response to the format expected by antd Table
            const formattedData = response.data.map((item) => ({
                key: item.id,
                registerNumber: item.id,
                vehicleType: getRandomElement(vehicleTypes),
                vehicleSubtype: getRandomElement(truckSubTypes),
                brand: getRandomElement(truckBrandNames),
                seatingCapacity: Math.floor(Math.random(2, 5) * 6),
                vehicleImage: "https://via.placeholder.com/50", // Example image URL
                documents: ["https://via.placeholder.com/50/register.pdf", "https://via.placeholder.com/50/register.docx"]
            }));
            setDataSource(formattedData);
        });
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    const columns = [
        {
            title: "Register Number",
            dataIndex: "registerNumber",
            key: "registerNumber",
            render: (text) => {
                return <b>{text}</b>;
              }
              
        },
        {
            title: "Vehicle Type",
            dataIndex: "vehicleType",
            key: "vehicleType",
            render: (text) => (
                <Space size={[0, 8]} wrap>
                    <Tag style={{
                        fontSize: '12px', fontWeight: "bolder", width: "100px", height: "30px",
                        padding: "5px 5px 5px 5px", textAlign: "center", borderRadius: "5px"
                    }}
                        color={
                            text === "Trcuks" ? "#f50" :
                                text === "Mini Trucks" ? "#2db7f5" :
                                    text === "Heavy Trucks" ? "#87d068" :
                                        text === "Container Trucks" ? "#108ee9" :
                                            "purple"
                        }
                    ><b>{text}</b>
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Vehicle Subtype",
            dataIndex: "vehicleSubtype",
            key: "vehicleSubtype",
        },
        {
            title: "Brand",
            dataIndex: "brand",
            key: "brand",
        },
        {
            title: "Seating Capacity",
            dataIndex: "seatingCapacity",
            key: "seatingCapacity",
        },
        {
            title: "Vehicle Image",
            dataIndex: "vehicleImage",
            key: "vehicleImage",
            render: (text) => <img src={text} alt="Vehicle" style={{ maxWidth: '95px', maxHeight: '50px' }} />
        },
        {
            title: "Documents",
            dataIndex: "documents",
            key: "documents",
            render: (text) => <div>
                {text.map((item) => {
                    if (item.includes(".pdf")) {
                        return <FilePdfOutlined style={{ fontSize: 20, marginRight: 10, color: "red" }} />
                    } else if (item.includes(".docx")) {
                        return <FileWordOutlined style={{ fontSize: 20, marginRight: 10, color: "blue" }} />
                    }
                })}
            </div>
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <>
                    <Button
                        type="circle"
                        style={{ backgroundColor: "#EBEFFF" }}
                        icon={<EditOutlined style={{ color: "#2C5EF4" }} />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="circle"
                        style={{ backgroundColor: "#FEF2F3", marginLeft: 5 }}
                        icon={<DeleteOutlined style={{ color: "#FF0000" }} />}
                        onClick={() => handleDelete(record)}
                    />
                </>
            ),
        },
    ];

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const handleEdit = (record) => {
        console.log("Edit", record);
        // Implement the logic to show a modal for editing
        setVisible(true);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Confirm Delete",
            content: `Are you sure you want to delete ${record.registerNumber}?`,
            onOk: () => {
                // Implement the logic to delete the record
                const updatedData = dataSource.filter((item) => item.key !== record.key);
                setDataSource(updatedData);
            },
            onCancel: () => { },
        });
    };

    return (
        <div style={{
            backgroundColor: "#FFFFFF",
            padding: "5px 5px 5px 5px",
            borderRadius: "10px",
            // boxShadow: "0px 0px 10px #888888",
        }}>
            <h1 style={{ textAlign: "center" }}>Vehicle Module</h1>
            <Row>
                <Col span={12}>
                    <Button float="left" type="primary" style={{ marginBottom: 16 }}>
                        Add Vehicle
                    </Button>
                </Col>
                <Col span={12}>
                    <div style={{ float: "right" }}>
                    <Input.Search
                        placeholder="Search by register number"
                        onSearch={(value) => console.log(value)}
                        style={{ marginBottom: 16, width: 200 , borderColor: "#2C5EF4"}}
                    />
                    <Select
                        placeholder="Select Vehicle Type"
                        style={{ width: 100, marginBottom: 16 , borderColor: "blue"}}
                        onChange={(value) => setSelectedVehicleType(value)}
                    >
                        {vehicleTypes.map((item) => (
                            <Option value={item}>{item}</Option>
                        ))}
                    </Select>
                    <Button
                        type="primary"
                        style={{ marginBottom: 16 }}
                        onClick={() => console.log(selectedVehicleType)}
                    >Apply</Button>
                    </div>
                </Col>
            </Row>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="key"
            />
        </div>
    );
};

export default VehicleModule;
