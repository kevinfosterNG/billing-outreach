import { CosmosClient, Database, Container } from "@azure/cosmos";
import { getContainer, getClient, getAllData } from "@/utils/DatabaseWrapper";

export const dynamic = 'force-dynamic'
const newCampaignUrl = "/api/campaign"

export default async function CampaignsPage() {
  const messageOptions = await getCampaigns("Campaigns") || [];

  return (
    <form action={newCampaignUrl} method="post" name="formNewMessage">

      <label htmlFor="to">To:</label>
      <input type="text" placeholder="+15551234567" name="to" id="to" required />
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

async function getCampaigns(containerName) {
  const client = await getClient();
  const container = await getContainer(client, containerName)
  const data = await getAllData(container)
  return data;
}