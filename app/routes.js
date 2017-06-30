import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotFound, About, Dashboard } from './components';

export default (
	<Switch>
		<Route exact path="/about" component={About} />
        <Route exact path="/" component={Dashboard} />
		<Route path="*" component={NotFound} />
	</Switch>
);
