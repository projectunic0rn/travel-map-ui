import React from 'react';
import { mount } from 'enzyme';
import PopupPrompt from './PopupPrompt';

const showPopupFunc = jest.fn();
const submitFunc = jest.fn();

// Mock renderable component
const ShownComponentMock = () => <div>test</div>;

describe('PopupPrompt', () => {
  it('button click should hide component', () => {
    const component = mount(<PopupPrompt onClick={submitFunc} activePopup={true} showPopup={showPopupFunc} component={ShownComponentMock} />);
    expect(component.text()).toEqual('test')
  });
});
