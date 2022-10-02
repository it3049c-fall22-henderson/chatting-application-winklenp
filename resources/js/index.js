const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");
const chatBox = document.getElementById("chat");
let isStored = false;

async function updateMessages() {
  // Fetch Messages
  const messages = await fetchMessages();
  // Loop over the messages. Inside the loop we will:
      // get each message
      // format it
      // add it to the chatbox
  let formattedMessages = "";
  messages.forEach(message => {
      formattedMessages += formatMessage(message, nameInput.value);
  });
  chatBox.innerHTML = formattedMessages;
}

const serverURL = `https://it3049c-chat-application.herokuapp.com/messages`;

function fetchMessages() {
    return fetch(serverURL)
        .then( response => response.json())
}
function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  if (myNameInput === message.sender) {
      return `
      <div class="mine messages">
          <div class="message">
              ${message.text}
          </div>
          <div class="sender-info">
              ${formattedTime}
          </div>
      </div>
      `
  } else {
      return `
          <div class="yours messages">
              <div class="message">
                  ${message.text}
              </div>
              <div class="sender-info">
                  ${message.sender} ${formattedTime}
              </div>
          </div>
      `
  }
}
function sendMessages(username, text) {
    if (nameInput != null) 
    {
        const newMessage = {
            sender: username,
            text: text,
            timestamp: new Date()
        }
      
        fetch (serverURL, {
            method: `POST`, 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
        });
    } else {
        console.log('preventing messages until name inputted');
    }

}
sendButton.addEventListener("click", function(sendButtonClickEvent) {
    if (nameInput.value != "" && isStored == true) 
    {
        sendButtonClickEvent.preventDefault();
        const sender = nameInput.value;
        const message = myMessage.value;

        sendMessages(sender,message);
        myMessage.value = "";
    } else {
        console.log('preventing messages until name inputted and saved');
    }
});
saveButton.addEventListener("click", function(saveButtonClickEvent) {
    if (nameInput.value != "")
    {
        localStorage.setItem('username', `${nameInput.value}`);
    }
    console.log('username: ' + localStorage.getItem('username') + ' saved to storage');
    isStored = true;
        
    
});
deleteButton.addEventListener("click", function(deleteButtonClickEvent) {
    let tempUser = localStorage.getItem('username');
    localStorage.removeItem('username');
    console.log('Username: ' + tempUser + ' removed');
    isStored = false;
})

updateMessages();
setInterval(updateMessages, 10000);