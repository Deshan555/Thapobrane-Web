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
    }
};

export { apiExecutions };
