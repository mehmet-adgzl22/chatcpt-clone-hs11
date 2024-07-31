//! HTML'den Gelenler !//
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const defaultText = document.querySelector(".default-text");
const deleteButton = document.querySelector("#delete-btn");
const container = document.querySelector(".container");
let userText = null;

//! Fonksiyonlar !//


const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
  
    return chatDiv;
  };
  
  const getChatResponse = async (incomingChatDiv) => {
    const pElement = document.createElement("p");
    const url = "https://chatgpt-42.p.rapidapi.com/geminipro";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "17bfa31bbbmsh1355592a7405f9bp1dd229jsnd7e87c1e1260",
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `${userText}`,
          },
        ],
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
        web_access: false,
      }),
    };
    try {
     
      const response = await fetch(url, options);
      const data = await response.json();

      pElement.innerText = data.result;
    } catch (error) {
      console.log(error);
    }
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatInput.value = null;
    saveChatHistory();
  };
  
  const showTypingAnimation = () => {
    const html = `
           <div class="chat-content">
            <div class="chat-details">
              <img src="./images/chatbot.jpg" alt="" />
              <div class="typing-animation">
                <div class="typing-dot" style="--delay: 0.2s"></div>
                <div class="typing-dot" style="--delay: 0.3s"></div>
                <div class="typing-dot" style="--delay: 0.4s"></div>
              </div>
            </div>
          </div>
      
      `;
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    getChatResponse(incomingChatDiv);
  };
  
  const handleOutGoingChat = () => { 
    userText = chatInput.value.trim();
    if (!userText) {
      alert("Bir veri giriniz!");
      return;
    }
    const html = `
       <div class="chat-content">
          <div class="chat-details">
              <img src="./images/user-2.jpg" alt="" />
              <p>react nedir</p>
          </div>
      </div>
    `;
    const outgoingChatDiv = createElement(html, "outgoing");
    defaultText.remove();
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);
  };
  
  //! Olay İzleyicileri !//
  sendButton.addEventListener("click", handleOutGoingChat);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleOutGoingChat();
    }
  });
 
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeButton.innerText = document.body.classList.contains("light-mode")
      ? "dark_mode"
      : "light_mode";
  });
  
  deleteButton.addEventListener("click", () => {
    
    if (confirm("Tüm sohbetleri silmek istediğinizden emin misiniz?")) {
      chatContainer.remove();
      localStorage.removeItem("chatHistory");
    }
  
    const defaultText = `
       <div class="default-text">
        <h1>ChatGPT Clone</h1>
      </div>
      <div class="chat-container"></div>
        <div class="typing-container">
        <div class="typing-content">
          <div class="typing-textarea">
            <textarea
              id="chat-input"
              placeholder="Aratmak istediğiniz veriyi giriniz..."
            ></textarea>
            <span class="material-symbols-outlined" id="send-btn"> send </span>
          </div>
          <div class="typing-controls">
            <span class="material-symbols-outlined" id="theme-btn">
              light_mode
            </span>
            <span class="material-symbols-outlined" id="delete-btn">
              delete
            </span>
          </div>
        </div>
      </div>
  
    `;
    document.body.innerHTML = defaultText;
  });

  const saveChatHistory = () => {
    localStorage.setItem("chatHistory", chatContainer.innerHTML);
  };
  
  const loadChatContainer = () => {
    const chatHistory = localStorage.getItem("chatHistory");
    if (chatHistory) {
      chatContainer.innerHTML = chatHistory;
      defaultText.remove();
    }
  };
  
  document.addEventListener("DOMContentLoaded", loadChatContainer);