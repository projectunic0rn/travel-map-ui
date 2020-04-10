import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

describe('Header', () => {
  it('should render correctly in when the user is logged out', () => {
    const renderOpts = {
      userLoggedIn: false,
      avatarIndex: 1,
      color: 'green'
    }
    const component = shallow(<Header {...renderOpts} />);
  
    expect(component).toMatchSnapshot();
  });

  it('should render correctly in when the user is logged in', () => {
    const renderOpts = {
      userLoggedIn: true,
      avatarIndex: 1,
      color: 'green'
    }
    const component = shallow(<Header {...renderOpts} />);
  
    expect(component).toMatchSnapshot();
  });
});
