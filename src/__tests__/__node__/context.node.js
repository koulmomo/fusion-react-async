import tape from 'tape-cup';
import React from 'react';
import {renderToString} from 'react-dom/server';
import Provider from '../../prepare-provider';
import {prepare} from '../../index.js';

tape('Handling context', async t => {
  class Child extends React.Component {
    static contextTypes = {
      field: () => {},
    };

    constructor(props) {
      super(props);
    }

    render() {
      return <h1>{this.context.field ? 'Yes' : 'No'}</h1>;
    }
  }

  class Parent extends React.Component {
    static childContextTypes = {
      field: () => {},
    };

    getChildContext() {
      return {field: true};
    }

    render() {
      return <Child />;
    }
  }

  const ToTest = () => {
    return (
      <Parent>
        <Child />
      </Parent>
    );
  };

  const app = (
    <Provider preloadChunks={[]}>
      <ToTest />
    </Provider>
  );
  t.ok(/Yes/.test(renderToString(app)));
  await prepare(app);
  t.ok(/Yes/.test(renderToString(app)));
  t.end();
});
