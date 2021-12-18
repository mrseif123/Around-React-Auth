import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...props }) {
  return (
    <Route>
      {() =>
        props.loggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to='./signin' />
        )
      }
    </Route>
  );

  //   return (
  //   <Route>
  //     {
  //       <Component {...props} /> }
  //   </Route>
  // );
}

export default ProtectedRoute;