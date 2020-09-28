import React from 'react';

const whyDidYouRender = require('@welldone-software/why-did-you-render');

if (process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
