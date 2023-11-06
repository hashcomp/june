const chatContainer = document.getElementById("chat-container");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const startRecognitionButton = document.getElementById("start-recognition");

let previousQuestion = null;
let userName = null;
let randomNumber = null;

// Markov chain data
const markovData = {};

function speak(message) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    const voices = speechSynthesis.getVoices();
    
    // Find a female voice
    const femaleVoice = voices.find(voice => voice.lang === 'en-US' && voice.name === 'Karen');
    
    // Set the voice property to the female voice
    utterance.voice = femaleVoice;
    
    speechSynthesis.speak(utterance);
  }
}


function sendSMS(message) {
  const url = `sms:?&body=${encodeURIComponent(message)} sent with JuneAI`;
  window.location.href = url;
}

function searchNearby(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  window.open(url, "_blank");
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
        speak(response);
      })
      .catch(error => {
        console.log("Error while fetching Wikipedia data:", error);
        response = "Sorry, I couldn't find any information on that topic. 😔";
        previousQuestion = userMessage;
        displayMessage(response, "bot");
        speak(response);
      });
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
   } else if (userMessage.includes("how old are you")) {
    response = "I don't have an age as I am an AI, but I was created in 2022.";
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
    } else if (userMessage.includes("where can i find")) {
    const query = userMessage.replace("where can i find", "").trim();
    searchNearby(query);
    response = `Here are the search results for "${query}" on Google Maps.`;
  } else if (userMessage.includes("tell me a story")) {
    response = "Once upon a time, in a land far away, there was a brave knight who embarked on a quest to save the kingdom from an evil dragon...";
} else if (userMessage.includes("tell me a riddle")) {
    response = "Here's a riddle for you: I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?";
    } else if (userMessage.includes("nevermind")) {
    response = "Oh Ok 🫢";
    } else if (userMessage.includes("huh")) {
    response = "Oh Ok 🫢";
  } else if (userMessage.includes("capital of")) {
    const country = userMessage.replace("capital of", "").trim();
    fetchCountryCapital(country)
      .then(capital => {
        if (capital) {
          response = `The capital of ${country} is ${capital}.`;
        } else {
          response = "Sorry, I couldn't find the capital of that country. 😔";
        }
        previousQuestion = userMessage;
        displayMessage(response, "bot");
        speak(response);
      });
    return;
  } else if (userMessage.includes("nearest")) {
    const query = userMessage.replace("nearest", "").trim();
    searchNearby(query);
    response = `Here are the search results for "${query}" on Google Maps.`;
  } else if (userMessage.includes("send")) {
    const message = userMessage.replace("send", "").trim();
    sendSMS(message);
    response = `Sending Message: "${message}"`;
  } else if (userMessage.includes("random number")) {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    response = `The random number is ${randomNumber}.`;
  } else if (userMessage.includes("guess") && randomNumber !== null) {
    const guess = parseInt(userMessage.replace("guess", "").trim());
    if (isNaN(guess)) {
      response = "Please enter a valid number.";
    } else if (guess < randomNumber) {
      response = "Too low! Guess a higher number.";
    } else if (guess > randomNumber) {
      response = "Too high! Guess a lower number.";
    } else {
      response = "Congratulations! You guessed the correct number.";
      randomNumber = null;
    }
  } else {
    // Eliza-like response
    const elizaResponses = [
      "Why do you say that?",
      "How does that make you feel?",
      "Tell me more about it.",
      "What do you think about it?",
      "I'm here to listen. Please go on.",
      "Can you elaborate on that?",
      "Why do you think that is?",
      "It sounds interesting. Please continue.",
    ];

    const endsWithQuestionMark = userMessage.endsWith("?");

    if (endsWithQuestionMark) {
      response = "Why are you asking me this question?";
    } else {
      response = elizaResponses[Math.floor(Math.random() * elizaResponses.length)];
    }
  }

  previousQuestion = userMessage;
  displayMessage(response, "bot");
  speak(response);
}

function displayMessage(message, sender) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message", sender);
  messageContainer.textContent = message;
  chatContainer.appendChild(messageContainer);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleFormSubmit(event) {
  event.preventDefault();
  const userMessage = userInput.value;
  if (userMessage) {
    displayMessage(userMessage, "user");
    userInput.value = "";
    generateResponse(userMessage);
  }
}
const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

// Handle speech recognition results
recognition.onresult = function (event) {
  const interimTranscript = "";
  for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      // If a final result is received, update the user input field and submit the form.
      userInput.value = transcript;
      chatForm.dispatchEvent(new Event('submit'));
    } else {
      // If an interim result is received, update the interim transcript.
      interimTranscript += transcript;
    }
  }
};

// Start and stop speech recognition
startRecognitionButton.addEventListener('click', function () {
  if (recognition.lang) {
    // If recognition is already started, stop it.
    recognition.stop();
    startRecognitionButton.textContent = "Start Speech Recognition";
  } else {
    // If recognition is not started, start it.
    recognition.lang = 'en-US'; // Set the desired language
    recognition.start();
    userInput.value = ""; // Clear the user input field
    startRecognitionButton.textContent = "Stop Speech Recognition";
  }
});

chatForm.addEventListener("submit", handleFormSubmit);
