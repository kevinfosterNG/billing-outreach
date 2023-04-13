const newMessageUrl = "/api/messages/sendMessage"
//const newMessageUrl = "http://io-interface01:8787/api/messages/sendMessage"

export default function MessagePage() {
    return (
      <form action={newMessageUrl} method="post" name="formNewMessage">

        <label htmlFor="to">To:</label>
        <input type="text" placeholder="+15551234567" name="to" id="to" required
          //value={to}
          //onChange={(e) => setTo(e.target.value)}
        />

        <br />

        <label htmlFor="message">Message:</label>
        <select name="message">
          <option value={process.env.BILLING_MESSAGE_OPTIONS_TEST}>Email Option 1A</option>
          <option value={process.env.BILLING_MESSAGE_OPTIONS_1A}>Email Option 1A</option>
          <option value={process.env.BILLING_MESSAGE_OPTIONS_1B}>Email Option 1B</option>
          <option value={process.env.BILLING_MESSAGE_OPTIONS_2A}>Email Option 2A</option>
          <option value={process.env.BILLING_MESSAGE_OPTIONS_2B}>Email Option 2B</option>
          <option value={process.env.BILLING_MESSAGE_OPTIONS_3A}>Email Option 3A</option>
          <option value={process.env.BILLING_MESSAGE_OPTIONS_3B}>Email Option 3B</option>
        </select>
        
        <button type="submit">Submit</button>
      </form>
    )
}