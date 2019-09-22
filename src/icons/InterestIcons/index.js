  
import React from 'react';
import PropTypes from 'prop-types';

import AdventureIcon from './AdventureIcon';
import FoodieIcon from './FoodieIcon';
import NatureIcon from './NatureIcon';

const Icon = props => {
    switch (props.name) {
      case 'adventure':
        return <AdventureIcon {...props} />;
      case 'foodie':
        return <FoodieIcon {...props} />;
      case 'nature':
        return <NatureIcon {...props} />;
      default:
        return null;
    }
  };
  
  Icon.propTypes = {
    name: PropTypes.string
  };
  
  export default Icon;