import axios from 'axios';
import { baseDetails } from './api-config';
import { LocalStroage } from './localstorage';
import { random } from 'lodash';

const apiExecutions = {
    // authEmployee: async (username, password) => {
    //     /*
    //     {
    //         "success": true,
    //         "message": "Employee authenticated successfully",
    //         "traceId": "7fe844ee-3198-46db-a349-f70e3682b7a3",
    //         "responseTime": "2024-02-09T16:40:36.958Z",
    //         "data": {
    //             "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InNpZ25EYXRhIjp7InVzZXJFbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGU1LmNvbSIsInVzZXJOYW1lIjoiSm9obiBEb2UiLCJ1c2VySWQiOjQzMDE2Mjg3MCwidXNlclR5cGUiOiJBRE1JTiIsImxvZ2luVGltZSI6IjIwMjQtMDItMDlUMTY6NDA6MzYuMDE5WiJ9fSwiaWF0IjoxNzA3NDk2ODM2LCJleHAiOjE3MDc3NTYwMzZ9.8D1qNdahDROd8RXl0LXcK8aZWSjOOJimWczuceU5JsI",
    //             "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InNpZ25EYXRhIjp7InVzZXJFbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGU1LmNvbSIsInVzZXJOYW1lIjoiSm9obiBEb2UiLCJ1c2VySWQiOjQzMDE2Mjg3MCwidXNlclR5cGUiOiJBRE1JTiIsImxvZ2luVGltZSI6IjIwMjQtMDItMDlUMTY6NDA6MzYuMDE5WiJ9fSwiaWF0IjoxNzA3NDk2ODM2LCJleHAiOjE3MDgxMDE2MzZ9.rtqnaGB3safg0ZJsalQN-H4QSf6cKC2SNuW6jvQiVI8"
    //         }
    //     }*/
    //     try {
    //         const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/auth/employee', {
    //             email: username,
    //             password: password
    //         });
    //         console.log(response);
    //         // if response success then store the token in localStorage
    //         if (response?.data?.success) {
    //             console.log('Access Token:', response.data.accessToken);
    //             console.log('Refresh Token:', response.data.refreshToken);

    //             //localStorage.setItem('atoken', response.data.accessToken);
    //             //localStorage.setItem('rtoken', response.data.refreshToken);
    //         }
    //         //return response.data;
    //     } catch (error) {
    //         console.error('Axios error:', error);
    //         if (error.response) {
    //             console.error('Server responded with:', error.response.data);
    //         } else if (error.request) {
    //             console.error('No response received:', error.request);
    //         } else {
    //             console.error('Error setting up the request:', error.message);
    //         }
    //         return null;
    //     }
    // },
    authEmployee: async (username, password) => {
        /*
        {
            "success": true,
            "message": "Employee authenticated successfully",
            "traceId": "7fe844ee-3198-46db-a349-f70e3682b7a3",
            "responseTime": "2024-02-09T16:40:36.958Z",
            "data": {
                "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InNpZ25EYXRhIjp7InVzZXJFbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGU1LmNvbSIsInVzZXJOYW1lIjoiSm9obiBEb2UiLCJ1c2VySWQiOjQzMDE2Mjg3MCwidXNlclR5cGUiOiJBRE1JTiIsImxvZ2luVGltZSI6IjIwMjQtMDItMDlUMTY6NDA6MzYuMDE5WiJ9fSwiaWF0IjoxNzA3NDk2ODM2LCJleHAiOjE3MDc3NTYwMzZ9.8D1qNdahDROd8RXl0LXcK8aZWSjOOJimWczuceU5JsI",
                "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InNpZ25EYXRhIjp7InVzZXJFbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGU1LmNvbSIsInVzZXJOYW1lIjoiSm9obiBEb2UiLCJ1c2VySWQiOjQzMDE2Mjg3MCwidXNlclR5cGUiOiJBRE1JTiIsImxvZ2luVGltZSI6IjIwMjQtMDItMDlUMTY6NDA6MzYuMDE5WiJ9fSwiaWF0IjoxNzA3NDk2ODM2LCJleHAiOjE3MDgxMDE2MzZ9.rtqnaGB3safg0ZJsalQN-H4QSf6cKC2SNuW6jvQiVI8"
            }
        }*/
        try {
            const response = await fetch(baseDetails.CORE_SERVICE_URL + '/auth/employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    password: password,
                }),
            });
    
            // Parse the response JSON
            const responseData = await response.json();
    
            console.log('API Response:', responseData);
    
            // if response success then store the token in localStorage
            if (responseData?.success) {
                console.log('Access Token:', responseData.data.accessToken);
                console.log('Refresh Token:', responseData.data.refreshToken);

                localStorage.setItem('atoken', responseData.data.accessToken);
                localStorage.setItem('rtoken', responseData.data.refreshToken);
                localStorage.setItem('loginTime', new Date().getTime());
                localStorage.setItem('atokenExpireDate', responseData.data.accessTokenExpireDate);
                localStorage.setItem('rtokenExpireDate', responseData.data.refreshTokenExpireDate);
                localStorage.setItem('userRole', responseData.data.userRole);
                localStorage.setItem('isAuthenticated', true);
            }
    
            //return responseData;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    },
    
    
    getAllEmployeeRoles: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roles', {
                // headers: {
                //     Authorization: `Bearer ${LocalStroage.getItem('token')}`
                // }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    registerNewEmployee: async (employeeDetails) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/employees/add', {
                EmployeeName: employeeDetails.name,
                EmployeeMobile: employeeDetails.mobile,
                EmployeeEmail: employeeDetails.email,
                EmployeeType: employeeDetails.type,
                FactoryID: employeeDetails.factory,
                Password: employeeDetails.password
            });
            return response;
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // router.put('/employees/update/:EmployeeID', EmployeeController.updateEmployee);
    updateEmployee: async (employeeID, employeeDetails) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/employees/update/' + employeeID, {
                // headers: {
                //     Authorization: `Bearer ${LocalStroage.getItem('token')}`
                // },
                EmployeeName: employeeDetails.name,
                EmployeeMobile: employeeDetails.mobile,
                EmployeeEmail: employeeDetails.email,
                EmployeeType: employeeDetails.type,
                FactoryID: employeeDetails.factory,
            });
            return response;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            } return null;
        }
    },
    getAllEmployees: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/employees', {
                // headers: {
                //     Authorization: `Bearer ${LocalStroage.getItem('token')}`
                // }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // delete 
    deleteEmployee: async (employeeID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/employees/drop/' + employeeID, {
                // headers: {
                //     Authorization: `Bearer ${LocalStroage.getItem('token')}`
                // }
            });
            return response;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            }
            return null;
        }
    },
    getAllCustomers: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/customers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllFieldInfo: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/fieldInfo', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    registerNewField: async (values) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/fieldInfo/add', {
                fieldSize: values.FieldSize,
                fieldType: values.FieldType,
                fieldAddress: values.FieldAddress,
                teaType: values.TeaType,
                baseLocation: values.BaseLocation,
                baseElevation: values.BaseElevation,
                soilType: values.SoilType,
                latitude: values.Attitude,
                longitude: values.Longitude,
                routeID: values.RouteID,
                ownerID: values.OwnerID,
                zoneID: values.ZoneID,
                factoryID: values.FactoryID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllEnvironmentZoneInfo: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/environmentalists', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllFactories : async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/factories', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllRoadRoutings : async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roadRouting', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },

    updateFieldInfo: async (fieldID, values) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/fieldInfo/update/' + fieldID, {
                fieldSize: values.FieldSize,
                fieldType: values.FieldType,
                fieldAddress: values.FieldAddress,
                teaType: values.TeaType,
                baseLocation: values.BaseLocation,
                baseElevation: values.BaseElevation,
                soilType: values.SoilType,
                attitude: values.Attitude,
                longitude: values.Longitude,
                routeID: values.RouteID,
                ownerID: values.OwnerID,
                zoneID: values.ZoneID,
                factoryID: values.FactoryID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    
    deleteFieldInfo: async (fieldID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/fieldInfo/drop/' + fieldID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllRoadRoutings: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roadRouting', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    addNewRoadRouting: async (values) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/roadRouting/add', {
                SourceFactoryID: values.SourceFactoryID,
                Destination: values.Destination,
                RoundTrip: values.RoundTrip,
                StartLongitude: values.StartLongitude,
                StartLatitude: values.StartLatitude,
                EndLongitude: values.EndLongitude,
                EndLatitude: values.EndLatitude
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /roadRouting/update/:RoadRoutingID
    updateRoadRouting: async (roadRoutingID, values) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/roadRouting/update/' + roadRoutingID, {
                SourceFactoryID: values.SourceFactoryID,
                Destination: values.Destination,
                RoundTrip: values.RoundTrip,
                StartLongitude: values.StartLongitude,
                StartLatitude: values.StartLatitude,
                EndLongitude: values.EndLongitude,
                EndLatitude: values.EndLatitude
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    deleteRoutes : async (routeID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/roadRouting/drop/' + routeID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getRoadRoutingDetailsByID: async (routeID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roadRouting/' + routeID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getAllCoordinates: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/location', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // customerName: values?.customerName,
    // customerMobile: values?.customerMobile,
    // customerAddress: values?.customerAddress,
    // customerEmail: values?.customerEmail,
    // customerType: 'ROLE.CUSTOMER',
    // customerPassword: randomPassword(),
    // factoryID: values?.factoryID,
    // customerNIC: values?.customerNIC
    registerCustomer: async (data) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/customers/add', {
                customerName: data.customerName,
                customerMobile: data.customerMobile,
                customerAddress: data.customerAddress,
                customerEmail: data.customerEmail,
                customerType: data.customerType,
                customerPassword: data.customerPassword,
                factoryID: data.factoryID,
                customerNIC: data.customerNIC
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    getCustomerByCustomerID: async (customerID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/customers/getById/' + customerID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    updateCustomerDetailsById: async (customerID, data) => {
        console.log(data);
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/customers/update/' + customerID, {
                CustomerName: data.customerName,
                CustomerMobile: data.customerMobile,
                CustomerAddress: data.customerAddress,
                CustomerEmail: data.customerEmail,
                CustomerType: data.customerType,
                FactoryID: data.factoryID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            }); return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    deleteCustomerAccount: async (customerID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/customers/drop/' + customerID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            }); return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // vehicles
    getAllVehicles: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/vehicles', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
//     router.post('/vehicles/add', VehicleController.addVehicleMappings);
// router.get('/vehicles/:VehicleID', VehicleController.getAllVehicleMappingsByID);
// router.put('/vehicles/update/:VehicleID', VehicleController.updateVehicleMappings);
// router.delete('/vehicles/drop/:VehicleID', VehicleController.deleteVehicleMappings);
    addVehicle: async (data) => {
        console.log(data);
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/vehicles/add', {
                // VehicleNumber: values.VehicleNumber,
                // VehicleType: values.VehicleType,
                // VolumeCapacity: values.VolumeCapacity,
                // WeightCapacity: values.WeightCapacity,
                // NumberPlateID: values.NumberPlateID,
                // FactoryID: values.FactoryID,
                // DriverID: values.DriverID,
                // RouteID: values.RouteID
                VehicleNumber: data.VehicleNumber,
                VehicleType: data.VehicleType,
                VolumeCapacity: data.VolumeCapacity,
                WeightCapacity: data.WeightCapacity,
                NumberPlateID: data.NumberPlateID,
                FactoryID: data.FactoryID,
                DriverID: data.DriverID,
                RouteID: data.RouteID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    }
    ,
    getVehicleDetailsByID: async (vehicleID) => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/vehicles/' + vehicleID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    updateVehicleDetailsByID: async (vehicleID, data) => {
        try {
            const response = await axios.put(baseDetails.CORE_SERVICE_URL + '/vehicles/update/' + vehicleID, {
                VehicleNumber: data.VehicleNumber,
                VehicleType: data.VehicleType,
                VolumeCapacity: data.VolumeCapacity,
                WeightCapacity: data.WeightCapacity,
                NumberPlateID: data.NumberPlateID,
                FactoryID: data.FactoryID,
                DriverID: data.DriverID,
                RouteID: data.RouteID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    deleteVehicleByID: async (vehicleID) => {
        try {
            const response = await axios.delete(baseDetails.CORE_SERVICE_URL + '/vehicles/drop/' + vehicleID, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    ///employees/driversWithNoVehicleMappings
    getAllDriversWithNoVehicleMappings: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/employees/drivers', {
                // headers: {
                //     Authorization: `Bearer ${localStorage.getItem('atoken')}`
                // }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
    // /v01/roadRouting/withoutMappings
    getAllRoadRoutingsWithoutMappings: async () => {
        try {
            const response = await axios.get(baseDetails.CORE_SERVICE_URL + '/roadRouting/withoutMappings', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('atoken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                return error.request.data;
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return null;
        }
    },
};

export { apiExecutions };
