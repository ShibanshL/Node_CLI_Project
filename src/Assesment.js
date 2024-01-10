#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

let userInput = "";

const spinner = createSpinner();

//This func add gaps as the name suggest
function gap() {
  console.log("\n");
}

//You enter the input in with this func here.
async function enterInput() {
  const answers = await inquirer.prompt({
    name: "user_input",
    type: "input",
    message: `Please write the text to be paraphrase btw the length of 0/500?`,
    default() {
      return "User";
    },
  });

  userInput = answers.user_input;

  if (userInput.length < 500) {
    if (userInput.length < 5) {
      gap();
      return console.log(
        chalk.red(
          "Please try again, atleast write a string with minimum of 5 characters."
        )
      );
    }
    question();
  }

  if (userInput.length > 500) {
    gap();
    return console.log(
      chalk.red("Text length is greater than 500 please try again")
    );
  }
}

//This let's you select one of the three options.
async function question() {
  gap();
  const answers = await inquirer.prompt({
    name: "question",
    type: "list",
    message: "Please choose one of the methods for paraphasing \n",
    choices: ["Standard Mode", "Fluent Mode", "Creative Mode"],
  });

  return handleAnswer(answers);
}

//This func creates an object out of our answer and our choice
function handleAnswer(e) {
  let Obj = {
    text: userInput,
    mode: modeCheck(e.question),
  };
  return postData(Obj);
}

//This func based on user choice returns the value that api accepts
function modeCheck(e) {
  if (e == "Standard Mode") {
    return "standard";
  }
  if (e == "Fluent Mode") {
    return "fluency";
  }
  if (e == "Creative Mode") {
    return "creative";
  }

  return "Inavalid Input";
}

//This func post the data to the api
function postData(e) {
  gap();
  spinner.start({ text: "sending request", color: "yellow" });

  fetch("https://paraphraser.prod.hipcv.com/paraphrase", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(e),
  })
    .then((res) => res.json())
    .then((data) => waitforAnswer(data))
    .catch((err) => spinner.error({ text: err.message, color: "red" }));
}

//This func finally formats the data based on the result
function waitforAnswer(e) {
  userInput = e.data.join("");

  if (userInput == "") {
    gap();
    return spinner.stop({
      text: "Please make an actual text and quit messing around.",
      mark: "✘",
      color: "red",
    });
  } else return spinner.stop({ text: userInput, mark: "✔", color: "green" });
}

gap();
enterInput();
