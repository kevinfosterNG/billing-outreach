
export default async function MessagePage() {
    return (
      <form action="/api/messages" method="post">


        <label htmlFor="to">To:</label>
        <input 
          type="text"
          placeholder="+15551234567"
          name="to"
          //value={to}
          //onChange={(e) => setTo(e.target.value)}
        />

        <br/>

        <label htmlFor="message">Message:</label>
        <textarea
          placeholder='Message content...'
          name="message"
          //value={message}
          //onChange={(e) => setMessage(e.target.value)}
        />
        
        <button type="submit">Submit</button>
      </form>
    )
}