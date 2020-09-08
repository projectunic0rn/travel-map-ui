import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { REMOVE_PLACES_IN_COUNTRY } from "../../../GraphQL";


class DoMutation extends React.Component {
  componentDidMount() {
    const { mutation } = this.props;
    mutation();
  }

  render() {
    return null;
  }
}

function DeleteCitiesPopup({ children, country, handleDeleteCities, currentTiming }) {
  return (
    <div className="city-choosing-container">
      <Mutation
        mutation={REMOVE_PLACES_IN_COUNTRY}
        variables={{ country, currentTiming }}
        onCompleted={() => handleDeleteCities()}
      >
        {(mutation, { data, loading, error }) => (
          <>
            <DoMutation mutation={mutation} data={data}></DoMutation>
            {children && children(mutation, { data, loading, error })}
          </>
        )}
      </Mutation>
    </div>
  );
}

DeleteCitiesPopup.propTypes = {
  country: PropTypes.string,
  currentTiming: PropTypes.number,
  children: PropTypes.object,
  handleDeleteCities: PropTypes.func
};

DoMutation.propTypes = {
  data: PropTypes.object,
  mutation: PropTypes.func
};

export default DeleteCitiesPopup;
