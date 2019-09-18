import React from "react";
import { Mutation } from "react-apollo";

function ValidationMutation({ children, onInputError, ...rest }) {
  function handleErrors(err) {
    const {
      email,
      password,
      username,
      full_name
    } = err.graphQLErrors[0].extensions.exception;
    onInputError({ username, password, email, full_name });
  }

  return (
    <Mutation {...rest} onError={(err) => handleErrors(err)}>
      {children}
    </Mutation>
  );
}

export default ValidationMutation;
