import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Dashboard } from './containers';
import { NotFound, About } from './components';

export default (
	<Switch>
		<Route exact path="/" component={Dashboard} />
		<Route exact path="/about" component={About} />
		<Route path="*" component={NotFound} />
	</Switch>
);
