import './App.css'
import io from 'socket.io-client'
import { useState, useEffect } from 'react'

const socket = io('http://localhost:4000')


function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')
  // const [usernames, setUsernames] = useState([])
  // const [isConnected, setIsConnected] = useState(false)


  const handleSubmit = (e) => {
    e.preventDefault()

    if( !username ){
      alert("se requieren un nombre de usuario")
      return
    }else if( !message ){
      return
    }

    socket.emit('message', message, username)
    setMessage('')
    setMessages([...messages, {body: message, from: 'Me', clas:'me'}]) // add message to messages
    
  }

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([...messages, message])
    }
    socket.on('message', receiveMessage) // listen for messages 
    
    return () => {
      socket.off('message', receiveMessage) // clean up
    }
  }, [messages])

  return (
    <div className="App">
      <div className="data">
        <label htmlFor="">Name:</label>
        <input type="text" onChange={e => setUsername(e.target.value)} value={username} id="name"/>
      </div>
      

      <div className="messges">
        {messages.map((message, index) => (
          <div key={index} className={message.clas}>
            <h3 className={message.clas} >{message.from}</h3>
            <p>{message.body}</p>
          </div>
        ))}
      </div>
      

      <form onSubmit={handleSubmit}>
        <input type="text" className='messageIn' onChange={e => setMessage(e.target.value)} value={message}/>
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default App
