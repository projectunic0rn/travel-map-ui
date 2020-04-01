import Index from './index.js';

// TODO: Move the below mocks to a more generic "testHelpers" file. - TW

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

// TODO: Look into how we can also test how we are checking local storage.
//       May make sense to extract to tests around the ApolloClient. - TW
describe('index.js', () => {
  it('renders without crashing and requests the stored data', () => {
    // const spy = jest.spyOn(Storage.prototype, 'getItem');
    // expect(spy).toBeCalledWith('token');      
    expect(
      JSON.stringify(
        Object.assign({}, Index, { _reactInternalInstance: 'censored' }),
      ),
    ).toMatchSnapshot();
    // spy.mockRestore();
  });
})
