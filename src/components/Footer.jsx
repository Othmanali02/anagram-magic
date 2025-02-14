import React, { Component } from "react";

class Footer extends Component {
	state = {};
	render() {
		return (
			<div className="footer">
				<h4>
					Created by{" "}
					<a
						className="othman"
						rel="noreferrer"
						target="_blank"
						href="https://01hman.com"
					>
						Othman Ali
					</a>
				</h4>
			</div>
		);
	}
}

export default Footer;
