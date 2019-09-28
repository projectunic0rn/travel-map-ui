  
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from './InterestIcons';

class InterestIcon extends Component {
  render() {
    const { icon, color } = this.props;
    return (
      <div className={'interest-icon'}>
        <Icon name={icon} color = {color} />
      </div>
    );
  }
}

InterestIcon.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string
};

export default InterestIcon;