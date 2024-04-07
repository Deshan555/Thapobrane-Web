import React, { useState, useEffect } from 'react';
import { InboxOutlined, UploadOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { apiExecutions } from '../../api/api-call';
import { message, Upload, Table, Button, Select, Space, Breadcrumb, Descriptions, Spin, Modal } from 'antd';
import './style.css'
import Papa from 'papaparse';
const { Dragger } = Upload;


const DataImporter = () => {
    const [sectionID, setSectionID] = useState();
    const [extractedData, setExtractedData] = useState([]);
    const [responseSummery, setResponseSummery] = useState([]);
    const [failedList, setFailedList] = useState(null);
    const [loading, setLoading] = useState(false);

    const props = {
        name: 'file',
        multiple: false,
        size: 'small',
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const { status } = info.file;

            fileExtractor(info);

            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const allKeys = extractedData?.reduce((keys, obj) => {
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



    const fileExtractor = (info) => {
        const dataArr = [];
        setExtractedData([]);
        Papa.parse(info.file.originFileObj, {
            complete: function (results) {
                console.log('Parsed: ', results);
                results.data.forEach((item, index) => {
                    if (index > 0) {
                        if (sectionID === 1) {
                            dataArr.push({
                                collectionDate: item[0],
                                teaWeightCollected: item[1],
                                waterWeightCollected: item[2],
                                actualTeaWeight: item[3],
                                fieldID: item[4],
                                remark: item[5],
                                employeeID: item[6]
                            });
                        } else if (sectionID === 3) {
                            dataArr.push({
                                customerName: item[0],
                                customerMobile: item[1],
                                customerAddress: item[2],
                                customerEmail: item[3],
                                customerType: item[4],
                                factoryID: item[5]
                            });
                        } else {
                            dataArr.push({
                                EmployeeName: item[0],
                                EmployeeMobile: item[1],
                                EmployeeEmail: item[2],
                                EmployeeType: item[3],
                                FactoryID: item[4]
                            });
                        }
                    }
                });
                setExtractedData(dataArr);
            }
        });
    }

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


    const confirmationModelImport = (fieldID) => {
        const { confirm } = Modal;
        confirm({
            title:
                "Are you sure you want to Import this Data?",
            onOk: async () => {
                executionImports();
            },
            onCancel() { },
        });
    };

    return (
        <>
            <h1 className="headingStyle2">Data Importer</h1>
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
                        title: 'Data Importer',
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
                                placeholder="Select Import Type"
                            >
                                <Select.Option value={1} style={{ fontSize: 12 }} className="textStyle-small">Bulk Tea Record Import </Select.Option>
                                <Select.Option value={2} style={{ fontSize: 12 }} className="textStyle-small">Bulk Employees Import</Select.Option>
                                <Select.Option value={3} style={{ fontSize: 12 }} className="textStyle-small">Bulk Customer Import</Select.Option>
                            </Select>
                            {
                                extractedData.length === 0 && (
                                    <Upload {...props} style={{ width: 120, float: 'right' }}>
                                        <Button style={{ fontSize: 12 }} className="textStyle-small" icon={<UploadOutlined />}>
                                            Click to Upload
                                        </Button>
                                    </Upload>
                                )
                            }
                            {
                                extractedData.length > 0 && (
                                    <>
                                        <Button type="primary" danger style={{ width: 120, float: 'right' }}
                                            onClick={() => setExtractedData([])}>
                                            <span style={{ fontSize: 12 }} className="textStyle-small">Reset Imports</span>
                                        </Button>
                                        <Button type="primary" style={{ width: 120, float: 'right' }}
                                            onClick={confirmationModelImport}>
                                            <span style={{ fontSize: 12 }} className="textStyle-small">Import Data</span>
                                        </Button>
                                    </>)
                            }
                        </Space>
                    </div>
                </Space>
            </div>

            {
                extractedData.length > 0 && failedList === null && (
                    <div style={{ padding: 10, background: 'white', borderRadius: 10, marginTop: 20 }}>
                        <h3 className="headingStyle3">Imported Data Preview</h3>
                        <Table
                            dataSource={extractedData}
                            columns={columns}
                            size="small"
                            className="textStyle-small ant-table-small ant-table-bordered ant-table-fixed-header ant-table-fixed-column"
                        />
                    </div>
                )
            }

            {
                failedList !== null && (
                    <div style={{ padding: 10, background: 'white', borderRadius: 10, marginTop: 20 }}>
                        <h3 className="headingStyle3">Execution Summary</h3>

                        <Descriptions
                            bordered
                            size="small"
                            column={2}
                            style={{ marginBottom: 20 }}
                        >
                            <Descriptions.Item label="Total Records" className="textStyle-small" style={{ fontSize: '12px' }}>
                                {failedList?.totalRecords}</Descriptions.Item>
                            <Descriptions.Item label="Success Records" className="textStyle-small" style={{ fontSize: '12px' }}>
                                {failedList?.successCount}</Descriptions.Item>
                            <Descriptions.Item label="Failed Records" className="textStyle-small" style={{ fontSize: '12px' }}>
                                {failedList?.failedCount}</Descriptions.Item>
                        </Descriptions>

                        <Table
                            dataSource={failedList?.failedList}
                            columns={failedColumns}
                            size="small"
                            className="textStyle-small ant-table-small ant-table-bordered ant-table-fixed-header ant-table-fixed-column"
                        />
                    </div>
                )
            }
        </>
    )
}

export default DataImporter;