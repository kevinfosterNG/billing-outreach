import { CosmosClient, Database, Container } from "@azure/cosmos";
export const dynamic = 'force-dynamic'
const newMessageUrl = "/api/messages/sendMessage"

//const newMessageUrl = "http://io-interface01:8787/api/messages/sendMessage"

export  default async function MessagePage() {
  const messageOptions = await getMessageOptions("MessageMaster") || [];

  return (
    <form action={newMessageUrl} method="post" name="formNewMessage">

      <label htmlFor="to">To:</label>
      <input type="text" placeholder="+15551234567" name="to" id="to" required
        //value={to}
        //onChange={(e) => setTo(e.target.value)}
      />
      <input type="text" placeholder="1234567" name="enc_nbr" id="enc_nbr" required />
      <input type="text" placeholder="0001" name="practice_id" id="practice_id" required />

      <select name="messageOptions">
        {messageOptions.map(o => <option key={o.id} value={o.id} disabled={!o.active} >{o.description}</option>)}
      </select>

      <br />
      
      <button type="submit">Submit</button>
    </form>
  )
}

async function getMessageOptions(containerName) {
  const client = await getCosmosClient();
  const container = await getCosmosContainer(client, containerName)
  const data = await getContainerData(container)
  return data;
}

async function getCosmosClient() {
  return new CosmosClient({
    key: process.env.COSMOSDB_KEY,
    endpoint: process.env.COSMOSDB_ENDPOINT,
  });
}

async function getCosmosContainer(client, container) {
  return client
  .database(process.env.COSMOSDB_DATABASE)
  .container(container);
}

async function getContainerData(container){
  // query to return all children in a family
  const querySpec = {
    query: 'SELECT * FROM c ',
  }
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;

}