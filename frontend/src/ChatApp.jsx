// ChatApp.jsx
import React, { useState, useEffect } from 'react';
import { ChatServiceClient } from './proto/ChatServiceClientPb';
import { ChatMessage } from './proto/chat_pb';

const client = new ChatServiceClient('http://localhost:8080'); // Envoy proxy address

function ChatApp() {
	const [username, setUsername] = useState("Toto");
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const stream = client.chatStream();

		stream.on('data', (res) => {
			setMessages(prev => [...prev, {
				user: res.getUser(),
				text: res.getMessage()
			}]);
		});

		stream.on('error', (err) => {
			console.error("Stream error:", err);
		});

		return () => stream.cancel(); // Clean up
	}, []);

	const sendMessage = () => {
		const msg = new ChatMessage();
		msg.setUser(username);
		msg.setMessage(input);
		msg.setTimestamp(Date.now());
		client.chatStream().write(msg);
		setInput("");
	};

	return (
		<div className="p-4 h-screen bg-gray-100 flex flex-col">
			<div className="text-2xl font-bold mb-4">💬 gRPC Chat</div>
			<div className="flex-1 bg-white overflow-y-auto rounded shadow p-3">
				{messages.map((m, i) => (
					<div key={i}><b>{m.user}:</b> {m.text}</div>
				))}
			</div>
			<div className="mt-2 flex">
				<input
					value={input}
					onChange={e => setInput(e.target.value)}
					className="flex-1 border p-2 rounded"
					placeholder="Type message..."
				/>
				<button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
					Send
				</button>
			</div>
		</div>
	);
}

export default ChatApp;

