const chatContainer = document.getElementById("chat-container");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

let previousQuestion = null;
let userName = null;
let randomNumber = null;

// Markov chain data
const markovData = {};

function generateResponse(userMessage) {
  userMessage = userMessage.toLowerCase();
  let response;

  if (previousQuestion && previousQuestion.includes("what's your name")) {
    userName = userMessage;
    response = `Nice to meet you, ${userName}! How can I assist you today?`;
  } else if (userMessage.includes("hello") || userMessage.includes("hi")) {
    if (userName) {
      response = `Hello, ${userName}! How can I help you?`;
    } else {
      response = "Hello!";
    }
  } else if (userMessage.includes("+") || userMessage.includes("-") || userMessage.includes("*") || userMessage.includes("/")) {
    try {
      // Use eval() function to evaluate the expression and return the result as a response
      response = eval(userMessage) + " 🤗";
    } catch (error) {
      response = "Sorry, I couldn't evaluate that expression. 😔";
    }
  } else if (userMessage.includes("how are you")) {
    response = "I'm doing well, thank you for asking! How are you? 😀";
  } else if (userMessage.includes("what is your name")) {
    response = "My name is June, and I'm an AI-powered assistant designed to help you find information. 😀";
  } else if (userMessage.includes("who are you")) {
    response = "My name is June, and I'm an AI-powered assistant designed to help you find information. 😀";
  } else if (userMessage.includes("no")) {
    response = "Oh!";
  } else if (userMessage.includes("thanks")) {
    response = "No problem 😊";
  } else if (userMessage.includes("thank you")) {
    response = "No problem 😊";
  } else if (userMessage.startsWith("what is") || userMessage.startsWith("who was")) {
    const query = userMessage.replace("what is", "").replace("who was", "");
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`)
      .then(response => response.json())
      .then(data => {
        response = data.extract;
        if (previousQuestion && previousQuestion.includes("tell me more")) {
          response += ` ${data.content_urls.desktop.page}`;
        }
        previousQuestion = userMessage;
        displayMessage(response, "bot");
      })
      .catch(error => {
        response = "I'm sorry, I couldn't find any information on that.";
        displayMessage(response, "bot");
      });
    return;
  } else if (userMessage.toLowerCase().includes("time")) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    response = `The current time is ${time}`;
  } else if (userMessage.toLowerCase().includes("i feel")) {
    const emotion = userMessage.toLowerCase().split("i feel ")[1];
    if (emotion.includes("happy") || emotion.includes("glad")) {
      response = "That's great to hear! 😁";
    } else if (emotion.includes("sad") || emotion.includes("unhappy")) {
      response = "I'm sorry to hear that. Is there anything I can do to help?";
    } else if (emotion.includes("angry") || emotion.includes("frustrated")) {
      response = "I'm sorry to hear that you're feeling that way. Can you tell me more about what's bothering you?";
    } else {
      response = "Thank you for sharing your feelings with me.";
    }
  } else if (userMessage.toLowerCase().includes("gen")) {
    response = generateSentence();
  } else if (userMessage.includes("guess")) {
    response = playNumberGuessingGame(userMessage);
  } else if (userMessage.includes("how old are you")) {
    response = "I don't have an age as I am an AI, but I was created in 2021.";
  } else if (userMessage.includes("where are you from")) {
    response = "I am a virtual assistant, so I don't have a physical location. But I am here to help you!";
  } else if (userMessage.includes("tell me a joke")) {
    response = "Sure, here's a joke for you: Why don't scientists trust atoms? Because they make up everything!";
  } else if (userMessage.includes("what's your favorite color")) {
    response = "As an AI, I don't have personal preferences, including favorite colors.";
  } else if (userMessage.includes("what can you do")) {
    response = "I can answer questions, provide information, do basic calculations, and have conversations with you.";
  } else {
    response = "I'm sorry, I don't understand. Can you please rephrase your question?";
  }

  previousQuestion = userMessage;
  displayMessage(response, "bot");
}

function displayMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender);

  if (sender === "user") {
    messageElement.innerText = "User: " + message; // prepend "User: " to user messages
  } else {
    messageElement.innerText = "JuneAI: " + message; // prepend "JuneAI: " to bot messages
  }

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function trainMarkovChain(text) {
  const words = text.toLowerCase().split(/\s+/);

  for (let i = 0; i < words.length - 1; i++) {
    const currentWord = words[i];
    const nextWord = words[i + 1];

    if (!markovData[currentWord]) {
      markovData[currentWord] = [];
    }

    markovData[currentWord].push(nextWord);
  }
}

function generateSentence() {
  const startWords = Object.keys(markovData);
  let currentWord = startWords[Math.floor(Math.random() * startWords.length)];
  let sentence = currentWord;

  for (let i = 0; i < 200; i++) {
    const nextWords = markovData[currentWord];
    if (!nextWords) {
      break;
    }

    const nextWord = nextWords[Math.floor(Math.random() * nextWords.length)];
    sentence += " " + nextWord;
    currentWord = nextWord;
  }

  return sentence;
}

function playNumberGuessingGame(userMessage) {
  if (!randomNumber) {
    randomNumber = Math.floor(Math.random() * 10) + 1;
    return "I'm thinking of a number between 1 and 10. Can you guess what it is?";
  } else {
    const userGuess = parseInt(userMessage.match(/\d+/)[0], 10);
    if (userGuess === randomNumber) {
      randomNumber = null;
      return "Congratulations! You guessed the correct number.";
    } else if (userGuess < randomNumber) {
      return "Nope, try guessing a little higher.";
    } else if (userGuess > randomNumber) {
      return "Nope, try guessing a little lower.";
    } else {
      return "Please enter a valid number.";
    }
  }
}

function getRandomResponse() {
  const responses = [
    "Interesting, tell me more.",
    "I'm not sure, could you provide more information?",
    "I'll need more context to answer that.",
    "I'm sorry, I don't have that information at the moment.",
    "Let me check on that for you.",
    "I'm afraid I can't answer that question.",
    "I'm always here to help! What else would you like to know?",
    "That's a good question. Give me a moment to think.",
    "I'm sorry, I didn't understand that. Could you rephrase it?",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Train the Markov chain with a text file (replace 'path/to/text/file.txt' with the actual path)
fetch('file.txt')
  .then(response => response.text())
  .then(text => {
    trainMarkovChain(text);
  })
  .catch(error => {
    console.log('Failed to fetch or parse the text file:', error);
  });

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  const userMessage = userInput.value;
  displayMessage(userMessage, "user");
  generateResponse(userMessage);
  userInput.value = "";
});
