import React from "react";

export const TripDetailContext = React.createContext({
    tripName: "",
    tripStartDate: "",
    tripEndDate: "",
    tripType: "",
    tripCompany: ""
});