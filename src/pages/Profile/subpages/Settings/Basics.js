import React, { useState } from "react";
import PropTypes from "prop-types";

const genderOptions = [
  "",
  "male",
  "female",
  "transgender female",
  "transgender male"
];
const fakeData = {
  firstName: "John",
  lastName: "Doe",
  email: "JohnDoe@aol.com",
  phoneNumber: "123-231-1203",
  gender: "male",
  birthday: "2000-12-25"
};

export default function Basics() {
  const [edit, handleEdit] = useState(false);
  const [currentFirstName, handleFirstNameChange] = useState(
    fakeData.firstName
  );
  const [currentLastName, handleLastNameChange] = useState(fakeData.lastName);
  const [currentEmail, handleEmailChange] = useState(fakeData.email);
  const [currentPhoneNumber, handlePhoneNumberChange] = useState(
    fakeData.phoneNumber
  );
  const [currentGender] = useState(fakeData.gender);
  const [currentBirthday] = useState(fakeData.birthday);
  function handleEditButton() {
    let editState = edit;
    handleEdit(!editState);
  }
  return (
    <div className="settings-basics-container">
      <div className="settings-basics-primary">
        <div className="settings-basics-sub-container">
          <span className="settings-subheader">FIRST NAME</span>
          {!edit ? (
            <span className="settings-basics-input basics-data">
              {currentFirstName}
            </span>
          ) : (
            <input
              className="settings-basics-input"
              onChange={e => handleFirstNameChange(e.target.value)}
              value={currentFirstName}
            ></input>
          )}
        </div>
        <div className="settings-basics-sub-container">
          <span className="settings-subheader">LAST NAME</span>
          {!edit ? (
            <span className="settings-basics-input basics-data">
              {currentLastName}
            </span>
          ) : (
            <input
              className="settings-basics-input"
              onChange={e => handleLastNameChange(e.target.value)}
              value={currentLastName}
            ></input>
          )}
        </div>
      </div>
      <div className="settings-basics-primary">
        <div className="settings-basics-sub-container">
          <span className="settings-subheader">EMAIL</span>
          {!edit ? (
            <span className="settings-basics-input basics-data">
              {currentEmail}
            </span>
          ) : (
            <input
              className="settings-basics-input"
              onChange={e => handleEmailChange(e.target.value)}
              value={currentEmail}
            ></input>
          )}
        </div>
        <div className="settings-basics-sub-container">
          <span className="settings-subheader">PHONE NUMBER</span>
          {!edit ? (
            <span className="settings-basics-input basics-data"  id = "basics-phone">
              {currentPhoneNumber}
            </span>
          ) : (
            <input
              className="settings-basics-input"
              id = "basics-phone"
              onChange={e => handlePhoneNumberChange(e.target.value)}
              value={currentPhoneNumber}
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
              {currentGender}
            </span>
          ) : (
            <select
              className="settings-basics-input"
              id="gender-select"
              defaultValue={currentGender}
            >
              {genderOptions.map(option => {
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
              value={currentBirthday}
              readOnly
            ></input>
          ) : (
            <input
              id="birthday-input"
              className="settings-basics-input"
              type="date"
              defaultValue={currentBirthday}
            ></input>
          )}
        </div>
      </div>{" "}
      <div className="settings-edit-button-container">
        <span className="settings-edit-button" onClick={handleEditButton}>
          {edit ? "Update" : "Edit"}
        </span>
      </div>
    </div>
  );
}

Basics.propTypes = { history: PropTypes.object.isRequired };
