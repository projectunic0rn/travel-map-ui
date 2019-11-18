import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";

function ValidationMutation({ children, onInputError, ...rest }) {
  function handleErrors(err) {
    const {
      email,
      password,
      username,
      full_name,
      oldPassword,
      password2,
      phone_number
    } = err.graphQLErrors[0].extensions.exception;

    onInputError({
      username,
      password,
      email,
      full_name,
      oldPassword,
      password2,
      phone_number
    });
  }

  return (
    <Mutation {...rest} onError={(err) => handleErrors(err)}>
      {children}
    </Mutation>
  );
}

ValidationMutation.propTypes = {
  children: PropTypes.func.isRequired,
  onInputError: PropTypes.func.isRequired
};

export default ValidationMutation;
