import React, { PropTypes } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';


const AppRouter = ({ url, langHandler }) => {
  // Remove trailing '/' from url so that we can use `${url}/topic` below
  if (url[url.length - 1] === '/') {
    url = url.slice(0, url.length - 1); // eslint-disable-line
  }

  return (
    <Switch>
      <Route
        exact
        path={`${url}/`}
        component={asyncComponent(() => import('../Dashboard/index'), langHandler)}
      />
      <Route
        exact
        path={`${url}/bot-court`}
        component={asyncComponent(() => import('../Dashboard/vote'), langHandler)}
      />
      {['', '/bot-court', '/activities'].map((page) => (
        <Route
          key={page}
          exact
          path={`${page}/oracle/:topicAddress/:address`}
          component={asyncComponent(() => import('../Event/scenes/oracle'), langHandler)}
        />
      ))}
      <Route
        path={`${url}/oracle/:topicAddress/:address`}
        component={asyncComponent(() => import('../Event/scenes/oracle'), langHandler)}
      />
      <Route
        exact
        path={`${url}/topic/:address`}
        component={asyncComponent(() => import('../Event/scenes/topic'), langHandler)}
      />
      <Route
        exact
        path={`${url}/create-topic`}
        component={asyncComponent(() => import('../CreateTopic/index'), langHandler)}
      />
      <Route
        exact
        path={`${url}/my-wallet`}
        component={asyncComponent(() => import('../Wallet/index'), langHandler)}
      />
      <Route
        path={`${url}/activities`}
        component={asyncComponent(() => import('../Activities/index'), langHandler)}
      />
    </Switch>
  );
};

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
  langHandler: PropTypes.func.isRequired,
};

export default AppRouter;
