import React, { Component } from "react";
import NavBar from "./components/NavBar";
import Home from "./components/home";
// import NotFound from "./components/notFound";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Redirect } from "react-router-dom";

import "./App.css";
import Footer from "./components/Footer";
import main from "./components/main";

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<div className="content">
					<Switch>
						{/* <Route path="/not-found" component={NotFound} /> */}
						<Route path="/" exact component={main} />
						<Route path="/game" exact component={Home} />

						<Redirect to="/" />
					</Switch>
				</div>
				<Footer />
			</div>
		);
	}
}

export default App;
