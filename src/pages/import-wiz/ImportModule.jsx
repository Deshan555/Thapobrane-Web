// import React, { useState } from 'react';
// import Dropzone from 'react-dropzone';
// import * as XLSX from 'xlsx';
// import Papa from 'papaparse';
// import { Typography, Form, Space, Dropdown, Steps, message, Upload, Col, Row, Divider, Descriptions, Table} from 'antd';
// import { map } from 'lodash';
// import { DownOutlined, InboxOutlined } from '@ant-design/icons';
// const { Dragger } = Upload;
// import  {ReactComponent as Details} from '../../assets/images/app/details.svg';
// import { set } from 'lodash';

// // action style
// const FileUploader = () => {
//   const [fileData, setFileData] = useState(null);
//   const [headers, setHeaders] = useState(null);
//   const [fileDetails, setFileDetails] = useState(null);
//   const [tableName, setTableName] = useState(null);
//   const Step = Steps.Step;
//   const [isUploadModalVisible, setIsUploadModalVisible] = useState(true);
//   const [fileFormat, setFileFormat] = useState(null);

//   const dataBaseSelecter = [
//     {
//       "tableName": "driver",
//       "displayNames": ["Driver ID", "Driver Name", "Driver Phone", "Driver Email", "Driver Address", "Driver DOB", "Driver License", "Driver License Exp"],
//       "fieldNames": ["driverID", "driverName", "driverPhone", "driverEmail", "driverAddress", "driverDOB", "driverLicense", "driverLicenseExp"]
//     },
//     {
//       "tableName": "vehicle",
//       "displayNames": ["Vehicle ID", "Vehicle Name", "Vehicle Type", "Vehicle Make", "Vehicle Model", "Vehicle Year", "Vehicle Color", "Vehicle License", "Vehicle License Exp"],
//       "fieldNames": ["vehicleID", "vehicleName", "vehicleType", "vehicleMake", "vehicleModel", "vehicleYear", "vehicleColor", "vehicleLicense", "vehicleLicenseExp"]
//     },
//     {
//       "tableName": "customer",
//       "displayNames": ["Customer ID", "Customer Name", "Customer Phone", "Customer Email", "Customer Address", "Customer DOB"],
//       "fieldNames": ["customerID", "customerName", "customerPhone", "customerEmail", "customerAddress", "customerDOB"]
//     },
//     {
//       "tableName": "order",
//       "displayNames": ["Order ID", "Order Date", "Order Time", "Order Status", "Order Type", "Order Address", "Order Customer ID", "Order Driver ID", "Order Vehicle ID"],
//       "fieldNames": ["orderID", "orderDate", "orderTime", "orderStatus", "orderType", "orderAddress", "orderCustomerID", "orderDriverID", "orderVehicleID"]
//     },
//     {
//       "tableName": "payment",
//       "displayNames": ["Payment ID", "Payment Date", "Payment Time", "Payment Type", "Payment Amount", "Payment Status", "Payment Order ID"],
//       "fieldNames": ["paymentID", "paymentDate", "paymentTime", "paymentType", "paymentAmount", "paymentStatus", "paymentOrderID"]
//     }
//   ]

//   const items = map(dataBaseSelecter, (dataBase) => ({
//     key: dataBase.tableName,
//     label: dataBase.tableName,
//   }));

//   const handleFileUpload = (acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const status = checkFileTypes(file);
//     if (file && status) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const content = e.target.result;

//         const fileInformation = {
//           name: file.name,
//           sizeMB: file.size / 1024 / 1024,
//           type: file.type,
//           lastModified: file.lastModified,
//         };

//         setFileDetails(fileInformation);
//         console.log(fileDetails);

//         if (file.name.endsWith('.json')) {
//           const jsonData = JSON.parse(content);
//           setFileFormat('json');
//           // console.log(Object.keys(JSON.parse(content)[0]));
//           setFileData(jsonData);
//         } else if (file.name.endsWith('.xlsx')) {
//           const workbook = XLSX.read(content, { type: 'binary' });
//           const sheetName = workbook.SheetNames[0];
//           const sheet = workbook.Sheets[sheetName];
//           const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//           const headers = excelData[0];
//           setHeaders(headers);
//           setFileFormat('xlsx');
//           console.log(headers);
//           setFileData(excelData);
//         } else if (file.name.endsWith('.csv')) {
//           setFileFormat('csv');
//           const csvHeader = content.split('\n')[0];
//           setHeaders(csvHeader.split(','));
//           console.log(csvHeader.split(','));
//           console.log(headers);
//           Papa.parse(file, {
//             header: true,
//             dynamicTyping: true,
//             complete: (result) => {
//               setFileData(result.data);
//             },
//           });
//         } else if (file.name.endsWith('.xls')) {
//           setFileFormat('xls');
//           const workbook = XLSX.read(content, { type: 'binary' });
//           const sheetName = workbook.SheetNames[0];
//           const sheet = workbook.Sheets[sheetName];
//           const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//           const headers = excelData[0];
//           setHeaders(headers);
//           console.log(headers);
//           setFileData(excelData);
//         }
//       };
//       if (file.name.endsWith('.xlsx')) {
//         reader.readAsBinaryString(file);
//       } else if (file.name.endsWith('.xls')) {
//         reader.readAsBinaryString(file);
//       } else {
//         reader.readAsText(file);
//       }
//     }
//   };

//   const checkFileTypes = (file) => {
//     if (file.name.endsWith('.json') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv') || file.name.endsWith('.xls')) {
//       setIsUploadModalVisible(false);
//       return true;
//     } else {
//       message.error('Invalid File Type Uploaded, Please Upload a Valid File Type');
//       return false;
//     }
//   };

//   // const props = {
//   //   name: 'file',
//   //   multiple: true,
//   //   action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
//   //   onChange(info) {
//   //     const { status } = info.file;
//   //     if (status !== 'uploading') {
//   //       console.log(info.file, info.fileList);
//   //     }
//   //     if (status === 'done') {
//   //       message.success(`${info.file.name} file uploaded successfully.`);
//   //     } else if (status === 'error') {
//   //       message.error(`${info.file.name} file upload failed.`);
//   //     }
//   //   },
//   //   onDrop(e) {
//   //     console.log('Dropped files', e.dataTransfer.files);
//   //   },
//   // };

//   // const columns = headers.map((header) => ({
//   //   title: header,
//   //   dataIndex: header,
//   //   key: header,
//   // }));

//   const columns = headers ? headers.map((header) => ({
//     title: header,
//     dataIndex: header,
//     key: header,
//   })) : [];

//   function arrayToObjects(dataArray) {
//     const keys = dataArray[0];
//     const resultArray = dataArray.slice(1).map((data) => {
//       const obj = {};
//       keys.forEach((key, index) => {
//         obj[key] = data[index];
//       });
//       return obj;
//     });
//     return resultArray;
//   }
  
//   return (
//     <div>

//       {/* <Steps direction="horizontal" current={1}>
//         <Step title="Finished" description="Choose a file to upload"/>
//         <Step title="In Progress" description="This is a description." />
//         <Step title="Waiting" description="This is a description." />
//       </Steps> */}

//       {
//         isUploadModalVisible && (
//           <Dropzone onDrop={handleFileUpload} accept=".json, .xlsx, .csv, .xls, .txt" style={{
//             width: '100%',
//             height: '100px',
//             borderWidth: '2px',
//             borderColor: 'rgb(102, 102, 102)',
//             borderStyle: 'dashed',
//             borderRadius: '10px',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             fontSize: '28px',
//           }}>
//             {({ getRootProps, getInputProps }) => (
//               <div {...getRootProps()} style={dropzoneStyle}>
//                 <input {...getInputProps()} />
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined
//                     style={{ fontSize: '46px', color: '#2D5FF4' }}
//                   />
//                 </p>
//                 <p className="ant-upload-text" style={{
//                   fontSize: '14px',
//                   textDecoration: 'capitalize',
//                 }}>Click or drag file to this area to upload</p>
//                 <p className="ant-upload-hint" style={{
//                   fontSize: '16px',
//                   textDecoration: 'capitalize'
//                 }}>
//                   Strictly prohibited from uploading company data or other banned files.
//                 </p>
//               </div>
//             )}
//           </Dropzone>
//         )
//       }

//       {headers && fileDetails && (
//         <div style={{ background: '#ffffff', padding: '30px', borderRadius: '10px' }}>
//               <Descriptions title="File Details Walkthrough" bordered>
//                 <Descriptions label="File Name">{fileDetails.name}</Descriptions>
//                 <Descriptions label="File Size">{fileDetails.sizeMB} MB</Descriptions>
//                 <Descriptions label="File Type">{fileDetails.type}</Descriptions>
//                 <Descriptions label="Last Modified">{fileDetails.lastModified}</Descriptions>
//                 {/* <Descriptions label="File Headers">
//                   <ul>
//                     {headers.map((header) => (
//                       <li>{header}</li>
//                     ))}
//                   </ul>
//                 </Descriptions> */}
//               </Descriptions>
//         </div>
//       )
//       }

//       {
//         fileDetails && headers && (
//           <div>
//             <h3>File Data</h3>
//             <Table dataSource={fileFormat === 'xlsx' || fileFormat === 'xls' ? arrayToObjects(fileData) : fileData} columns={columns} />
//           </div>
//         )
//       }

//       {
//         fileDetails && headers && (
//           <div>
//             <Dropdown
//               menu={{
//                 items,
//                 selectable: true,
//                 defaultSelectedKeys: ['3'],
//                 onSelect: ({ key }) => {
//                   setTableName(key);
//                 },
//               }}
//             >
//               <Typography.Link>
//                 <Space>
//                   Choose A Table
//                   <DownOutlined />
//                 </Space>
//               </Typography.Link>
//             </Dropdown>
//           </div>
//         )
//       }


// {/* 
//       <Typography>DataBase Selector</Typography>
//       {
//         dataBaseSelecter.map((dataBase) => (
//           <div key={dataBase.tableName}>
//             <h3>{dataBase.tableName}</h3>
//             <pre>{JSON.stringify(dataBase.displayNames, null, 2)}</pre>
//           </div>
//         ))
//       } */}

//       {/* <Typography>File Headers</Typography>
//       <form>
//         <label for="cars">Choose a car:</label>
//         <select id="cars" name="cars">
//           {
//             dataBaseSelecter.map((dataBase) => (
//               <option value={dataBase.tableName}>{dataBase.tableName}</option>
//             ))
//           }
//         </select>
//       </form>

//       <Dropdown
//         menu={{
//           items,
//           selectable: true,
//           defaultSelectedKeys: ['3'],
//           onSelect: ({ key }) => {
//             setTableName(key);
//           },
//         }}
//       >
//         <Typography.Link>
//           <Space>
//             Selectable
//             <DownOutlined />
//           </Space>
//         </Typography.Link>
//       </Dropdown> */}

//       {tableName && (
//         <div>
//           <h3>Table Name:</h3>
//           <pre>{JSON.stringify(tableName, null, 2)}</pre>
//           <form>
//             {
//               dataBaseSelecter.map((dataBase) => (
//                 <div key={dataBase.tableName}>
//                   {
//                     dataBase.tableName === tableName && (
//                       <div>
//                         {dataBase.displayNames.map((displayName) => (
//                           <div>
//                             <label for={displayName}>{displayName}</label>
//                             <select id="cars" name="cars">
//                               {headers.map((header) => (
//                                 <option value={header}>{header}</option>
//                               ))}
//                             </select>
//                           </div>
//                         ))}
//                       </div>
//                     )
//                   }
//                 </div>
//               ))
//             }
//           </form>
//         </div>
//       )}

//       {/* {fileData && (
//         <div>
//           <h3>File Data:</h3>
//           <pre>{JSON.stringify(fileData, null, 2)}</pre>
//         </div>
//       )} */}
//     </div>


//   );
// };

// const dropzoneStyle = {
//   border: '2px dashed #cccccc',
//   borderRadius: '4px',
//   padding: '20px',
//   textAlign: 'center',
//   cursor: 'pointer',
// };

// export default FileUploader;

import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Typography, Space, Dropdown, Steps, message, Upload, Descriptions, Table, Row } from 'antd';
import { map } from 'lodash';
import { DownOutlined, InboxOutlined } from '@ant-design/icons';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import { Col } from '../../../node_modules/antd/es/index';
const { Dragger } = Upload;

const FileUploader = () => {
  const [fileData, setFileData] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [tableName, setTableName] = useState(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(true);
  const [fileFormat, setFileFormat] = useState(null);
  const [selectedMappings, setSelectedMappings] = useState({});
  const JSONPrettyMon = require('react-json-pretty/dist/monikai');
  const [dataTypesCrossCheck, setDataTypesCrossCheck] = useState(null);

    const dataBaseSelecter = [
    {
      "tableName": "driver",
      "displayNames": ["Driver ID", "Driver Name", "Driver Phone", "Driver Email", "Driver Address", "Driver DOB", "Driver License", "Driver License Exp"],
      "fieldNames": ["driverID", "driverName", "driverPhone", "driverEmail", "driverAddress", "driverDOB", "driverLicense", "driverLicenseExp"],
      "fieldTypes": ["number", "string", "number", "string", "string", "date", "string", "date"]
    },
    {
      "tableName": "vehicle",
      "displayNames": ["Vehicle ID", "Vehicle Name", "Vehicle Type", "Vehicle Make", "Vehicle Model", "Vehicle Year", "Vehicle Color", "Vehicle License", "Vehicle License Exp"],
      "fieldNames": ["vehicleID", "vehicleName", "vehicleType", "vehicleMake", "vehicleModel", "vehicleYear", "vehicleColor", "vehicleLicense", "vehicleLicenseExp"],
      "fieldTypes": ["number", "string", "string", "string", "string", "number", "string", "string", "date"]
    },
    {
      "tableName": "customer",
      "displayNames": ["Customer ID", "Customer Name", "Customer Phone", "Customer Email", "Customer Address", "Customer DOB"],
      "fieldNames": ["customerID", "customerName", "customerPhone", "customerEmail", "customerAddress", "customerDOB"],
      "fieldTypes": ["number", "string", "number", "string", "string", "date"]
    },
    {
      "tableName": "order",
      "displayNames": ["Order ID", "Order Date", "Order Time", "Order Status", "Order Type", "Order Address", "Order Customer ID", "Order Driver ID", "Order Vehicle ID"],
      "fieldNames": ["orderID", "orderDate", "orderTime", "orderStatus", "orderType", "orderAddress", "orderCustomerID", "orderDriverID", "orderVehicleID"],
      "fieldTypes": ["number", "date", "time", "string", "string", "string", "number", "number", "number"]
    },
    {
      "tableName": "payment",
      "displayNames": ["Payment ID", "Payment Date", "Payment Time", "Payment Type", "Payment Amount", "Payment Status", "Payment Order ID"],
      "fieldNames": ["paymentID", "paymentDate", "paymentTime", "paymentType", "paymentAmount", "paymentStatus", "paymentOrderID"],
      "fieldTypes": ["number", "date", "time", "string", "number", "string", "number"]
    }
  ]

  const items = map(dataBaseSelecter, (dataBase) => ({
    key: dataBase.tableName,
    label: dataBase.tableName,
  }));

  const dataTypeRecognizer = (value) => {
    if (typeof value === 'number') {
      return 'number';
    } else if (typeof value === 'string') {
      return 'string';
    } else if (typeof value === 'boolean') {
      return 'boolean';
    } else if (typeof value === 'object') {
      return 'object';
    } else if (typeof value === 'undefined') {
      return 'undefined';
    } else if (typeof value === 'function') {
      return 'function';
    } else if (typeof value === 'date') {
      return 'date';
    } else if (typeof value === 'time') {
      return 'time';
    } else if (typeof value === 'array') {
      return 'array';
    } else if (typeof value === 'null') {
      return 'null';
    } else {
      return 'unknown';
    }
  };

  const handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const status = checkFileTypes(file);
    if (file && status) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;

        const fileInformation = {
          name: file.name,
          sizeMB: file.size / 1024 / 1024,
          type: file.type,
          lastModified: file.lastModified,
        };

        setFileDetails(fileInformation);

        if (file.name.endsWith('.json')) {
          const jsonData = JSON.parse(content);
          setFileFormat('json');
          setFileData(jsonData);
        } else if (file.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const headers = excelData[0];
          setHeaders(headers);
          setFileFormat('xlsx');
          setFileData(excelData);
        } else if (file.name.endsWith('.csv')) {
          setFileFormat('csv');
          const csvHeader = content.split('\n')[0];
          setHeaders(csvHeader.split(','));
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (result) => {
              setFileData(result.data);
            },
          });
        } else if (file.name.endsWith('.xls')) {
          setFileFormat('xls');
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const headers = excelData[0];
          setHeaders(headers);
          setFileData(excelData);
        }
      };
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  const checkFileTypes = (file) => {
    if (file.name.endsWith('.json') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv') || file.name.endsWith('.xls')) {
      setIsUploadModalVisible(false);
      return true;
    } else {
      message.error('Invalid File Type Uploaded, Please Upload a Valid File Type');
      return false;
    }
  };

  const columns = headers
    ? headers.map((header) => ({
        title: header,
        dataIndex: header,
        key: header,
      }))
    : [];

  function arrayToObjects(dataArray) {
    const keys = dataArray[0];
    const resultArray = dataArray.slice(1).map((data) => {
      const obj = {};
      keys.forEach((key, index) => {
        obj[key] = data[index];
      });
      return obj;
    });
    return resultArray;
  }

  const handleMappingChange = (displayName, selectedHeader) => {
    setSelectedMappings({
      ...selectedMappings,
      [displayName]: selectedHeader,
    });
  };


  return (
    <div>
      {isUploadModalVisible && (
        <Dropzone
          onDrop={handleFileUpload}
          accept=".json, .xlsx, .csv, .xls, .txt"
          style={{
            width: '100%',
            height: '100px',
            borderWidth: '2px',
            borderColor: 'rgb(102, 102, 102)',
            borderStyle: 'dashed',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '28px',
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} style={dropzoneStyle}>
              <input {...getInputProps()} />
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: '46px', color: '#2D5FF4' }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: '14px', textDecoration: 'capitalize' }}>
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint" style={{ fontSize: '16px', textDecoration: 'capitalize' }}>
                Strictly prohibited from uploading company data or other banned files.
              </p>
            </div>
          )}
        </Dropzone>
      )}

      {headers && fileDetails && (
        <div style={{ background: '#ffffff', padding: '30px', borderRadius: '10px' }}>
          <Descriptions title="File Details Walkthrough" bordered>
            <Descriptions label="File Name">{fileDetails.name}</Descriptions>
            <Descriptions label="File Size">{fileDetails.sizeMB} MB</Descriptions>
            <Descriptions label="File Type">{fileDetails.type}</Descriptions>
            <Descriptions label="Last Modified">{fileDetails.lastModified}</Descriptions>
          </Descriptions>
        </div>
      )}

      {fileDetails && headers && (
        <div>
          <h3>File Data</h3>
          <Table dataSource={fileFormat === 'xlsx' || fileFormat === 'xls' ? arrayToObjects(fileData) : fileData} columns={columns} />
        </div>
      )}

      {fileDetails && headers && (
        <div>
          <Dropdown
            menu={{
              items,
              selectable: true,
              defaultSelectedKeys: ['3'],
              onSelect: ({ key }) => {
                setTableName(key);
              },
            }}
          >
            <Typography.Link>
              <Space>
                Choose A Table <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </div>
      )}

      {tableName && (
        <div>
          <h3>Table Name:</h3>
          <pre>{JSON.stringify(tableName, null, 2)}</pre>
          <Row>
            <Col span={8}>
            <form>
            {dataBaseSelecter.map((dataBase) => (
              <div key={dataBase.tableName}>
                {dataBase.tableName === tableName && (
                  <div>
                    {dataBase.displayNames.map((displayName) => (
                      <div key={displayName}>
                        <label htmlFor={displayName}>{displayName}</label>
                        <select
                          id={displayName}
                          name={displayName}
                          onChange={(e) => handleMappingChange(displayName, e.target.value)}
                        >
                          {headers.map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </form>
            </Col>
            <Col span={8}>
            <h3>DataType Preview</h3>
            {
              dataBaseSelecter.map((dataBase) => (
                dataBase.tableName === tableName && (
                  <div>
                    <Descriptions title="Data Types">
                      {dataBase.displayNames.map((displayName, index) => (
                        <Descriptions label={displayName}>{dataBase.fieldTypes[index]}</Descriptions>
                      ))}
                    </Descriptions>
                    <ul>
                      {dataBase.displayNames.map((displayName, index) => (
                        <li>
                          {displayName} : {dataBase.fieldTypes[index]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))
            }
            </Col>
            <Col span={8}>
            <h3>Real-Time Mapping:</h3>
            <JSONPretty id="json-pretty" data={JSON.stringify(selectedMappings)} theme={JSONPrettyMon} style={{
            borderRadius: '10px',
          }}></JSONPretty>
            </Col>
          </Row>
        </div>
      )}

      {tableName && (
        <div>
          <h3>Real-Time Mapping:</h3>
          <pre>{JSON.stringify(selectedMappings, null, 2)}</pre>
          <JSONPretty id="json-pretty" data={JSON.stringify(selectedMappings)}  style={{
            borderRadius: '10px',
          }}></JSONPretty>
        </div>
      )}

      { tableName && console.log(fileData)}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default FileUploader;
