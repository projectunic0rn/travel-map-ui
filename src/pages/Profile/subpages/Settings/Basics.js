import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { UPDATE_BASIC_INFO } from "../../../../GraphQL";

const genderOptions = [
  "",
  "male",
  "female",
  "transgender female",
  "transgender male"
];

export default function Basics({ userData, handleUserDataChange }) {
  const [edit, handleEdit] = useState(false);
  const [userBasics, handleUserBasicChange] = useState({});

  useEffect(() => {
    let userBasicInfo = {
      full_name: userData.full_name,
      email: userData.email,
      phone_number: userData.phone_number,
      birthday: userData.birthday,
      gender: userData.gender
    };
    handleUserBasicChange(userBasicInfo);
  }, [userData]);

  function handleUserBasicChangeHelper(value, type) {
    let userBasicInfo = userBasics;
    userBasicInfo[type] = value;
    handleUserBasicChange(userBasicInfo);
  }
  function handleEditButton() {
    let editState = edit;
    handleEdit(!editState);
  }
  function handleDataSave() {
    let newUserData = userData;
    newUserData.full_name = userBasics.full_name;
    newUserData.phone_number = userBasics.phone_number;
    newUserData.email = userBasics.email;
    newUserData.gender = userBasics.gender;
    newUserData.birthday = userBasics.birthday;
    handleUserDataChange(newUserData);
  }
  return (
    <div className="settings-basics-container">
      <div className="settings-basics-primary">
        <div className="settings-basics-sub-container">
          <span className="settings-subheader">FULL NAME</span>
          {!edit ? (
            <span
              className="settings-basics-input basics-data"
              id="basics-fullname"
            >
              {userBasics.full_name}
            </span>
          ) : (
            <input
              className="settings-basics-input"
              onChange={(e) =>
                handleUserBasicChangeHelper(e.target.value, "full_name")
              }
              defaultValue={userBasics.full_name}
              id={"basics-fullname"}
            ></input>
          )}
        </div>
      </div>
      <div className="settings-basics-primary">
        <div className="settings-basics-sub-container">
          <span className="settings-subheader">EMAIL</span>
          {!edit ? (
            <span className="settings-basics-input basics-data">
              {userBasics.email}
            </span>
          ) : (
            <input
              className="settings-basics-input"
              onChange={(e) =>
                handleUserBasicChangeHelper(e.target.value, "email")
              }
              defaultValue={userBasics.email}
            ></input>
          )}
        </div>
        <div className="settings-basics-sub-container">
          <span className="settings-subheader">PHONE NUMBER</span>
          {!edit ? (
            <span
              className="settings-basics-input basics-data"
              id="basics-phone"
            >
              {userBasics.phone_number}
            </span>
          ) : (
            <input
              className="settings-basics-input"
              id="basics-phone"
              onChange={(e) =>
                handleUserBasicChangeHelper(e.target.value, "phone_number")
              }
              defaultValue={userBasics.phone_number}
            ></input>
          )}
        </div>
      </div>
      <div className="settings-basics-primary">
        <div className="settings-basics-sub-container">
          <span className="settings-subheader">GENDER</span>
          {!edit ? (
            <span
              className="settings-basics-input basics-data"
              id="gender-select"
            >
              {userBasics.gender}
            </span>
          ) : (
            <select
              className="settings-basics-input"
              id="gender-select"
              defaultValue={userBasics.gender}
              onChange={(e) =>
                handleUserBasicChangeHelper(e.target.value, "gender")
              }
            >
              {genderOptions.map((option) => {
                return (
                  <option value={option} key={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          )}
        </div>
        <div className="settings-basics-sub-container">
          <span className="settings-subheader">BIRTHDAY</span>
          {!edit ? (
            <input
              id="birthday-data"
              className="settings-basics-input"
              type="date"
              defaultValue={userBasics.birthday}
              readOnly
            ></input>
          ) : (
            <input
              id="birthday-input"
              className="settings-basics-input"
              type="date"
              defaultValue={userBasics.birthday}
              onChange={(e) =>
                handleUserBasicChangeHelper(e.target.value, "birthday")
              }
            ></input>
          )}
        </div>
      </div>{" "}
      <div className="settings-edit-button-container">
        <Mutation
          mutation={UPDATE_BASIC_INFO}
          variables={{ userBasics }}
          onCompleted={handleDataSave}
        >
          {(mutation) =>
            edit ? (
              <span className="confirm button" onClick={mutation}>
                Update
              </span>
            ) : (
              <span
                className="confirm button"
                onClick={handleEditButton}
              >
                Edit
              </span>
            )
          }
        </Mutation>
      </div>
    </div>
  );
}

Basics.propTypes = {
  history: PropTypes.object.isRequired,
  userData: PropTypes.object,
  handleUserDataChange: PropTypes.func
};
