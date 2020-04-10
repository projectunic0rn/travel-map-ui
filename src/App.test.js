import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import App from './App';

/* Stubbing out of Geocoder to resolve the following error:
 * >  Your browser does not have secure random generator.
 * >  If you don’t need unpredictable IDs, you can use nanoid/non-secure.
 */
jest.mock('react-map-gl-geocoder', () => ({
  __esModule: true,
  default: 'Geocoder',
  namedExport: jest.fn(),
}));
// Stubs all ReactGA requests
jest.mock('react-ga');

describe('App', () => {
  it('renders without crashing for an unauthenticated user', () => {
    const props = {
      userAuthenticated: false
    }
    const wrapper = shallow(<App {...props} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  });
})
