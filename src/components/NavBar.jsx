import React, { Component } from "react";
import info from "./images/info.png";
import setting from "./images/setting.png";
import github from "./images/github.png";
import normalLetter from "./images/Screenshot 2023-11-08 133346.png";
import silver from "./images/Screenshot 2023-11-08 133424.png";
import gold from "./images/Screenshot 2023-11-08 133451.png";
import trial1 from "./images/Screenshot 2023-11-08 132550.png";

class NavBar extends Component {
	state = { info: false, settings: false, timed: false, tutor: true };

	componentDidMount = () => {
		if (localStorage.getItem("TimeSettings")) {
			let timeSettings = JSON.parse(localStorage.getItem("TimeSettings"));
			let timed = timeSettings.timed;
			let tutor = timeSettings.tutor;

			this.setState({ timed, tutor });
		} else {
			let timed = this.state.timed;
			let tutor = this.state.tutor;
			let timeSettings = { timed: timed, tutor: tutor };
			localStorage.setItem("TimeSettings", JSON.stringify(timeSettings));

			this.setState({ timed, tutor });
		}
	};

	handleSetInfo = () => {
		let info = true;
		this.setState({ info });
	};

	handleHideInfo = () => {
		let info = false;
		this.setState({ info });
	};

	handleSetSettings = () => {
		let settings = true;
		this.setState({ settings });
	};

	handleHideSettings = () => {
		let settings = false;
		this.setState({ settings });
	};

	setTimedMode = () => {
		let timed = true;
		let tutor = false;

		let timeSettings = { timed: timed, tutor: tutor };
		localStorage.setItem("TimeSettings", JSON.stringify(timeSettings));

		this.setState({ timed, tutor });
	};

	setTutorMode = () => {
		let timed = false;
		let tutor = true;

		let timeSettings = { timed: timed, tutor: tutor };
		localStorage.setItem("TimeSettings", JSON.stringify(timeSettings));

		this.setState({ timed, tutor });
	};

	render() {
		return (
			<React.Fragment>
				{this.state.info && (
					<div className="info">
						<h1>
							How to play <span>Scramble</span>
						</h1>
						<button onClick={() => this.handleHideInfo()} className="hide">
							x
						</button>
						<p>
							Each day there will be a set of scrambled letters, and your goal
							is to re-arrange them to form valid words. You will need to think
							creatively and utilize your vocabulary skills to find a atleast
							one of the possible word combinations in the provided letters.
							<br></br>
							<br></br> Once you've identified a couple of these words, you'll
							have to check which word gives you the most points. The points for
							each letter are found in the bottom right corner of the letter.
							<br></br>
							<br></br>
						</p>{" "}
						<div className="letterArr">
							<div className="letterContainer">
								<img src={normalLetter} className="letterImg" />{" "}
								<p>Default Letter</p>
							</div>

							<div className="letterContainer">
								<img src={silver} className="letterImg" /> <p>Silver Letter</p>
							</div>

							<div className="letterContainer">
								<img src={gold} className="letterImg" /> <p>Golden Letter</p>
							</div>
						</div>
						<p>
							The silver letters double the points for the letter, and the
							golden letters triple the points of the letter.<br></br>{" "}
						</p>
						<img src={trial1} className="trial" />
						<p>
							Upon submission of the word created, the game checks the word in
							the dictionary provided, and calculates the points gained from the
							word, and rewards it to you.
						</p>
					</div>
				)}

				{this.state.settings && (
					<div className="settings">
						<h1>Game Settings</h1>
						<button onClick={() => this.handleHideSettings()} className="hide">
							x
						</button>

						<h4>Time Sensitivity</h4>
						<div className="timeButtons">
							{this.state.timed ? (
								<button className="active" onClick={() => this.setTimedMode()}>
									Timed mode
								</button>
							) : (
								<button onClick={() => this.setTimedMode()}>Timed mode</button>
							)}
							{this.state.tutor ? (
								<button className="active" onClick={() => this.setTutorMode()}>
									Tutor mode
								</button>
							) : (
								<button onClick={() => this.setTutorMode()}>Tutor mode</button>
							)}
						</div>
						<p>Refresh the page after changing modes</p>
					</div>
				)}

				<nav className="NavBar">
					<a className="logo" href="/">
						<h1>
							<span>s</span>
							<span>c</span>
							<span>r</span>
							<span>a</span>
							<span>m</span>
							<span>b</span>
							<span>l</span>
							<span>e</span>
						</h1>
					</a>
					<div className="links">
						<a
							rel="noreferrer"
							target="_blank"
							href="https://github.com/Othmanali02"
						>
							<img src={github} alt="github" className="link" />
						</a>
						<a onClick={() => this.handleSetInfo()}>
							<img src={info} alt="info" className="link" />
						</a>
						<a onClick={() => this.handleSetSettings()}>
							<img src={setting} alt="info" className="link" />
						</a>
					</div>

					<hr></hr>
				</nav>
			</React.Fragment>
		);
	}
}

export default NavBar;
