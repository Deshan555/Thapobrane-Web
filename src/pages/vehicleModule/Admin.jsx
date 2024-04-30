import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticationCheck } from '../vehicleModule/AuthChecker';
import { apiExecutions } from '../../api/api-call';
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, message, Row, Col, Breadcrumb, Avatar, Card, Badge, Divider, Tabs, Steps, Switch } from 'antd';
import {
    MailOutlined,
    DeleteOutlined,
    PhoneOutlined,
    PlusOutlined,
    EditOutlined,
    SearchOutlined,
    CloseCircleOutlined,
    ShoppingCartOutlined,
    EyeOutlined,
    HomeOutlined, EllipsisOutlined, SettingOutlined
} from '@ant-design/icons';
import { CSVLink, CSVDownload } from "react-csv";
import './style.css';
import dayjs from 'dayjs';
import { max } from 'lodash';
import { DatePicker } from '../../../node_modules/antd/es/index';
const { Meta } = Card;


const Admin = () => {
    const [isExpert, setIsExpert] = useState(false);
    const saturationHumidity = 30; // Saturation humidity in grams per cubic meter
    const [values, setValues] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [showSummery, setShowSummery] = useState(false);


    const calculateMedianRelativeHumidity = (humidityArray) => {
        humidityArray.sort((a, b) => a - b);
        const mid = Math.floor(humidityArray.length / 2);
        if (humidityArray.length % 2 === 0) {
            return calculateRelativeHumidity((humidityArray[mid - 1] + humidityArray[mid]) / 2, humidityArray[mid]);
        } else {
            return calculateRelativeHumidity(humidityArray[mid], humidityArray[mid]);
        }
    }

    const calculateRelativeHumidity = (actualHumidity, saturationHumidity) => {
        return (actualHumidity / saturationHumidity) * 100;
    }


    const letsPredict = (values) => {
        console.log(values);

        const year = values?.year;
        const area = values?.season;
        const rainfall = parseInt(values?.rainfall) || 0;
        const temperature = parseInt(values?.temperature) || 0;
        const humidity = parseInt(values?.humidity) || 0;
        const rainfall_2 = parseInt(values?.rainfall_2) || 0;
        const temperature_2 = parseInt(values?.temperature_2) || 0;
        const humidity_2 = parseInt(values?.humidity_2) || 0;
        const rainfall_3 = parseInt(values?.rainfall_3) || 0;
        const temperature_3 = parseInt(values?.temperature_3) || 0;
        const humidity_3 = parseInt(values?.humidity_3) || 0;
        const rainfall_4 = parseInt(values?.rainfall_4) || 0;
        const temperature_4 = parseInt(values?.temperature_4) || 0;
        const humidity_4 = parseInt(values?.humidity_4) || 0;


        const presentsJson = {
            year : year,
            area : area,
            rainfall : rainfall,
            temperature : temperature,
            humidity : humidity,
            rainfall_2 : rainfall_2,
            temperature_2 : temperature_2,
            humidity_2 : humidity_2,
            rainfall_3 : rainfall_3,
            temperature_3 : temperature_3,
            humidity_3 : humidity_3,
            rainfall_4 : rainfall_4,
            temperature_4 : temperature_4,
            humidity_4 : humidity_4
        }
        localStorage.setItem('presentsJson', JSON.stringify(presentsJson));

        const humidityArray = [humidity, humidity_2, humidity_3, humidity_4];
        const medianRelativeHumidity = calculateMedianRelativeHumidity(humidityArray);

        const avgHumidity = (humidity + humidity_2 + humidity_3 + humidity_4) / 4;
        const totalRainFall = rainfall + rainfall_2 + rainfall_3 + rainfall_4;
        const totalTemperature = (temperature + temperature_2 + temperature_3 + temperature_4) / 4;

        const requestJson = {
            "year": year,
            "season": 1,
            "rainfall": totalRainFall,
            "temperature": totalTemperature,
            "humidity": avgHumidity,
            "area": area,
            "sunshine": 0
        }

        setValues(values);
        makePredictions(requestJson);

    }

    const makePredictions = async (requestJson) => {
        const result = await apiExecutions.getWeatherPrediction(requestJson);
        if (result !== null) {
            setPrediction(result?.prediction[0]);
            setShowSummery(true);
        } else {
            message.error('Error Occured, While Predicting');
        }
    }

    return (
        <>

            <h1 className="headingStyle2">PrognosticX</h1>
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
                                <span>Dasboard</span>
                            </>
                        ),
                    },
                    {
                        href: '',
                        title: 'PrognosticX',
                    },
                ]}
            />

            <h1 className='textStyle-small' style={{ fontSize: '20px' }}>
                Hey, <span style={{ color: 'gray' }}>WelCome To PrognosticX
                </span>
            </h1>
            <span className='textStyle-small'>
                Introducing PrognosticX! Whether you're a seasoned tea farmer or just starting out, this app is your go-to tool for optimizing your cultivation process. By analyzing temperature, rainfall, and humidity, we provide personalized predictions, ensuring your tea crops thrive. Say goodbye to guesswork and hello to successful harvests!
            </span>


            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', marginTop: '20px' }}>
                {
                    showSummery === false ? (
                        <Form
                            layout="vertical"
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={letsPredict}
                        //onFinishFailed={() => {}}

                        >
                            {/* <Row>
                            <Switch checkedChildren="Expert" unCheckedChildren="Basic" onChange={(e) => setIsExpert(e)} />
                        </Row> */}
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>Year (Tag)</span>}
                                        style={{ width: '80%' }}
                                        name="year">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        style={{ width: '80%' }}
                                        label={<span className='textStyle-small'>Field Size</span>}
                                        name="season"
                                        rules={[{ required: true, message: 'Please select the field size!' }]}
                                        >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <span className='textStyle-small' style={{fontSize: '14px', fontWeight: 'bold'}}>
                            Southwest Monsoon (May to September)
                            </span>
                            <Divider />
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>RainFall Avarage (mm)</span>}
                                        style={{ width: '80%' }}
                                        name="rainfall">
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>Temperature (°C)</span>}
                                        style={{ width: '80%' }}
                                        name="temperature">
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>Humidity (%)</span>}
                                        style={{ width: '80%' }}
                                        name="humidity"
                                        rules={[{ required: true, message: 'Please input the humidity!' },
                                    { max: 100, message: 'Humidity should be less than 100!' }
                                    ]}
                                        >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <span className='textStyle-small' style={{fontSize: '14px', fontWeight: 'bold'}}>
                                Northeast Monsoon (October to February)
                            </span>
                            <Divider />
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>RainFall Avarage (mm)</span>}
                                        style={{ width: '80%' }}
                                        name="rainfall_2">
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>Temperature (°C)</span>}
                                        style={{ width: '80%' }}
                                        name="temperature_2">
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>Humidity (%)</span>}
                                        style={{ width: '80%' }}
                                        name="humidity_2"
                                        rules={[{ required: true, message: 'Please input the humidity!' },
                                        { max: 100, message: 'Humidity should be less than 100!' }
                                        ]}
                                        >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <span className='textStyle-small' style={{fontSize: '14px', fontWeight: 'bold'}}>
                                InterMonsoonal Periods (March-April and September-October)
                            </span>
                            <Divider />
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>RainFall Avarage (mm)</span>}
                                        style={{ width: '80%' }}
                                        name="rainfall_3">
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>Temperature (°C)</span>}
                                        style={{ width: '80%' }}
                                        name="temperature_3">
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>Humidity (%)</span>}
                                        style={{ width: '80%' }}
                                        name="humidity_3"
                                        rules={[{ required: true, message: 'Please input the humidity!' },
                                        { max: 100, message: 'Humidity should be less than 100!' }
                                        ]}
                                        >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <span className='textStyle-small' style={{fontSize: '14px', fontWeight: 'bold'}}>
                                Dry Season (January to April)
                            </span>
                            <Divider />
                            
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>RainFall Avarage (mm)</span>}
                                        style={{ width: '80%' }}
                                        name="rainfall_4">
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>Temperature (°C)</span>}
                                        style={{ width: '80%' }}
                                        name="temperature_4">
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className='textStyle-small'>Humidity (%)</span>}
                                        style={{ width: '80%' }}
                                        name="humidity_4"
                                        rules={[{ required: true, message: 'Please input the humidity!' },
                                        { max: 100, message: 'Humidity should be less than 100!' }
                                        ]}
                                        >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{ width: '50%' }}
                                    > <span className='textStyle-small'>Predict Output</span>
                                    </Button>
                                </Col>
                            </Row>

                        </Form>
                    ) : null
                }
                {
                    showSummery ? (
                        <>
                        <Descriptions
                            title={<span className='textStyle-small'>Prediction Summery</span>}
                            bordered
                            column={1}
                            style={{ marginTop: '20px' }}
                        >
                            <Descriptions.Item label={<span className='textStyle-small'>Prediction Year Target</span>} span={1}>
                                <span className='textStyle-small'>{values?.year}</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Area (Hec)</span>} span={1}>
                                <span className='textStyle-small'>{values?.season}</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Rainfall (Southwest Monsoon (May to September))</span>} span={1}>
                                <span className='textStyle-small'>{values?.rainfall} (mm)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Temperature (Southwest Monsoon (May to September))</span>} span={1}>
                                <span className='textStyle-small'>{values?.temperature} (°C)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Humidit (Southwest Monsoon (May to September))</span>} span={1}>
                                <span className='textStyle-small'>{values?.humidity} (%)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Rainfall (Northeast Monsoon (October to February))</span>} span={1}>
                                <span className='textStyle-small'>{values?.rainfall_2} (mm)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Temperature (Northeast Monsoon (October to February))</span>} span={1}>
                                <span className='textStyle-small'>{values?.temperature_2} (°C)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Humidity (Northeast Monsoon (October to February))</span>} span={1}>
                                <span className='textStyle-small'>{values?.humidity_2} (%)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Rainfall (Intermonsoonal Periods (March-April and September-October))</span>} span={1}>
                                <span className='textStyle-small'>{values?.rainfall_3} (mm)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Temperature (Intermonsoonal Periods (March-April and September-October))</span>} span={1}>
                                <span className='textStyle-small'>{values?.temperature_3} (°C)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Humidity (Intermonsoonal Periods (March-April and September-October))</span>} span={1}>
                                <span className='textStyle-small'>{values?.humidity_3} (%)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Rainfall (Dry Season (January to April))</span>} span={1}>
                                <span className='textStyle-small'>{values?.rainfall_4} (mm)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Temperature (Dry Season (January to April))</span>} span={1}>
                                <span className='textStyle-small'>{values?.temperature_4} (°C)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Humidity (Dry Season (January to April))</span>} span={1}>
                                <span className='textStyle-small'>{values?.humidity_4} (%)</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className='textStyle-small'>Final Prediction</span>} span={1}>
                                <span className='textStyle-small' style={{color: 'red', fontWeight: 'bold'}}>
                                    {prediction} (Kg)
                                </span>
                            </Descriptions.Item>
                        </Descriptions>

                        <Button
                            type="primary"
                            danger
                            style={{ marginTop: '20px' }}
                            onClick={() => [
                                setShowSummery(false),
                                setValues([]),
                                setPrediction(null)
                            ]}
                        >
                            <span className='textStyle-small'>Back</span>
                        </Button>

                        </>
                    ) : null
                }
            </div>
        </>
    )
}

export default Admin;