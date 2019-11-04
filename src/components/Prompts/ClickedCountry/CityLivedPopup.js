import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { UPDATE_PLACE_LIVING } from "../../../GraphQL";

class DoMutation extends React.Component {
  componentDidMount() {
    const { mutation } = this.props;
    mutation();
  }

  render() {
    return null;
  }
}

function CityLivedPopup({ children, country, cities, id, handleAddCity }) {
  return (
    <div className="city-choosing-container">
      <Mutation
        mutation={UPDATE_PLACE_LIVING}
        variables={{ id, country, cities }}
        onCompleted={data => handleAddCity(data, 2)}
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

CityLivedPopup.propTypes = {
  country: PropTypes.object,
  cities: PropTypes.object,
  id: PropTypes.number,
  children: PropTypes.object,
  handleAddCity: PropTypes.func
};

DoMutation.propTypes = {
  data: PropTypes.object,
  mutation: PropTypes.func
};

export default CityLivedPopup;
