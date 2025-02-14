import React, { Component } from "react";
import back from "./images/back.png";
import shuffle from "./images/shuffle.png";
import load from "./images/load.gif";
import play from "./images/play.png";
import clock from "./images/clock.png";
import axios from "axios";
import copy from "copy-to-clipboard";

import {
	getRandomConstant,
	getRandomNine,
	getRandomVowel,
	createNineLetterWord,
	getTodaysLetters,
} from "../LetterData";

class Home extends Component {
	state = {
		userLetters: [],
		inputLetters: [],

		totalScore: 0,

		round1Score: 0,
		round1Word: {},
		postRound1: false,

		round2Letters: [],
		round2Score: 0,
		round2: false,
		postRound2: false,
		RandomIndexGold: -1,
		RandomIndexSilver: -1,
		vowel: false,
		constant: false,

		round3Score: 0,
		round3: false,
		postRound3: false,
		NineWord: "",

		showSheet: false,
		loadScreen: false,

		timed: false,
		tutor: true,
		timer: 30,
		isRunning: false,
	};

	componentDidMount = () => {
		window.addEventListener("keydown", this.handleKeyPress);

		if (localStorage.getItem("TimeSettings")) {
			let timeSettings = JSON.parse(localStorage.getItem("TimeSettings"));
			let timed = timeSettings.timed;
			let tutor = timeSettings.tutor;

			if (tutor) {
				let timer = 30;
				this.stopTimer();
				localStorage.setItem("currTime", timer);
			}

			if (timed) {
				let timer = 30;
				this.startTimer();
				this.setState({ timer });
			}

			let timeSettings1 = { timed: timed, tutor: tutor };
			localStorage.setItem("TimeSettings", JSON.stringify(timeSettings1));

			this.setState({ timed, tutor });
		} else {
			let timed = this.state.timed;
			let tutor = this.state.tutor;
			let timeSettings = { timed: timed, tutor: tutor };
			localStorage.setItem("TimeSettings", JSON.stringify(timeSettings));

			if (tutor) {
				this.stopTimer();
			}

			this.setState({ timed, tutor });
		}

		if (
			!localStorage.getItem("LettersData") ||
			(localStorage.getItem("LettersData") &&
				JSON.parse(localStorage.getItem("LettersData")).date !==
					this.formatDate(new Date()))
		) {
			localStorage.removeItem("2Check");
			localStorage.removeItem("PostRoundData");
			localStorage.removeItem("inputLetters");
			localStorage.removeItem("RoundData");
			localStorage.removeItem("userLetters");
			localStorage.removeItem("LettersData");
			localStorage.removeItem("currTime");

			let todaysLetters = getTodaysLetters(this.formatDate(new Date()));

			let lettersObj = {
				RandomNine: todaysLetters.RandomNine,
				NineWordLetters: todaysLetters.NineWordLetters,
				NineWord: todaysLetters.NineWord,
				date: todaysLetters.date,
			};

			localStorage.setItem("LettersData", JSON.stringify(lettersObj));

			let userLetters = todaysLetters.RandomNine;
			if (this.state.timed === true) {
				if (localStorage.getItem("currTime")) {
					let timer = localStorage.getItem("currTime");
					this.setState({ timer });
					this.startTimer();
				}
				this.startTimer();
			}
			this.setState({ userLetters });
		} else {
			let todaysLetters = JSON.parse(localStorage.getItem("LettersData"));

			let lettersObj = {
				RandomNine: todaysLetters.RandomNine,
				NineWordLetters: todaysLetters.NineWordLetters,
				NineWord: todaysLetters.NineWord,
				date: todaysLetters.date,
			};

			localStorage.setItem("LettersData", JSON.stringify(lettersObj));

			let userLetters = todaysLetters.RandomNine;

			if (this.state.timed === true) {
				if (localStorage.getItem("currTime")) {
					let timer = localStorage.getItem("currTime");
					this.setState({ timer });
				}
				this.startTimer();
			}
			let inputLetters = [];
			if (
				localStorage.getItem("userLetters") &&
				localStorage.getItem("inputLetters")
			) {
				userLetters = JSON.parse(localStorage.getItem("userLetters"));
				inputLetters = JSON.parse(localStorage.getItem("inputLetters"));
			}

			this.setState({ userLetters, inputLetters });
		}

		if (localStorage.getItem("PostRoundData")) {
			let items = JSON.parse(localStorage.getItem("PostRoundData"));

			let postRound1 = items[0].postRound1;
			let postRound2 = items[1].postRound2;
			let postRound3 = items[2].postRound3;
			let showSheet = items[3].showSheet;
			let totalScore = items[4].totalScore;
			let round1Score = items[5].round1Score;
			let round1Word = items[6].round1Word;
			let round2 = items[7].round2;
			let round3 = items[8].round3;

			this.stopTimer();

			this.setState({
				totalScore,
				postRound1,
				postRound2,
				postRound3,
				round1Score,
				round2,
				round3,
				round1Word,
				showSheet,
			});
		}

		if (localStorage.getItem("RoundData")) {
			let items = JSON.parse(localStorage.getItem("RoundData"));

			let postRound1 = items[0].postRound1;
			let postRound2 = items[1].postRound2;
			let postRound3 = items[2].postRound2;
			let round2 = items[3].round2;
			let round3 = items[4].round3;
			let inputLetters = items[5].inputLetters;
			let userLetters = items[6].userLetters;
			let NineWord = items[6].NineWord;

			let vowel = false;
			let constant = false;

			let timeSettings = JSON.parse(localStorage.getItem("TimeSettings"));
			let timed = timeSettings.timed;

			if (round2 && localStorage.getItem("userLetters")) {
				console.log(localStorage);

				if (localStorage.getItem("2Check")) {
					let obj = JSON.parse(localStorage.getItem("2Check"));
					vowel = obj.vowel;
					constant = obj.constant;
					this.setState({ vowel, constant });
				}

				if (timed === true) {
					if (localStorage.getItem("currTime")) {
						let timer = localStorage.getItem("currTime");
						this.setState({ timer });
					}

					if (!this.state.vowel && !this.state.constant) {
						this.startTimer();
					}
				}

				userLetters = JSON.parse(localStorage.getItem("userLetters"));
				if (localStorage.getItem("inputLetters"))
					inputLetters = JSON.parse(localStorage.getItem("inputLetters"));

				this.setState({ userLetters, inputLetters });
			}
			if (round3 && localStorage.getItem("userLetters")) {
				let timeSettings = JSON.parse(localStorage.getItem("TimeSettings"));
				let timed = timeSettings.timed;

				if (timed === true) {
					if (localStorage.getItem("currTime")) {
						let timer = localStorage.getItem("currTime");
						this.setState({ timer });
					}
					this.startTimer();
				}
			}

			if (
				this.state.postRound1 ||
				this.state.postRound2 ||
				this.state.postRound3
			) {
				round2 = false;
				round3 = false;
			}

			this.setState({
				postRound1,
				postRound2,
				postRound3,
				round2,
				round3,
				inputLetters,
				userLetters,
				NineWord,
			});
		}
	};

	clear = () => {
		if (localStorage.getItem("PostRoundData"))
			localStorage.removeItem("PostRoundData");
		if (localStorage.getItem("RoundData")) localStorage.removeItem("RoundData");
		if (localStorage.getItem("RandomNine"))
			localStorage.removeItem("RandomNine");
		if (localStorage.getItem("inputLetters"))
			localStorage.removeItem("inputLetters");
		if (localStorage.getItem("userLetters"))
			localStorage.removeItem("userLetters");

		this.componentDidMount();
	};

	formatDate = (date) => {
		var d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [year, month, day].join("-");
	};

	renderFake = (char) => {
		if (char.type === 0) {
			return (
				<div key={char.id} className="letter">
					{char.char}
					<span className="points">{char.points}</span>
				</div>
			);
		} else if (char.type === 1) {
			return (
				<div key={char.id} className="letter double">
					<span className="badge">x2</span>
					{char.char}
					<span className="points">{char.points}</span>
				</div>
			);
		} else if (char.type === 2) {
			return (
				<div key={char.id} className="letter triple">
					{" "}
					<span className="badge">x3</span>
					{char.char}
					<span className="points">{char.points}</span>
				</div>
			);
		}
	};

	renderChar = (char) => {
		if (char.type === 0) {
			return (
				<div
					key={char.id}
					className="letter"
					onClick={() => this.createInput(char)}
				>
					{char.char}
					<span className="points">{char.points}</span>
				</div>
			);
		} else if (char.type === 1) {
			return (
				<div
					key={char.id}
					onClick={() => this.createInput(char)}
					className="letter double"
				>
					<span className="badge">x2</span>
					{char.char}
					<span className="points">{char.points}</span>
				</div>
			);
		} else if (char.type === 2) {
			return (
				<div
					key={char.id}
					onClick={() => this.createInput(char)}
					className="letter triple"
				>
					{" "}
					<span className="badge">x3</span>
					{char.char}
					<span className="points">{char.points}</span>
				</div>
			);
		}
	};

	removeChar = (char) => {
		if (char.type === 0) {
			return (
				<div
					key={char.id}
					className="letter"
					onClick={() => this.removeInput(char)}
				>
					{char.char}
					<span className="points">{char.points}</span>
				</div>
			);
		} else if (char.type === 1) {
			return (
				<div
					key={char.id}
					onClick={() => this.removeInput(char)}
					className="letter double"
				>
					<span className="badge">x2</span>
					{char.char}
					<span className="points">{char.points}</span>
				</div>
			);
		} else if (char.type === 2) {
			return (
				<div
					key={char.id}
					onClick={() => this.removeInput(char)}
					className="letter triple"
				>
					{" "}
					<span className="badge">x3</span>
					{char.char}
					<span className="points">{char.points}</span>
				</div>
			);
		}
	};

	createInput = (character) => {
		let inputLetters = this.state.inputLetters;
		let userLetters = this.state.userLetters;

		let index = userLetters.indexOf(character);
		userLetters.splice(index, 1);
		inputLetters.push(character);

		localStorage.setItem("inputLetters", JSON.stringify(inputLetters));
		localStorage.setItem("userLetters", JSON.stringify(userLetters));

		this.setState({ inputLetters, userLetters });
	};

	removeInput = (character) => {
		let inputLetters = this.state.inputLetters;
		let userLetters = this.state.userLetters;

		let index = inputLetters.indexOf(character);
		inputLetters.splice(index, 1);
		userLetters.push(character);

		localStorage.setItem("inputLetters", JSON.stringify(inputLetters));
		localStorage.setItem("userLetters", JSON.stringify(userLetters));

		this.setState({ inputLetters, userLetters });
	};

	backSpace = () => {
		let inputLetters = this.state.inputLetters;
		let userLetters = this.state.userLetters;

		if (inputLetters.length !== 0) {
			let letter = inputLetters.pop();
			userLetters.push(letter);
		}

		localStorage.setItem("inputLetters", JSON.stringify(inputLetters));
		localStorage.setItem("userLetters", JSON.stringify(userLetters));

		this.setState({ inputLetters, userLetters });
	};

	switch = (array) => {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex > 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}

		return array;
	};

	Shuffle = () => {
		let pre = this.state.userLetters;
		let userLetters = this.switch(pre);

		localStorage.setItem("userLetters", JSON.stringify(userLetters));

		this.setState({ userLetters });
	};

	handleSubmit = async () => {
		if (this.state.timer) {
			if (this.state.timer > 0 || this.state.timer === 0) {
				this.stopTimer();
				//add points on the time
			}
		}

		let loadScreen = true;
		this.setState({ loadScreen });
		let arr = this.state.inputLetters;

		let chars = "";
		let points = 0;
		for (let i = 0; i < arr.length; i++) {
			chars += arr[i].char;
			if (arr[i].type === 0) {
				points += arr[i].points;
			} else if (arr[i].type === 1) {
				points += arr[i].points * 2;
			} else if (arr[i].type === 2) {
				points += arr[i].points * 3;
			}
		}

		let word = await axios
			.get("https://api.dictionaryapi.dev/api/v2/entries/en/" + chars)

			.then((response) => {
				return response.data;
			})

			.catch((error) => {
				return "DNE";
			});

		let round1Score = 0;
		let round1Word = {};
		let showSheet = this.state.showSheet;

		if (word === "DNE") {
			let loadScreen = false;
			this.setState({ loadScreen });

			round1Score = 0;
			round1Word = {
				word: chars.toLowerCase(),
				meaning: "",
			};

			let totalScore = this.state.totalScore;
			totalScore += 0;

			let postRound1 = this.state.postRound1;
			let postRound2 = this.state.postRound2;
			let postRound3 = this.state.postRound3;

			// Round One
			if (this.state.round2 === false && this.state.round3 === false) {
				postRound1 = true;
				postRound2 = false;
				postRound3 = false;
				let postRoundData = [
					{
						postRound1: true,
					},
					{ postRound2: false },
					{ postRound3: false },
					{ showSheet: false },
					{ totalScore: totalScore },
					{ round1Score: round1Score },
					{ round1Word: round1Word },
					{ round2: false },
					{ round3: false },
				];

				if (localStorage.getItem("RoundData")) {
					localStorage.removeItem("RoundData");
				}

				let timer = 30;
				this.setState({ timer });

				localStorage.setItem("PostRoundData", JSON.stringify(postRoundData));
			} else if (this.state.round2 && this.state.round3 === false) {
				// Round Two
				postRound1 = false;
				postRound2 = true;
				postRound3 = false;
				let postRoundData = [
					{
						postRound1: false,
					},
					{ postRound2: true },
					{ postRound3: false },
					{ showSheet: false },
					{ totalScore: totalScore },
					{ round1Score: round1Score },
					{ round1Word: round1Word },
					{ round2: false },
					{ round3: false },
				];

				if (localStorage.getItem("RoundData")) {
					localStorage.removeItem("RoundData");
				}

				let timer = 60;
				this.setState({ timer });

				localStorage.setItem("PostRoundData", JSON.stringify(postRoundData));
			} else if (this.state.round2 === false && this.state.round3) {
				//Round Three
				postRound1 = false;
				postRound2 = false;
				postRound3 = true;
				showSheet = true;
				let postRoundData = [
					{
						postRound1: false,
					},
					{ postRound2: false },
					{ postRound3: true },
					{ showSheet: true },
					{ totalScore: totalScore },
					{ round1Score: round1Score },
					{ round1Word: round1Word },
					{ round2: false },
					{ round3: false },
				];

				if (
					chars.toLowerCase() ===
					JSON.parse(localStorage.getItem("LettersData")).NineWord.toLowerCase()
				) {
					round1Score = points;
					round1Word = {
						word: chars.toLowerCase(),
						meaning: "You guessed today's word correctly!",
					};
					totalScore += points;
				}

				if (localStorage.getItem("RoundData")) {
					localStorage.removeItem("RoundData");
				}

				let games = [];
				if (localStorage.getItem("Games")) {
					games = JSON.parse(localStorage.getItem("Games"));
				}

				let scrambleDate = JSON.parse(localStorage.getItem("LettersData")).date;
				// let cheater = false;

				// for (let i = 0; i < games.length; i++) {
				// 	if (scrambleDate === JSON.parse(games[i].Country).date) {
				// 		cheater = true;
				// 	}
				// }

				let nineWin = 0;

				if (
					chars.toLowerCase() ===
					JSON.parse(localStorage.getItem("LettersData")).NineWord.toLowerCase()
				) {
					nineWin = 1;
				}

				// if (!cheater) {
				games.push({
					totalPoints: totalScore,
					nineWin: nineWin,
					date: scrambleDate,
				});
				// }

				localStorage.setItem("Games", JSON.stringify(games));

				localStorage.setItem("PostRoundData", JSON.stringify(postRoundData));
			}

			this.setState({
				totalScore,
				postRound1,
				postRound2,
				postRound3,
				round1Score,
				round1Word,
				showSheet,
			});
		} else {
			let loadScreen = false;
			this.setState({ loadScreen });
			let totalScore = this.state.totalScore;
			round1Score = points;

			round1Word = {
				word: word[0].word,
				meaning: word[0].meanings[0].definitions[0].definition,
				type: word[0].meanings[0].partOfSpeech,
			};

			totalScore += points;

			let postRound1 = this.state.postRound1;
			let postRound2 = this.state.postRound2;
			let postRound3 = this.state.postRound3;

			// Round One
			if (this.state.round2 === false && this.state.round3 === false) {
				postRound1 = true;
				postRound2 = false;
				postRound3 = false;
				let postRoundData = [
					{
						postRound1: true,
					},
					{ postRound2: false },
					{ postRound3: false },
					{ showSheet: false },
					{ totalScore: totalScore },
					{ round1Score: round1Score },
					{ round1Word: round1Word },
					{ round2: false },
					{ round3: false },
				];
				if (localStorage.getItem("RoundData")) {
					localStorage.removeItem("RoundData");
				}

				if (localStorage.getItem("BestWord")) {
					let bestWord = JSON.parse(localStorage.getItem("BestWord"));
					let bestPoints = bestWord.points;
					if (points > bestPoints) {
						let obj = { arr: arr, points: points };
						localStorage.setItem("BestWord", JSON.stringify(obj));
					}
				} else {
					let obj = { arr: arr, points: points };
					localStorage.setItem("BestWord", JSON.stringify(obj));
				}

				let timer = 30;
				this.setState({ timer });

				localStorage.setItem("PostRoundData", JSON.stringify(postRoundData));
			} else if (this.state.round2 && this.state.round3 === false) {
				// Round Two
				postRound1 = false;
				postRound2 = true;
				postRound3 = false;
				let postRoundData = [
					{
						postRound1: false,
					},
					{ postRound2: true },
					{ postRound3: false },
					{ showSheet: false },
					{ totalScore: totalScore },
					{ round1Score: round1Score },
					{ round1Word: round1Word },
					{ round2: false },
					{ round3: false },
				];
				if (localStorage.getItem("RoundData")) {
					localStorage.removeItem("RoundData");
				}

				if (localStorage.getItem("BestWord")) {
					let bestWord = JSON.parse(localStorage.getItem("BestWord"));
					let bestPoints = bestWord.points;
					if (points > bestPoints) {
						let obj = { arr: arr, points: points };
						localStorage.setItem("BestWord", JSON.stringify(obj));
					}
				} else {
					let obj = { arr: arr, points: points };
					localStorage.setItem("BestWord", JSON.stringify(obj));
				}

				let timer = 60;
				this.setState({ timer });

				localStorage.setItem("PostRoundData", JSON.stringify(postRoundData));
			} else if (this.state.round2 === false && this.state.round3) {
				//Round Three

				postRound1 = false;
				postRound2 = false;
				postRound3 = true;
				showSheet = true;

				if (
					chars.toLowerCase() ===
					JSON.parse(localStorage.getItem("LettersData")).NineWord.toLowerCase()
				) {
					round1Score = points;
					round1Word = {
						word: chars.toLowerCase(),
						meaning: "You guessed today's word correctly!",
					};
					totalScore += points;
				} else {
					round1Score = 0;
					round1Word = {
						word: chars.toLowerCase(),
						meaning: "",
					};
				}

				let postRoundData = [
					{
						postRound1: false,
					},
					{ postRound2: false },
					{ postRound3: true },
					{ showSheet: true },
					{ totalScore: totalScore },
					{ round1Score: round1Score },
					{ round1Word: round1Word },
					{ round2: false },
					{ round3: false },
				];

				if (localStorage.getItem("RoundData")) {
					localStorage.removeItem("RoundData");
				}

				let games = [];
				if (localStorage.getItem("Games")) {
					games = JSON.parse(localStorage.getItem("Games"));
				}

				let scrambleDate = JSON.parse(localStorage.getItem("LettersData")).date;
				// let cheater = false;

				// for (let i = 0; i < games.length; i++) {
				// 	if (scrambleDate === JSON.parse(games[i].Country).date) {
				// 		cheater = true;
				// 	}
				// }

				let nineWin = 0;

				if (
					chars.toLowerCase() ===
					JSON.parse(localStorage.getItem("LettersData")).NineWord.toLowerCase()
				) {
					nineWin = 1;
				}

				// if (!cheater) {
				games.push({
					totalPoints: totalScore,
					nineWin: nineWin,
					date: scrambleDate,
				});
				// }

				localStorage.setItem("Games", JSON.stringify(games));

				localStorage.setItem("PostRoundData", JSON.stringify(postRoundData));
			}

			this.setState({
				totalScore,
				postRound1,
				postRound2,
				postRound3,
				round1Score,
				round1Word,
				showSheet,
			});
		}
	};

	advance2Round2 = () => {
		let postRound1 = false;
		let postRound2 = false;
		let postRound3 = false;

		let inputLetters = [];
		let userLetters = [];

		let round2 = true;

		let RoundData = [
			{
				postRound1: false,
			},
			{ postRound2: false },
			{ postRound3: false },
			{ round2: true },
			{ round3: false },
			{ inputLetters: inputLetters },
			{ userLetters: userLetters },
			{ NineWord: "" },
		];

		localStorage.setItem("userLetters", userLetters);
		localStorage.setItem("inputLetters", inputLetters);
		localStorage.setItem("RoundData", JSON.stringify(RoundData));

		let timer;
		if (this.state.timed) timer = 30;
		localStorage.setItem("currTime", timer);

		this.setState({
			postRound1,
			postRound2,
			postRound3,
			inputLetters,
			userLetters,
			round2,
			timer,
		});
	};

	advance2Round3 = () => {
		let postRound1 = false;
		let postRound2 = false;
		let postRound3 = false;

		let inputLetters = [];

		let todaysLetters = JSON.parse(localStorage.getItem("LettersData"));
		let getArr = todaysLetters.NineWordLetters;
		let NineWord = todaysLetters.NineWord;

		let userLetters = this.switch(getArr);

		let round2 = false;
		let round3 = true;

		let RoundData = [
			{
				postRound1: false,
			},
			{ postRound2: false },
			{ postRound3: false },
			{ round2: false },
			{ round3: true },
			{ inputLetters: inputLetters },
			{ userLetters: userLetters },
			{ NineWord: NineWord },
		];

		localStorage.setItem("inputLetters", inputLetters);
		localStorage.setItem("RoundData", JSON.stringify(RoundData));

		if (this.state.timed === true) {
			let timer;
			timer = 60;
			localStorage.setItem("currTime", timer);
			this.setState({ timer });
			this.startTimer();
		}

		this.setState({
			postRound1,
			postRound2,
			postRound3,
			inputLetters,
			userLetters,
			round2,
			round3,
			NineWord,
		});
	};

	addVowel = () => {
		let userLetters = this.state.userLetters;

		let letter = getRandomVowel();
		let vowel = this.state.vowel;

		if (
			this.state.RandomIndexGold === -1 &&
			this.state.RandomIndexSilver === -1
		) {
			let RandomIndexSilver, RandomIndexGold;

			// Generate the first random number between 0 and 8
			RandomIndexSilver = Math.floor(Math.random() * 9);

			// Generate the second random number, ensuring it's different from the first
			do {
				RandomIndexGold = Math.floor(Math.random() * 9);
			} while (RandomIndexGold === RandomIndexSilver);

			if (RandomIndexGold === userLetters.length - 1) {
				letter = { char: letter.char, points: letter.points, type: 2 };
			}
			if (RandomIndexSilver === userLetters.length - 1) {
				letter = { char: letter.char, points: letter.points, type: 1 };
			}

			this.setState({ RandomIndexGold, RandomIndexSilver });
		} else {
			let RandomIndexSilver = this.state.RandomIndexSilver,
				RandomIndexGold = this.state.RandomIndexGold;

			if (RandomIndexGold === userLetters.length - 1) {
				letter = { char: letter.char, points: letter.points, type: 2 };
			}
			if (RandomIndexSilver === userLetters.length - 1) {
				letter = { char: letter.char, points: letter.points, type: 1 };
			}
		}

		if (this.countVowels(userLetters) <= 2) {
			userLetters.push(letter);
		}
		if (this.countVowels(userLetters) === 3) {
			vowel = true;
		}

		if (userLetters.length === 9) {
			if (this.state.timed === true) this.startTimer();
		}
		let obj = { vowel: vowel, constant: this.state.constant };
		localStorage.setItem("userLetters", JSON.stringify(userLetters));
		localStorage.setItem("inputLetters", []);
		localStorage.setItem("2Check", JSON.stringify(obj));

		this.setState({ userLetters, vowel });
	};

	addConstant = () => {
		let userLetters = this.state.userLetters;

		let letter = getRandomConstant();
		let constant = this.state.constant;

		if (
			this.state.RandomIndexGold === -1 &&
			this.state.RandomIndexSilver === -1
		) {
			let RandomIndexSilver, RandomIndexGold;

			// Generate the first random number between 0 and 8
			RandomIndexSilver = Math.floor(Math.random() * 9);

			// Generate the second random number, ensuring it's different from the first
			do {
				RandomIndexGold = Math.floor(Math.random() * 9);
			} while (RandomIndexGold === RandomIndexSilver);

			if (RandomIndexGold === userLetters.length - 1) {
				letter = { char: letter.char, points: letter.points, type: 2 };
			}
			if (RandomIndexSilver === userLetters.length - 1) {
				letter = { char: letter.char, points: letter.points, type: 1 };
			}

			this.setState({ RandomIndexGold, RandomIndexSilver });
		} else {
			let RandomIndexSilver = this.state.RandomIndexSilver,
				RandomIndexGold = this.state.RandomIndexGold;

			if (RandomIndexGold === userLetters.length - 1) {
				letter = { char: letter.char, points: letter.points, type: 2 };
			}
			if (RandomIndexSilver === userLetters.length - 1) {
				letter = { char: letter.char, points: letter.points, type: 1 };
			}
		}

		if (this.countConstants(userLetters) < 6) {
			userLetters.push(letter);
		}
		if (this.countConstants(userLetters) === 6) {
			constant = true;
		}

		if (userLetters.length === 9) {
			if (this.state.timed === true) this.startTimer();
		}
		let obj = { vowel: this.state.vowel, constant: constant };
		localStorage.setItem("userLetters", JSON.stringify(userLetters));
		localStorage.setItem("inputLetters", []);
		localStorage.setItem("2Check", JSON.stringify(obj));

		this.setState({ userLetters, constant });
	};

	countVowels = (input) => {
		let count = 0;

		for (let i = 0; i < input.length; i++) {
			if ("AEIOU".includes(input[i].char)) count++;
		}
		return count;
	};

	countConstants = (input) => {
		let count = 0;

		for (let i = 0; i < input.length; i++) {
			if ("BCDFGHJKLMNPQRSTVWXYZ".includes(input[i].char)) count++;
		}
		return count;
	};

	getBestWord = () => {
		if (localStorage.getItem("BestWord")) {
			let obj = JSON.parse(localStorage.getItem("BestWord"));
			let arr = obj.arr;

			return arr.map((char) => this.renderFake(char));
		} else {
			return <span className="bestWord">None</span>;
		}
	};

	calcAllTimeAverage = () => {
		//iterate through the array of locally stored games.
		//modify the componentDidMount function to start an array of games for the user stored on their local Storage
		//get the total number of mistakes for the user

		let games = [];
		if (localStorage.getItem("Games"))
			games = JSON.parse(localStorage.getItem("Games"));

		let sum = 0;
		for (let i = 0; i < games.length; i++) {
			sum += games[i].totalPoints;
		}
		let avg = Math.round(sum / games.length);

		return avg;
	};

	calcWeekAverage = () => {
		let games = [];
		if (localStorage.getItem("Games"))
			games = JSON.parse(localStorage.getItem("Games"));

		let sum = 0;
		if (games.length < 7) {
			for (let i = 0; i < games.length; i++) {
				sum += games[i].totalPoints;
			}
		} else {
			for (let i = 0; i < 7; i++) {
				sum += games[i].totalPoints;
			}
		}

		let avg = Math.round(sum / games.length);

		return avg;
	};

	calcGamesWon = () => {
		let games = [];
		if (localStorage.getItem("Games"))
			games = JSON.parse(localStorage.getItem("Games"));

		let gamesWon = 0;
		for (let i = 0; i < games.length; i++) {
			gamesWon += games[i].nineWin;
		}

		return gamesWon;
	};

	gamesPlayed = () => {
		let games = [];
		if (localStorage.getItem("Games"))
			games = JSON.parse(localStorage.getItem("Games"));

		return games.length;
	};

	handleShowSheet = () => {
		let showSheet = true;
		this.setState({ showSheet });
	};

	handleHideSheet = () => {
		let showSheet = false;
		this.setState({ showSheet });
	};

	timerExpired = () => {
		// Do something when the timer expires
		if (this.state.timed) this.handleSubmit();
		// You can replace the console.log with the desired action.
	};

	startTimer = () => {
		this.timerInterval = setInterval(() => {
			if (this.state.timer > 0) {
				localStorage.setItem("currTime", this.state.timer - 1);
				this.setState({ timer: this.state.timer - 1 });
			} else {
				this.timerExpired();
				this.setState({ isRunning: false });
				this.stopTimer();
			}
		}, 1000);
	};

	stopTimer = () => {
		clearInterval(this.timerInterval);
	};

	getNineLetterWord = () => {
		let word = JSON.parse(localStorage.getItem("LettersData")).NineWord;
		return word;
	};

	handleKeyPress = (event) => {
		let userLetters = this.state.userLetters;

		if (
			!this.state.postRound1 &&
			!this.state.postRound2 &&
			!this.state.postRound3
		) {
			for (let i = userLetters.length - 1; i >= 0; i--) {
				if (event.key === userLetters[i].char.toLowerCase()) {
					this.createInput(userLetters[i]);
					break;
				}
			}
		}

		if (
			!this.state.postRound1 &&
			!this.state.postRound2 &&
			!this.state.postRound3
		) {
			if (event.key === "Enter") {
				this.handleSubmit();
			}

			if (event.key === " ") {
				this.Shuffle();
			}
		}

		if (event.key === "Backspace") {
			this.backSpace();
		}
		this.setState({ userLetters });
	};

	createShare = () => {
		let games = [];
		let finalString = "";

		if (localStorage.getItem("Games")) {
			games = JSON.parse(localStorage.getItem("Games"));
			let obj = games[games.length - 1];
			let date = this.NormalDate(obj.date);
			let win = obj.nineWin;
			let lettersData = JSON.parse(
				localStorage.getItem("LettersData")
			).NineWord.toUpperCase();
			const emojiArray = "🄰 🄱 🄲 🄳 🄴 🄵 🄶 🄷 🄸 🄹 🄺 🄻 🄼 🄽 🄾 🄿 🅀 🅁 🅂 🅃 🅄 🅅 🅆 🅇 🅈 🅉";

			if (win === 1)
				finalString =
					"I solved " +
					date +
					"'s Anagram on Scramble: " +
					"\n\n" +
					this.matchToEmojis(this.scramble(lettersData), emojiArray) +
					"\n\n" +
					"Do you think you can solve it?" +
					"\n\n" +
					"https://anagram-scramble.com";
			else
				finalString =
					"I couldn't solved " +
					date +
					"'s Anagram on Scramble: " +
					"\n\n" +
					this.matchToEmojis(this.scramble(lettersData), emojiArray) +
					"\n\n" +
					"Do you think you can solve it?" +
					"\n \n" +
					"https://anagram-scramble.com";
		}

		copy(finalString);
		alert("Copied to Clipboard! You can now share it");
	};

	matchToEmojis = (text, emojiArray) => {
		const normalText = text.toUpperCase(); // Convert input text to uppercase for matching
		const emojis = emojiArray.split(" "); // Split the emoji string into an array

		const matchedEmojis = normalText
			.split("")
			.map((char) => {
				// Check if the character is a letter
				if (/[A-Z]/.test(char)) {
					// Get the index of the character in the alphabet
					const index = char.charCodeAt(0) - 65;
					// If the index is valid, return the corresponding emoji, else return the original character
					return index >= 0 && index < emojis.length ? emojis[index] : char;
				} else {
					// If it's not a letter, keep the character as is
					return char;
				}
			})
			.join(" ");

		return matchedEmojis;
	};

	NormalDate = (inputDate) => {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		const dateParts = inputDate.split("-");
		const year = dateParts[0];
		const month = months[Number(dateParts[1]) - 1];
		const day = Number(dateParts[2]);

		const dayWithSuffix = this.getDayWithSuffix(day);

		return `${month} ${dayWithSuffix}, ${year}`;
	};

	getDayWithSuffix = (day) => {
		if (day >= 11 && day <= 13) {
			return `${day}th`;
		}
		switch (day % 10) {
			case 1:
				return `${day}st`;
			case 2:
				return `${day}nd`;
			case 3:
				return `${day}rd`;
			default:
				return `${day}th`;
		}
	};

	scramble = (str) => {
		// Split the string into an array of characters
		const arr = str.split("");

		// Scramble the letters using array sort (randomizing)
		const scrambled = arr.sort(() => Math.random() - 0.5).join("");

		return scrambled;
	};

	render() {
		return (
			<React.Fragment>
				{this.state.loadScreen && (
					<div className="loadScreen">
						<img src={load} alt="Loading..." />
						<h4>Checking dictionaries...</h4>
					</div>
				)}

				<div className="home">
					<div className="mainBox">
						<div className="round">
							<h3>Round</h3>
							<span className="currRound">
								{this.state.postRound2 === false &&
									this.state.postRound3 === false &&
									this.state.round2 === false &&
									this.state.round3 === false &&
									1}
								{this.state.round2 && this.state.round3 === false
									? 2
									: this.state.postRound2 && 2}

								{this.state.round2 === false && this.state.round3
									? 3
									: this.state.postRound3 && 3}
							</span>
							<span className="of">of</span>
							<span className="totalRounds">3</span>
						</div>

						<div className="objective">
							{!this.state.postRound2 &&
								!this.state.postRound3 &&
								this.state.round2 === false &&
								this.state.round3 === false && (
									<h1>Create a word that generates the most points</h1>
								)}
							{this.state.round2 && this.state.round3 === false ? (
								<h1 className="round2">
									Choose the type of letters you want, then create a word that
									scores the most points.
								</h1>
							) : (
								this.state.postRound2 && (
									<h1 className="round2">
										Choose the type of letters you want, then create a word that
										scores the most points.
									</h1>
								)
							)}

							{this.state.round2 === false && this.state.round3 ? (
								<h1>Guess the nine letter word.</h1>
							) : (
								this.state.postRound3 && <h1>Guess the nine letter word.</h1>
							)}

							<p>Score: {this.state.totalScore}</p>
							{this.state.timed && (
								<div className="timer">
									{this.state.timer >= 10 && (
										<p>
											{" "}
											<img src={clock} alt="" />
											{this.state.timer}s
										</p>
									)}
									{this.state.timer < 10 && this.state.timer > 5 && (
										<p className="hot">
											{" "}
											<img src={clock} alt="" />
											{this.state.timer}s
										</p>
									)}
									{this.state.timer < 6 && this.state.timer > 0 && (
										<p className="hotter">
											{" "}
											<img src={clock} alt="" />
											{this.state.timer}s
										</p>
									)}
								</div>
							)}
						</div>
					</div>

					<hr className="break"></hr>

					{/* Round 1 */}

					{!this.state.postRound1 &&
					!this.state.postRound2 &&
					!this.state.postRound3 &&
					this.state.round2 === false &&
					this.state.round3 === false ? (
						<React.Fragment>
							<div className="board">
								<div className="inputLetters">
									{" "}
									{this.state.inputLetters.map((e) => this.removeChar(e))}
									<button
										className="function input"
										onClick={() => this.backSpace()}
									>
										<img src={back} alt="back" />
										Backspace
									</button>
								</div>
							</div>

							<div className="board">
								<div className="userLetters">
									{this.state.userLetters.map((e) => this.renderChar(e))}
									<button className="function" onClick={() => this.Shuffle()}>
										<img src={shuffle} alt="shuffle" />
										Shuffle
									</button>
								</div>
							</div>

							{this.state.inputLetters.length >= 2 ? (
								<button onClick={() => this.handleSubmit()} className="submit">
									Submit <img src={play} alt="play" />
								</button>
							) : (
								<button className="submit disabled">
									Submit <img src={play} alt="play" />
								</button>
							)}
						</React.Fragment>
					) : (
						this.state.postRound1 && (
							<React.Fragment>
								<div className="postRound">
									<h2>
										You gained{" "}
										{this.state.round1Score === 0 ? (
											<span>{this.state.round1Score} </span>
										) : (
											<span className="goodScore">
												+{this.state.round1Score}{" "}
											</span>
										)}
										points{" "}
									</h2>

									<div className="wordCard">
										<h1>
											{this.state.round1Word.word}{" "}
											{this.state.round1Word.meaning !== "" && (
												<span className="type">
													{this.state.round1Word.type}
												</span>
											)}
										</h1>
										<p>
											{this.state.round1Word.meaning !== "" ? (
												this.state.round1Word.meaning
											) : (
												<span className="DNE">
													This word does not exist in the dictionary.
												</span>
											)}
										</p>
									</div>

									<button onClick={() => this.advance2Round2()}>
										Advance to the next round <img src={play} alt="play" />
									</button>
								</div>
							</React.Fragment>
						)
					)}

					{/* Round 2 */}
					{!this.state.postRound1 &&
					!this.state.postRound2 &&
					this.state.round2 &&
					this.state.round3 === false ? (
						<React.Fragment>
							<div className="pickLetter">
								<h2>Pick the letter type</h2>
								{this.state.vowel === false ? (
									<button onClick={() => this.addVowel()}>Vowel</button>
								) : (
									<button className="disabled">Vowel</button>
								)}

								{this.state.constant === false ? (
									<button onClick={() => this.addConstant()}>Consonant</button>
								) : (
									<button className="disabled">Consonant</button>
								)}
							</div>

							{this.state.vowel && this.state.constant && (
								<React.Fragment>
									<div className="board">
										<div className="inputLetters">
											{" "}
											{this.state.inputLetters.map((e) => this.removeChar(e))}
											<button
												className="function input"
												onClick={() => this.backSpace()}
											>
												<img src={back} alt="back" />
												Backspace
											</button>
										</div>
									</div>{" "}
								</React.Fragment>
							)}

							{this.state.vowel && this.state.constant ? (
								<div className="board">
									<div className="userLetters">
										{this.state.userLetters.map((e) => this.renderChar(e))}
										<button className="function" onClick={() => this.Shuffle()}>
											<img src={shuffle} alt="shuffle" />
											Shuffle
										</button>
									</div>
								</div>
							) : (
								<div className="board">
									<div className="userLetters">
										{this.state.userLetters.map((e) => this.renderFake(e))}
										<button className="function" onClick={() => this.Shuffle()}>
											<img src={shuffle} alt="shuffle" />
											Shuffle
										</button>
									</div>
								</div>
							)}

							{this.state.inputLetters.length >= 2 ? (
								<button onClick={() => this.handleSubmit()} className="submit">
									Submit <img src={play} alt="play" />
								</button>
							) : (
								<button className="submit disabled">
									Submit <img src={play} alt="play" />
								</button>
							)}
						</React.Fragment>
					) : (
						this.state.postRound2 && (
							<React.Fragment>
								<div className="postRound">
									<h2>
										You gained{" "}
										{this.state.round1Score === 0 ? (
											<span>{this.state.round1Score} </span>
										) : (
											<span className="goodScore">
												+{this.state.round1Score}{" "}
											</span>
										)}
										points{" "}
									</h2>

									<div className="wordCard">
										<h1>
											{this.state.round1Word.word}{" "}
											{this.state.round1Word.meaning !== "" && (
												<span className="type">
													{this.state.round1Word.type}
												</span>
											)}
										</h1>
										<p>
											{this.state.round1Word.meaning !== "" ? (
												this.state.round1Word.meaning
											) : (
												<span className="DNE">
													This word does not exist in the dictionary.
												</span>
											)}
										</p>
									</div>

									<button onClick={() => this.advance2Round3()}>
										Advance to the next round <img src={play} alt="play" />
									</button>
								</div>
							</React.Fragment>
						)
					)}

					{/* Round 3 */}
					{!this.state.postRound1 &&
					!this.state.postRound2 &&
					!this.state.postRound3 &&
					this.state.round2 === false &&
					this.state.round3 ? (
						<React.Fragment>
							<div className="board">
								<div className="inputLetters">
									{" "}
									{this.state.inputLetters.map((e) => this.removeChar(e))}
									<button
										className="function input"
										onClick={() => this.backSpace()}
									>
										<img src={back} alt="back" />
										Backspace
									</button>
								</div>
							</div>

							<div className="board">
								<div className="userLetters">
									{this.state.userLetters.map((e) => this.renderChar(e))}
									<button className="function" onClick={() => this.Shuffle()}>
										<img src={shuffle} alt="shuffle" />
										Shuffle
									</button>
								</div>
							</div>

							{this.state.inputLetters.length >= 9 ? (
								<button onClick={() => this.handleSubmit()} className="submit">
									Submit <img src={play} alt="play" />
								</button>
							) : (
								<button className="submit disabled">
									Submit <img src={play} alt="play" />
								</button>
							)}
						</React.Fragment>
					) : (
						this.state.postRound3 && (
							<React.Fragment>
								{this.state.showSheet && (
									<div className="totalScoreSheet">
										<h1>Scoresheet</h1>
										<button
											onClick={() => this.handleHideSheet()}
											className="hide"
										>
											x
										</button>
										<table>
											<tbody>
												<tr>
													<th>Best Word</th>
													<td className="thisisIt">{this.getBestWord()}</td>
												</tr>
												<tr>
													<th>Today's Points</th>
													<td>{this.state.totalScore}</td>
												</tr>
												<tr>
													<th>Average Points</th>
													<td>{this.calcAllTimeAverage()}</td>
												</tr>
												<tr>
													<th>Weekly Average</th>
													<td>{this.calcWeekAverage()}</td>
												</tr>
												<tr>
													<th>9-L word wins</th>
													<td>{this.calcGamesWon()}</td>
												</tr>
												<tr>
													<th>Games Played</th>
													<td>{this.gamesPlayed()}</td>
												</tr>
											</tbody>
										</table>

										<h3>
											<button
												onClick={() => this.createShare()}
												className="share"
											>
												Share
											</button>
										</h3>
									</div>
								)}

								<div className="postRound">
									<h2>
										You gained{" "}
										{this.state.round1Score === 0 ? (
											<React.Fragment>
												<span>{this.state.round1Score} </span> points.
											</React.Fragment>
										) : (
											<React.Fragment>
												<span className="goodScore">
													+{this.state.round1Score}
												</span>{" "}
												points. You guessed today's nine letter word Correctly!
											</React.Fragment>
										)}
									</h2>

									<div className="wordCard">
										<h1>
											{this.state.round1Word.word}{" "}
											{this.state.round1Word.meaning !== "" && (
												<span className="type">
													{this.state.round1Word.type}
												</span>
											)}
										</h1>
										<p>
											{this.state.round1Word.meaning !== "" ? (
												this.state.round1Word.meaning
											) : (
												<span className="DNE">
													The word was{" "}
													<span className="colored">
														{this.getNineLetterWord()}
													</span>
													. You did not guess today's word correctly.
												</span>
											)}
										</p>
									</div>

									<button onClick={() => this.handleShowSheet()}>
										Show Scoresheet
									</button>
								</div>
							</React.Fragment>
						)
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default Home;
