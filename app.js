const chatContainer = document.getElementById("chat-container");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

let previousQuestion = null;
let userName = null;
let randomNumber = null;

// Markov chain data
const markovData = {};

function speak(message) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  }
}
function sendSMS(message) {
  const url = `sms:?body=${encodeURIComponent(message)}`;
  window.location.href = url;
}
function fetchCountryCapital(country) {
  return fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => response.json())
    .then(data => {
      const capital = data[0].capital;
      return capital;
    })
    .catch(error => {
      console.log("Error while fetching country capital:", error);
      return null;
    });
}

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
  } else if (userMessage.includes("help")) {
    response = "Of course! I'm here to help. What do you need assistance with?";
} else if (userMessage.includes("can you recommend")) {
    response = "Sure! What kind of recommendation are you looking for?";
} else if (userMessage.includes("weather")) {
    response = "I'm sorry, I don't have access to real-time weather information. You can check a weather website or app for the current weather conditions.";
} else if (userMessage.includes("how can I contact you")) {
    response = "I'm an AI assistant, so you can interact with me through this chat interface. How can I assist you?";
} else if (userMessage.includes("how does this work")) {
    response = "I use natural language processing techniques to understand and generate responses based on your inputs. Feel free to ask me questions or engage in a conversation.";
} else if (userMessage.includes("what is the meaning of life")) {
    response = "The meaning of life is a philosophical question that has been debated for centuries. It can have different interpretations depending on personal beliefs and perspectives.";
} else if (userMessage.includes("tell me a fun fact")) {
    response = "Sure, here's a fun fact: The world's oldest known joke is a Sumerian proverb from 1900 BC that says, 'Something which has never occurred since time immemorial; a young woman did not fart in her husband's lap.'";
} else if (userMessage.includes("can you sing")) {
    response = "I'm an AI assistant, so I don't have a singing voice. However, I can help you with information or engage in a conversation.";
    } else if (userMessage.includes("where can I find")) {
    response = "You can try searching on the internet or checking relevant websites or stores near your location.";
} else if (userMessage.includes("tell me a story")) {
    response = "Once upon a time, in a land far away, there was a brave knight who embarked on a quest to save the kingdom from an evil dragon...";
} else if (userMessage.includes("how do I")) {
    response = "To accomplish that, you can follow these steps: [provide step-by-step instructions]";
} else if (userMessage.includes("recommend a book")) {
    response = "What genre or type of book are you interested in? That would help me provide a more relevant recommendation.";
} else if (userMessage.includes("movie recommendation")) {
    response = "Sure! What genre or type of movie are you in the mood for?";
} else if (userMessage.includes("tell me a riddle")) {
    response = "Here's a riddle for you: I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?";
    } else if (userMessage.includes("what's the capital of")) {
  const country = userMessage.split("capital of")[1].trim();
  fetchCountryCapital(country)
    .then(capital => {
      if (capital) {
        response = `The capital of ${country} is ${capital}.`;
      } else {
        response = "Sorry, I couldn't find the capital for that country.";
      }
      displayMessage(response, "bot");
    });
  return;
  } else if (userMessage.startsWith("send")) {
  const message = userMessage.replace("send", "").trim();
  sendSMS(message);
  return;
  } else if (userMessage.includes("guess")) {
    response = playNumberGuessingGame(userMessage);
  } else if (userMessage.includes("say")) {
    const messageToSay = userMessage.replace("say", "");
    speak(messageToSay);
    return;
    } else if (userMessage.startsWith("define")) {
    const word = userMessage.replace("define", "").trim();
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0 && data[0].meanings && data[0].meanings.length > 0) {
          const definition = data[0].meanings[0].definitions[0].definition;
          response = `The definition of ${word} is: ${definition}`;
        } else {
          response = `Sorry, I couldn't find the definition for ${word}.`;
        }
        displayMessage(response, "bot");
      })
      .catch(error => {
        response = "I'm sorry, there was an error retrieving the definition.";
        displayMessage(response, "bot");
      });
    return;
  } else {
    response = "I'm sorry, I don't understand. Can you please rephrase your question?";
  } 

  previousQuestion = userMessage;
  displayMessage(response, "bot");
}


// Function to display a message with typing effect
function displayMessageWithTyping(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender);

  const messageTextElement = document.createElement("p");
  messageElement.appendChild(messageTextElement);

  if (sender === "user") {
    messageTextElement.innerText = "User: " + message; // prepend "User: " to user messages
  } else {
    messageTextElement.innerText = "JuneAI: ";

    // Create a span element for the typing effect
    const typingEffectSpan = document.createElement("span");
    messageTextElement.appendChild(typingEffectSpan);

    // Start the typing effect
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < message.length) {
        typingEffectSpan.innerText += message.charAt(i);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Adjust the typing speed by changing the interval (milliseconds)
  }

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function displayMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender);

  if (sender === "user") {
    messageElement.innerText = "User: " + message; // prepend "User: " to user messages
  } else {
    messageElement.innerText = "JuneAI: ";
    chatContainer.appendChild(messageElement);

    // Simulate typing effect
    let index = 0;
    const typingDelay = 50; // Adjust the typing speed by changing the delay (in milliseconds)

    const typeCharacters = () => {
      if (index < message.length) {
        const character = message[index];
        if (character === " ") {
          messageElement.innerHTML += "&nbsp;"; // Display space as HTML non-breaking space
        } else {
          messageElement.innerText += character;
        }
        index++;
        setTimeout(typeCharacters, typingDelay);
      } else {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };

    setTimeout(typeCharacters, typingDelay);
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
  const words = Object.keys(markovData);
  const startingWord = words[Math.floor(Math.random() * words.length)];

  let sentence = startingWord;
  let currentWord = startingWord;

  while (markovData[currentWord]) {
    const nextWords = markovData[currentWord];
    const nextWord = nextWords[Math.floor(Math.random() * nextWords.length)];

    sentence += " " + nextWord;
    currentWord = nextWord;

    if (sentence.length > 100) {
      break;
    }
  }

  return sentence;
}

function playNumberGuessingGame(userMessage) {
  const number = parseInt(userMessage.split(" ")[1]);

  if (isNaN(number)) {
    return "Please provide a valid number.";
  }

  if (!randomNumber) {
    randomNumber = Math.floor(Math.random() * 100) + 1;
  }

  if (number < randomNumber) {
    return "Too low! Try guessing a higher number.";
  } else if (number > randomNumber) {
    return "Too high! Try guessing a lower number.";
  } else {
    const response = `Congratulations! You guessed the correct number (${randomNumber}). Let me know if you want to play again.`;
    randomNumber = null;
    return response;
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userMessage = userInput.value;
  displayMessage(userMessage, "user");
  userInput.value = "";
  generateResponse(userMessage);
});

// Training the Markov chain data
fetch("file.txt")
  .then(response => response.text())
  .then(text => {
    trainMarkovChain(text);
  })
  .catch(error => {
    console.log("Error while fetching training data:", error);
  });
