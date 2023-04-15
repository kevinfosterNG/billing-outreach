import { CosmosClient, Database, Container } from "@azure/cosmos";

const newMessageUrl = "/api/messages/sendMessage"
//const newMessageUrl = "http://io-interface01:8787/api/messages/sendMessage"

export  default async function MessagePage() {

    const messageOptions = await getMessageOptions("MessageMaster") || [];
    console.log(messageOptions[0]);

    return (
      <form action={newMessageUrl} method="post" name="formNewMessage">

        <label htmlFor="to">To:</label>
        <input type="text" placeholder="+15551234567" name="to" id="to" required
          //value={to}
          //onChange={(e) => setTo(e.target.value)}
        />

        <br />

        <select name="messageOptions">
          {messageOptions.map(o => <option value={o.id}>{o.description}</option>)}
        </select>

        <br />
        
        <button type="submit">Submit</button>
      </form>
    )
}

async function getMessageOptions(containerName) {
  //console.log("getMessageOptions() called...");

  //console.log("getCosmosClient called...");
  const client = getCosmosClient();
  //console.log("Got client: ",client);
  
  //console.log("getCosmosContainer called...");
  const container = getCosmosContainer(client, containerName)
  //console.log("Got container: ", container);

  //Get data out of container
  const data = await getContainerData(container)
    //.then((d) => console.log("Data: ", d));

  //console.log("getMessageOptions() returning...");
  return data;
}

function getCosmosClient() {
  return new CosmosClient({
    key: process.env.COSMOSDB_KEY,
    endpoint: process.env.COSMOSDB_ENDPOINT,
  });
}

function getCosmosContainer(client, container) {
  return client
  .database(process.env.COSMOSDB_DATABASE)
  .container(container);
}

async function getContainerData(container){
  // query to return all children in a family
  const querySpec = {
    query: 'SELECT * FROM c ',  //where c.id=@itemId
    // parameters: [
    //   {
    //     name: "@itemId",
    //     value: itemId
    //   }
    // ]
  }
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;

}