import React, { Component } from "react";
import setting from "./images/setting.png";
import hangle from "./images/Screenshot 2023-03-19 200702.png";
import info from "./images/info.png";

class main extends Component {
	state = {};
	render() {
		return (
			<React.Fragment>
				<div className="mainScreen">
					{/* <h1>Welcome to Scramble!</h1> */}

					<div className="paragraph">
						<p>
							<span className="Scramble">Scramble</span> is a daily anagram game
							that will put your vocabulary skills to test! Everyday you will be
							challenged with three rounds that are broken down like this:
							<br></br> <br></br>
							<span className="rounds">Round One: </span>Each day there will be
							a set of random letters with different points that the player has
							to arrange to form a meaningful word.
							<br></br>
							<br></br>
							<span className="rounds">Round Two: </span>This part of the daily
							game is random to each user, you will be prompted to choose what
							type of letter you want (Vowel or Consonant), and create a word
							that generates the most points.
							<br></br>
							<br></br>
							<span className="rounds">Round Three: </span>The Nine-Letter word
							of the day! each user will have to guess today's nine-letter word
							based on the characters available.
							<br></br>
							<br></br>
							The game can be played in the Timed mode
							<span className="time"> (time sensitive)</span> and the Tutor mode{" "}
							<span className="time">(non-time sensitive)</span>. You can change
							that from the settings menu which you can access by clicking on
							the settings icon <img src={setting} alt="" /> from the navigation
							bar at the top of the screen. To learn how to play the game, click
							on the <img src={info} alt="" /> icon for instructions.
						</p>

						<a href="/game" className="play">
							Play today's game!
						</a>
						{/* <a href="/practice" className="play">
							Practice
						</a> */}
					</div>
				</div>

				<div className="cardsGrid">
					<h2>What is an Anagram?</h2>
					<p>
						{" "}
						An Anagram is a word or phrase made by transposing the letters of
						another word or phrase. For example, rearranging the letters in the
						word "elbow" will result in the word "below." It is a very intuitive
						and engaging language puzzle! Play today's game to check it out!
					</p>
					<h2 className="hangle">Check out my other games</h2>
					<p>
						Hangle is a daily game of Hangman for countries. Each day there will
						be a different country chosen randomly from a set of over 200
						countries! Can you guess today's country?{" "}
						<a rel="noreferrer" target="_blank" href="https://hangle-geo.com/">
							Hangle
						</a>
					</p>
					<div className="imgContainer">
						{" "}
						<a rel="noreferrer" target="_blank" href="https://hangle-geo.com/">
							<img src={hangle} alt="Hangle" />
						</a>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default main;
