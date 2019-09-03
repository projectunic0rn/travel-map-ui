import React from "react";

const ProfileContext = React.createContext({});

export const ProfileProvider = ProfileContext.Provider;
export const ProfileConsumer = ProfileContext.Consumer;
