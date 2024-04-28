# Tea Products Digitalize System  ☕️🌱📊

![Tea Plantation](https://github.com/Deshan555/HeidiQL/blob/master/system-outline.png)


### Problem Statement
In Sri Lanka, the process of harvesting tea leaves involves manual documentation in physical books known as "tea books." However, the reliance on these books poses several challenges. In the event of calamities, theft, or other mishaps, the loss of these books leads to critical data loss. Moreover, analyzing the data recorded in these books is cumbersome and inefficient.

### Solution
Introducing a comprehensive digital solution to address the challenges faced by tea plantation owners. This solution comprises a web and mobile application system designed to streamline the management and analysis of harvested tea leaves.

### Key Components
1. **Digital Profile**: Store and manage data regarding harvested tea leaves.
2. **Web and Mobile Applications**:
    - Web Application: Consists of separate portals for administrators and users.
    - Mobile Application: Specifically designed for tea plantation owners.
    - Seamless Integration: These applications work in conjunction with each other, ensuring smooth data flow and accessibility.

### Goals and Objectives
**Goals:**
- Centralize data related to harvested tea leaves.
- Facilitate efficient analysis of tea leaf data.

**Objectives:**
- Improve the quality and quantity of tea harvest.
- Ensure the integrity and security of harvested tea leaf data.
- Empower tea plantation owners with comprehensive insights into their harvest data.

### Features
- **Dashboards**: Visualize data for better insights.
- **Field Inspections**: Track daily activities including collection, fertilization, and basic information.
- **Route and Vehicle Management**: Optimize transportation logistics.
- **Customer and Zone Management**: Organize client relationships and geographical regions.
- **Fertilizer Orders and Management**: Streamline fertilizer procurement and usage.
- **Factory and Employee Management**: Efficiently manage production facilities and workforce.
- **Region-wise Data Analysis**: Utilize weather data for predictive analysis.
- **Data Export/Import**: Facilitate data transfer and backup.
- **Predictive Analytics**: Forecast tea yield based on various environmental factors.
- **Profile Management**: Customize user profiles and access permissions.

### Technology Stack
- **Frontend**: Developed using React, Axios, Material-UI (MUI), Ant Design.
- **Backend**: Powered by Node.js.
- **Mapping Integration**: Google Maps JavaScript API.

### Setup Guide
1. **Clone Repository**: Begin by cloning the Tea Leaf Management System repository from [GitHub URL].
2. **Install Dependencies**: Navigate to the project directory and run `npm install` to install the necessary dependencies for both frontend and backend.
3. **Environment Variables**: Create a `.env` file in the root directory and define environment variables such as database connection details, API keys, etc.
   - Example `.env`:
     ```
     REACT_APP_API_URL=http://localhost:5000
     DB_HOST=localhost
     DB_USER=username
     DB_PASSWORD=password
     ```
4. **Database Setup**: Set up your preferred database (MySQL, PostgreSQL, MongoDB, etc.) and configure the connection in the backend.
5. **Start Backend Server**: Run `npm start` in the backend directory to start the Node.js server.
6. **Start Frontend Development Server**: Run `npm start` in the frontend directory to start the React development server.
7. **Access Application**: Access the application through the provided URL (default: `http://localhost:3000`) in your web browser.

---



**Author**: [Your Name/Organization]

**Version**: [Version Number]

**Date**: [Date]

**License**: [License Information]
