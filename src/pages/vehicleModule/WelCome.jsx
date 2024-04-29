import React from 'react';
import './WelCome.css'; 
import { Form, Input, Button, Select, Modal, Table, Space, Descriptions, Tag, Row, Col, DatePicker, Drawer, message, Breadcrumb } from 'antd';
import './style.css';
import LogoSection from '../../components/Logo/index';

const WelCome = () => {
    return (
        <div className="bgimg w3-display-container w3-animate-opacity w3-text-white">
            {/* <div className="w3-display-topleft w3-padding-large w3-xlarge">
                Logo
            </div> */}
            <LogoSection />
            <div className="w3-display-middle">
                <h1 className="w3-jumbo w3-animate-top">Thaproban</h1>
                <hr className="w3-border-grey" style={{margin:"auto", width:"40%"}} />
                <p className="w3-large w3-center">Traditional To Digital Brew</p>
                <Row>
                    <Col span={12}>
                        <Button 
                        style={{marginRight: "10px", width: "150px", height: "40px"}}
                        type="primary" size="large" href="/free/login">
                            <span className='textStyle-small'>Admin Login</span>
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button 
                        style={{marginRight: "10px", width: "150px", height: "40px"}}
                        type="primary" size="large" href="/free/login/customer">
                            <span className='textStyle-small'>Customer Login</span>
                        </Button>
                    </Col>
                </Row>
            </div>
            <div className="w3-display-bottomleft w3-padding-large">
                Powered by <a href="https://github.com/Deshan555" target="_blank" rel="noopener noreferrer">Taprobana Dev</a>
            </div>
        </div>
    )
}

export default WelCome;