import axios from 'axios';
import { baseDetails } from './api-config';
import { LocalStroage } from './localstorage';

const apiExecutions = {
    authEmployee: async (username, password) => {
        try {
            const response = await axios.post(baseDetails.CORE_SERVICE_URL + '/auth/employee', {
                email: username,
                password: password
            });
            // if response sucess then store the token in localstorage
            if (response?.data?.success) {
                LocalStroage.setItem('token', response.data.token);
            }
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
    }
};

export { apiExecutions };
