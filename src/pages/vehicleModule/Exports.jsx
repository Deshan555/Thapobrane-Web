import React, { useState, useEffect } from 'react';
import { InboxOutlined, UploadOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { apiExecutions } from '../../api/api-call';
import { message, Upload, Table, Button, Select, Space, Breadcrumb, Descriptions, Spin, Modal } from 'antd';
import './style.css'
import Papa from 'papaparse';
const { Dragger } = Upload;


const Exports = () => {
    const [sectionID, setSectionID] = useState(null);
    const [extractedData, setExtractedData] = useState([]);
    const [responseSummery, setResponseSummery] = useState([]);
    const [failedList, setFailedList] = useState(null);
    const [loading, setLoading] = useState(false);

    const [exportData, setExportData] = useState([]);
    const [exportType, setExportType] = useState(1);

    
    const fetchRecords = async () => {
        const selectionIDGet = sectionID;
        if (selectionIDGet !== null) {
            setLoading(true);
            switch (selectionIDGet) {
                case 1:
                    const response = await apiExecutions.getAllDailyTeaCollection();
                    if (response !== null) {
                        if (response.success === true) {
                            setExportData(response.data);
                        }
                    }
                    break;
                case 2:
                    const response2 = await apiExecutions.getAllEmployees();
                    if (response2 !== null) {
                        if (response2.success === true) {
                            setExportData(response2.data);
                        }
                    }
                    break;
                case 3:
                    const response3 = await apiExecutions.getAllCustomers();
                    if (response3 !== null) {
                        if (response3.success === true) {
                            setExportData(response3.data);
                        }
                    }
                    break;
                case 4:
                    const response4 = await apiExecutions.getAllFieldInfo();
                    if (response4 !== null) {
                        if (response4.success === true) {
                            setExportData(response4.data);
                        }
                    }
                    break;
                case 5:
                    const response5 = await apiExecutions.getAllVehicles();
                    if (response5 !== null) {
                        if (response5.success === true) {
                            setExportData(response5.data);
                        }
                    }
                    break;
                case 6:
                    const response6 = await apiExecutions.getAllRoadRoutings();
                    if (response6 !== null) {
                        if (response6.success === true) {
                            setExportData(response6.data);
                        }
                    }
                    break;
                case 7:
                    const response7 = await apiExecutions.getAllFertilizerInfo();
                    if (response7 !== null) {
                        if (response7.success === true) {
                            setExportData(response7.data);
                        }
                    }
                    break;
                case 8:
                    const response8 = await apiExecutions.getAllDertilizerOrdersList();
                    if (response8 !== null) {
                        if (response8.success === true) {
                            setExportData(response8.data);
                        }
                    }
                    break;
                default:
                    message.error('Please Select Export Type First');
                    break;
                }
                setLoading(false);
        } else {
            message.error('Please Select Export Type First');
        }
    }

    const allKeys = exportData?.reduce((keys, obj) => {
        Object.keys(obj).forEach(key => {
            if (!keys.includes(key)) {
                keys.push(key);
            }
        });
        return keys;
    }, []);

    const transformKey = (key) => {
        const words = key.split(/(?=[A-Z])/);
        const transformedKey = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return transformedKey;
    }

    const maxColumns = Math.min(7, allKeys?.length);
    const columns = allKeys?.slice(0, maxColumns).map(key => ({
        title: transformKey(key),
        dataIndex: key,
        key: key,
    }));


    // Faild Data Show Logical Operations
    const allKeysFaild = failedList?.failedList?.reduce((keys, obj) => {
        Object.keys(obj).forEach(key => {
            if (!keys.includes(key)) {
                keys.push(key);
            }
        });
        return keys;
    }, []);

    const failedColumns = allKeysFaild?.slice(0, maxColumns).map(key => ({
        title: transformKey(key),
        dataIndex: key,
        key: key,
    }));





    const executionImports = async () => {
        setLoading(true);
        if (sectionID === 1) {
            const response = await apiExecutions.bulkDailyTeaCollection(extractedData);
            if (response !== null) {
                if (response.success === true) {
                    setFailedList(response.data);
                    message.success('Data Imported Finished View Import Log For More Information');
                } else {
                    message.error('Failed To Import Data To System');
                }
                setLoading(false);
            }
        } else if (sectionID === 2) {
            const response = await apiExecutions.bulkEmployeeRegistration(extractedData);
            if (response !== null) {
                if (response.success === true) {
                    setFailedList(response.data);
                    message.success('Data Imported Finished View Import Log For More Information');
                } else {
                    message.error('Failed To Import Data To System');
                }
                setLoading(false);
            }
        } else {
            const response = await apiExecutions.bulkCustomerRegisteration(extractedData);
            if (response !== null) {
                if (response.success === true) {
                    setFailedList(response.data);
                    message.success('Data Imported Finished View Import Log For More Information');
                } else {
                    message.error('Failed To Import Data To System');
                }
                setLoading(false);
            }
        }
    }

    const downloadJSON = (data, filename) => {
        const jsonStr = JSON.stringify(data);
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    const downloadManager = () => {
        const getFileFormat = exportType;
        const exportFileName = sectionID === 1 ? 'TeaRecords' 
        : sectionID === 2 ? 'EmployeeRecords' 
        : sectionID === 3 ? 'CustomerRecords' 
        : sectionID === 4 ? 'FieldList' 
        : sectionID === 5 ? 'VehicleList' 
        : sectionID === 6 ? 'RouteList' 
        : sectionID === 7 ? 'FertilizerList' 
        : 'FertilizerOrdersList';
        const exportFileFinalName = exportFileName+ '_' + new Date().getTime();
        switch (getFileFormat) {
            case 1:
                const csv = Papa.unparse(exportData);
                const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const csvURL = window.URL.createObjectURL(csvData);
                const tempLink = document.createElement('a');
                tempLink.href = csvURL;
                tempLink.setAttribute('download', exportFileFinalName + '.csv');
                tempLink.click();
                break;
            case 2:
                const XLSX = require('xlsx');
                const worksheet = XLSX.utils.json_to_sheet(exportData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
                const excelURL = window.URL.createObjectURL(excelData);
                const tempLinks = document.createElement('a');
                tempLinks.href = excelURL;
                tempLinks.setAttribute('download', exportFileFinalName + '.xlsx');
                tempLinks.click();
                break;
            case 3:
                downloadJSON(exportData, exportFileFinalName + '.json');
                break;
            default:
                message.error('Please Select Export Type First');
                break;
        }
    }


    const confirmationModelImport = (fieldID) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are you sure you want to Export this Data?",
            onOk: async () => {
                downloadManager();
            },
            onCancel() { },
        });
    };

    return (
        <>
            <h1 className="headingStyle2">Data Exporter</h1>
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
                                <span>Admin Utils</span>
                            </>
                        ),
                    },
                    {
                        href: '',
                        title: 'Data Exporter',
                    },
                ]}
            />

            <Spin
                tip="Import Processing..."
                spinning={loading}
                fullscreen={true}
            />
            <div style={{ padding: 10, background: 'white', borderRadius: 10 }}>
                <Space>
                    <div style={{ padding: 10, background: 'white', borderRadius: 10, display: 'flex', justifyContent: 'flex-end' }}>
                        <Space align="end" size="middle">
                            <Select
                                className="textStyle-small"
                                defaultValue={sectionID}
                                style={{ width: 200, float: 'right', fontSize: 12 }}
                                onChange={value => setSectionID(value)}
                                placeholder="Select Export Type"
                            >
                                <Select.Option value={1} style={{ fontSize: 12 }} className="textStyle-small">Tea Records Export</Select.Option>
                                <Select.Option value={2} style={{ fontSize: 12 }} className="textStyle-small">Employees Export</Select.Option>
                                <Select.Option value={3} style={{ fontSize: 12 }} className="textStyle-small">Customer Export</Select.Option>
                                <Select.Option value={4} style={{ fontSize: 12 }} className="textStyle-small">Field List Export </Select.Option>
                                <Select.Option value={5} style={{ fontSize: 12 }} className="textStyle-small">Vehicle List Export </Select.Option>
                                <Select.Option value={6} style={{ fontSize: 12 }} className="textStyle-small">Route List Export </Select.Option>
                                <Select.Option value={7} style={{ fontSize: 12 }} className="textStyle-small">Fertilizer List Export </Select.Option>
                                <Select.Option value={8} style={{ fontSize: 12 }} className="textStyle-small">Fertilizer Orders List Export </Select.Option>
                            </Select>

                            {
                                sectionID !== null && exportData.length === 0 && (
                                    <Button type="primary" style={{ width: 120, float: 'right' }}
                                        onClick={fetchRecords}>
                                        <span style={{ fontSize: 12 }} className="textStyle-small">Fetch Records</span>
                                    </Button>
                                )
                            }
                            
                            {
                                exportData.length > 0 && (
                                    <Select
                                    className="textStyle-small"
                                    defaultValue={exportType}
                                    style={{ width: 200, float: 'right', fontSize: 12 }}
                                    onChange={value => setExportType(value)}
                                    placeholder="Select Export Type"
                                >
                                    <Select.Option value={1} style={{ fontSize: 12 }} className="textStyle-small">CSV Export</Select.Option>
                                    <Select.Option value={2} style={{ fontSize: 12 }} className="textStyle-small">Excel Export</Select.Option>
                                    <Select.Option value={3} style={{ fontSize: 12 }} className="textStyle-small">JSON Export</Select.Option>
                                </Select>
                                ) 
                            }
                            {
                                exportData.length > 0 && (
                                    <>
                                        <Button type="primary" danger style={{ width: 120, float: 'right' }}
                                            onClick={() => {
                                                setExportData([]);
                                                setSectionID(null);
                                            }}>
                                            <span style={{ fontSize: 12 }} className="textStyle-small">New Export</span>
                                        </Button>
                                        <Button type="primary" style={{ width: 120, float: 'right' }}
                                            onClick={confirmationModelImport}>
                                            <span style={{ fontSize: 12 }} className="textStyle-small">Export Data</span>
                                        </Button>
                                    </>
                                )
                            }
                        </Space>
                    </div>
                </Space>
            </div>

            {
                exportData?.length > 0  &&(
                    <div style={{ padding: 10, background: 'white', borderRadius: 10, marginTop: 20 }}>
                        <h3 className="headingStyle3" style={{ marginLeft: 10 }}> 
                        Fetching Data Preview </h3>
                        <Table
                            dataSource={exportData}
                            columns={columns}
                            size="small"
                            className="textStyle-small ant-table-small ant-table-bordered ant-table-fixed-header ant-table-fixed-column"
                        />
                    </div>
                )
            }
        </>
    )
}

export default Exports;