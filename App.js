import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Ably from 'ably';

const ably = new Ably.Realtime('your-ably-api-key');
const channel = ably.channels.get('chat');

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch messages from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/messages')
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
    
    // Listen for real-time messages
    channel.subscribe('newMessage', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg.data]);
    });
  }, []);

  // Send a new message
  const sendMessage = () => {
    if (message.trim()) {
      axios.post('http://localhost:5000/messages', { text: message })
        .then((response) => {
          setMessage('');
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    }
  };

  return (
    <div className="App">
      <h1>Real-time Chat</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
