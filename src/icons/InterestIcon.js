  
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from './InterestIcons';

class InterestIcon extends Component {
  render() {
    const { icon } = this.props;
    return (
      <div className={'interest-icon'}>
        <Icon name={icon} />
      </div>
    );
  }
}

InterestIcon.propTypes = {
  icon: PropTypes.string
};

export default InterestIcon;