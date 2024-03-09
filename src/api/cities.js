const cities = {
    "SriLanka": {
        "WesternProvince": {
            "Colombo": ["Colombo", "Dehiwala", "Mount Lavinia"],
            "Gampaha": ["Gampaha", "Negombo", "Kelaniya"]
        },
        "CentralProvince": {
            "Kandy": ["Kandy", "Peradeniya", "Gampola"],
            "Matale": ["Matale", "Dambulla", "Sigiriya"]
        },
        "SouthernProvince": {
            "Galle": ["Galle", "Unawatuna", "Hikkaduwa"],
            "Matara": ["Matara", "Mirissa", "Weligama"]
        },
        "NorthernProvince": {
            "Jaffna": ["Jaffna", "Point Pedro", "Kilinochchi"],
            "Vavuniya": ["Vavuniya", "Mannar", "Mullaitivu"]
        },
        "EasternProvince": {
            "Trincomalee": ["Trincomalee", "Batticaloa", "Ampara"]
        },
        "NorthWesternProvince": {
            "Kurunegala": ["Kurunegala", "Puttalam", "Chilaw"]
        },
        "NorthCentralProvince": {
            "Anuradhapura": ["Anuradhapura", "Polonnaruwa"]
        },
        "UvaProvince": {
            "Badulla": ["Badulla", "Bandarawela", "Ella"],
            "Monaragala": ["Monaragala", "Wellawaya"]
        },
        "SabaragamuwaProvince": {
            "Ratnapura": ["Ratnapura", "Eheliyagoda", "Balangoda"]
        }
    }
}

const allCities = Object.values(cities.SriLanka).reduce((acc, province) => {
    Object.values(province).forEach(cityArray => {
        acc.push(...cityArray);
    });
    return acc;
}, []);

export { allCities };
