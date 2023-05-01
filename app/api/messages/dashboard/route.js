import { CosmosClient, Database, Container } from "@azure/cosmos";
import { NextResponse } from 'next/server';
import { Twilio } from "twilio";
export const dynamic = 'force-dynamic'

export async function GET(req) {
  const url = req.nextUrl;
  const params = url.searchParams;

  if ( params.get('refresh') == null || !params.get('refresh') )
  {
    console.log("[GET] /api/messages/dashboard    (from CosmosDB)");
    const messages = await getMessageOptions("Messages");
    //console.log("\t# of messages = ", messages.length);
    //console.log("API got data type: ", typeof( messages ));
  
    return NextResponse.json(messages);
  } else if ( (params.get('refresh'))) {
    //console.log("[GET] /api/messages/dashboard?refresh=true    (from Twilio and NGE)");
    let refresh = await fetchRefreshData("Messages");
    //console.log("refresh status: ", refresh);
    return NextResponse.json("success");
  } else {
    return NextResponse.json("failure");
  }
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
      query: "SELECT m.message_type, IS_DEFINED(m.message_clicks.isClicked) AS isClicked, COUNT(m.id) AS cnt, SUM(m.payments.paid_amt) AS paid_amt, SUM(m.cost) AS cost "+
      "FROM Messages m "+
      "WHERE m.id<>'SMxxx' "+
      "GROUP BY m.message_type, m.message_clicks.isClicked",
    }
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  
  }

  async function fetchRefreshData(containerName){
    const client = await getCosmosClient();
    const container = await getCosmosContainer(client, containerName)

    //get all Twilio messages
    // query to return all children in a family
    const querySpec = {
      query: "SELECT * FROM c "
        //+'WHERE c.id IN ("SMf65433ad096037ec44adb76f9ecd6f8c","SMf0cc612ebca09604569d2e454ed71927","SMf88e2905be89c2e0a38f0ea4a88539be","SMf8b873e08710d2a89db9e868b8956e49")'
        +"WHERE c.id<>'SMxxx' "
        +"AND NOT(IS_DEFINED(c.cost)) OR NOT(IS_DEFINED(c.payments))"
        //+"AND c.id='SM4a6748855390ed9cf7714b13aade75ff'"
    }
    const { resources } = await container.items.query(querySpec).fetchAll();
    //console.log("Got resources: ", resources);

    //get balance and cost of each message in database
    for(const msg of resources) {
      try {
      var twillioResponse = await getTwilioMessageCost(msg["id"]);
      //console.log("Twilio responded: ", twillioResponse);
      
      var nextgenResponse = await getNextGenPayment(msg["id"]);
      //console.log("nextgen response: ", nextgenResponse);

      upsertMessageValues(container, {
        "id": msg["id"],
        "trans_date": nextgenResponse["trans_date"] || null,
        "amt": nextgenResponse["amt"] || null,
        "cost":+ twillioResponse || null
      })
    } catch (e_upsertloop) {
      console.error("Failed to gather and upsert data for ", msg["id"]);
      console.error(e_upsertloop);
    }
    }
  }

  async function upsertMessageValues(container, data) {
    //console.log("Upserting data: ", data);
    const c = await container.item( data.id, data.id );
    const {resource} = await c.read();

    const operations = [{ op: 'add',  path: '/payments', value: {}}];

    if (data.cost != null && data.cost != undefined)
      operations.push(      { op: 'add',  path: '/cost', value: data.cost} );

    if(data.trans_date != null && data.trans_date != undefined)
      operations.push( { op: 'add',  path: '/payments/trans_date', value: data.trans_date} );

    if(data.amt != null && data.amt != undefined)
      operations.push( { op: 'add',  path: '/payments/paid_amt', value: data.amt} );
    
    const r = await c.patch( operations );
    return r;
  }

  async function getNextGenPayment(message_sid) {
    //placeholder NGE call:
    const balance_data = [
      {"id":"SM00e5d0c52bf622d1c06afd4a1b1eaf54","trans_date":"2023-04-28","amt":175.69}, //SM00e5d0c52bf622d1c06afd4a1b1eaf54
{"id":"SM033db49a2f237355a870d3ecd305a1a6","trans_date":"2023-04-28","amt":31.97}, //SM033db49a2f237355a870d3ecd305a1a6
{"id":"SM039b776b85c27f38a983dfe79dfddc02","trans_date":"2023-04-28","amt":50.00}, //SM039b776b85c27f38a983dfe79dfddc02
{"id":"SM04a49f139d023c3f7775e486721d80fa","trans_date":"2023-04-28","amt":20.00}, //SM04a49f139d023c3f7775e486721d80fa
{"id":"SM05efecb2aa70c87b741cb5972740efc3","trans_date":"2023-04-28","amt":12.22}, //SM05efecb2aa70c87b741cb5972740efc3
{"id":"SM06224486f59e1a270b3de6399fec7ee4","trans_date":"2023-04-28","amt":10.00}, //SM06224486f59e1a270b3de6399fec7ee4
{"id":"SM0676fa97c80abff20bdeba936e52be43","trans_date":"2023-04-28","amt":25.00}, //SM0676fa97c80abff20bdeba936e52be43
{"id":"SM069fa7a7485fc8f104f393daa0dfe290","trans_date":"2023-04-28","amt":50.00}, //SM069fa7a7485fc8f104f393daa0dfe290
{"id":"SM0834ad4f8924da90ebd01b63ecc9a174","trans_date":"2023-04-28","amt":26.96}, //SM0834ad4f8924da90ebd01b63ecc9a174
{"id":"SM09dc5011fc4fd24fbebfc4545465ff6d","trans_date":"2023-04-28","amt":50.00}, //SM09dc5011fc4fd24fbebfc4545465ff6d
{"id":"SM0a0189c68c137cce972f8f90019a7c74","trans_date":"2023-04-28","amt":15.00}, //SM0a0189c68c137cce972f8f90019a7c74
{"id":"SM0a101ac0969d7aa5ec164be31ba218cf","trans_date":"2023-04-28","amt":32.00}, //SM0a101ac0969d7aa5ec164be31ba218cf
{"id":"SM0beddd0cd42f4d22385fc9bc3365da50","trans_date":"2023-04-28","amt":25.00}, //SM0beddd0cd42f4d22385fc9bc3365da50
{"id":"SM0c61403ed8427a7c561b5bb2ec2690aa","trans_date":"2023-04-28","amt":126.43}, //SM0c61403ed8427a7c561b5bb2ec2690aa
{"id":"SM0dbd7a47a48e00d7a28c8f7f97b4be06","trans_date":"2023-04-28","amt":10.00}, //SM0dbd7a47a48e00d7a28c8f7f97b4be06
{"id":"SM0ecc526723f9652c75040a8d61646d8e","trans_date":"2023-04-28","amt":35.00}, //SM0ecc526723f9652c75040a8d61646d8e
{"id":"SM0fa5d3f882eea2bb681b5759269503ab","trans_date":"2023-04-28","amt":101.50}, //SM0fa5d3f882eea2bb681b5759269503ab
{"id":"SM101b457d656b0283fa13b0fd4308a968","trans_date":"2023-04-28","amt":30.00}, //SM101b457d656b0283fa13b0fd4308a968
{"id":"SM159160d633f371862d552c18c8b3e23b","trans_date":"2023-04-28","amt":50.00}, //SM159160d633f371862d552c18c8b3e23b
{"id":"SM15eb42ed3da1959163a8b9ed6be25161","trans_date":"2023-04-28","amt":15.00}, //SM15eb42ed3da1959163a8b9ed6be25161
{"id":"SM183ec537f1f853e1d1cea624c8e1af6e","trans_date":"2023-04-28","amt":42.52}, //SM183ec537f1f853e1d1cea624c8e1af6e
{"id":"SM1ac72650ada0a8df772861843f3bf163","trans_date":"2023-04-28","amt":25.00}, //SM1ac72650ada0a8df772861843f3bf163
{"id":"SM1d98880d9a101a0adcb9f2fdd9f6a70f","trans_date":"2023-04-28","amt":195.67}, //SM1d98880d9a101a0adcb9f2fdd9f6a70f
{"id":"SM1dcdb7c851725fc8ed4475b06f822ab2","trans_date":"2023-04-28","amt":140.00}, //SM1dcdb7c851725fc8ed4475b06f822ab2
{"id":"SM235a5458362ed3e2b7ec4f5b20c1c53a","trans_date":"2023-04-28","amt":81.52}, //SM235a5458362ed3e2b7ec4f5b20c1c53a
{"id":"SM25ba4e2b5918a6c05626c7ab8ed3bb99","trans_date":"2023-04-28","amt":75.04}, //SM25ba4e2b5918a6c05626c7ab8ed3bb99
{"id":"SM26b0a624b639ba793e789d60d689fd52","trans_date":"2023-04-28","amt":22.87}, //SM26b0a624b639ba793e789d60d689fd52
{"id":"SM26f3b9a749bcd51e556db83ca6552743","trans_date":"2023-04-28","amt":40.00}, //SM26f3b9a749bcd51e556db83ca6552743
{"id":"SM2a4f9a788f74ddcaae0e2848ecb0e9a9","trans_date":"2023-04-28","amt":135.00}, //SM2a4f9a788f74ddcaae0e2848ecb0e9a9
{"id":"SM2c62f15632a91f7b8b24487658a2bbbf","trans_date":"2023-04-28","amt":40.50}, //SM2c62f15632a91f7b8b24487658a2bbbf
{"id":"SM2cc393a9f9fd232bd6a7e01b0f08098d","trans_date":"2023-04-28","amt":19.84}, //SM2cc393a9f9fd232bd6a7e01b0f08098d
{"id":"SM2cfcb74d5f6555ffc4869bda40ad8106","trans_date":"2023-04-28","amt":20.00}, //SM2cfcb74d5f6555ffc4869bda40ad8106
{"id":"SM2f4d130c3806a9b0c70cea771e89a465","trans_date":"2023-04-28","amt":75.00}, //SM2f4d130c3806a9b0c70cea771e89a465
{"id":"SM31b65e914c103484605bf0875865607b","trans_date":"2023-04-28","amt":143.15}, //SM31b65e914c103484605bf0875865607b
{"id":"SM32bbf39ae0347d5c867233dd0cc31fec","trans_date":"2023-04-28","amt":23.00}, //SM32bbf39ae0347d5c867233dd0cc31fec
{"id":"SM32fbe2736d9927b2ce3186ef463553cc","trans_date":"2023-04-28","amt":50.00}, //SM32fbe2736d9927b2ce3186ef463553cc
{"id":"SM33779105c0e5fb08017544b48510e65a","trans_date":"2023-04-28","amt":95.80}, //SM33779105c0e5fb08017544b48510e65a
{"id":"SM351f1d5927df5c5fb638f1f8908edc3a","trans_date":"2023-04-28","amt":40.00}, //SM351f1d5927df5c5fb638f1f8908edc3a
{"id":"SM38e824a169573d1c89e84c1d3f3b015d","trans_date":"2023-04-28","amt":100.69}, //SM38e824a169573d1c89e84c1d3f3b015d
{"id":"SM3b252165b46fb8d9d3b2eefa53c85fcb","trans_date":"2023-04-28","amt":27.92}, //SM3b252165b46fb8d9d3b2eefa53c85fcb
{"id":"SM3de7a34f94d2f634c47097f8af0e7ff5","trans_date":"2023-04-28","amt":107.24}, //SM3de7a34f94d2f634c47097f8af0e7ff5
{"id":"SM3ec548ced0e15470a23579becd77165c","trans_date":"2023-04-28","amt":30.00}, //SM3ec548ced0e15470a23579becd77165c
{"id":"SM413a1970f51d92112318f78e35454305","trans_date":"2023-04-28","amt":15.00}, //SM413a1970f51d92112318f78e35454305
{"id":"SM42324b22efdfa26e63c6a868a769b31c","trans_date":"2023-04-28","amt":155.45}, //SM42324b22efdfa26e63c6a868a769b31c
{"id":"SM426a82ad60cff8fc67e9779433413d7b","trans_date":"2023-04-28","amt":20.42}, //SM426a82ad60cff8fc67e9779433413d7b
{"id":"SM48410111abcffe9bf014d7a1e6d6f1c6","trans_date":"2023-04-28","amt":17.32}, //SM48410111abcffe9bf014d7a1e6d6f1c6
{"id":"SM4987f4b76952fe91bad508d8897478e3","trans_date":"2023-04-28","amt":50.00}, //SM4987f4b76952fe91bad508d8897478e3
{"id":"SM4ac18e58850c839fc68629e4e62343f1","trans_date":"2023-04-28","amt":26.31}, //SM4ac18e58850c839fc68629e4e62343f1
{"id":"SM4ee40c1b5f5c6f9fbf25b6cba8b6bed2","trans_date":"2023-04-28","amt":70.00}, //SM4ee40c1b5f5c6f9fbf25b6cba8b6bed2
{"id":"SM518ad872acdc3f52688fc2ef9525693d","trans_date":"2023-04-28","amt":30.00}, //SM518ad872acdc3f52688fc2ef9525693d
{"id":"SM55564b8bca63d718fe16927a3c9d9c78","trans_date":"2023-04-28","amt":59.32}, //SM55564b8bca63d718fe16927a3c9d9c78
{"id":"SM57171352686c1c90bbacd9481d568ec5","trans_date":"2023-04-28","amt":136.87}, //SM57171352686c1c90bbacd9481d568ec5
{"id":"SM57d1c99b6b9af7ac1b9fa8c016908195","trans_date":"2023-04-28","amt":100.69}, //SM57d1c99b6b9af7ac1b9fa8c016908195
{"id":"SM584ce00db8946ad36ac669a3be620ee7","trans_date":"2023-04-28","amt":25.00}, //SM584ce00db8946ad36ac669a3be620ee7
{"id":"SM59737933d351123a7cb5a3abf53e685d","trans_date":"2023-04-28","amt":140.00}, //SM59737933d351123a7cb5a3abf53e685d
{"id":"SM5afa8b58782b54953663028863d97377","trans_date":"2023-04-28","amt":25.00}, //SM5afa8b58782b54953663028863d97377
{"id":"SM5b63550287b56ced97d2dcc21cf82a66","trans_date":"2023-04-28","amt":60.00}, //SM5b63550287b56ced97d2dcc21cf82a66
{"id":"SM5c20897dd5d9797c5c8fd16902f8ea88","trans_date":"2023-04-28","amt":50.00}, //SM5c20897dd5d9797c5c8fd16902f8ea88
{"id":"SM5d16340e04f5f5898875ba7eef7f768d","trans_date":"2023-04-28","amt":77.45}, //SM5d16340e04f5f5898875ba7eef7f768d
{"id":"SM60dd1bbf0639f4d599f054456f708963","trans_date":"2023-04-28","amt":50.00}, //SM60dd1bbf0639f4d599f054456f708963
{"id":"SM619e100d04d0b73baa6d89180463fc09","trans_date":"2023-04-28","amt":205.31}, //SM619e100d04d0b73baa6d89180463fc09
{"id":"SM61e0098ba98b0e119cae508f7f9626ec","trans_date":"2023-04-28","amt":11.90}, //SM61e0098ba98b0e119cae508f7f9626ec
{"id":"SM63ccbba46da3ef1c6d3114461a205a37","trans_date":"2023-04-28","amt":30.00}, //SM63ccbba46da3ef1c6d3114461a205a37
{"id":"SM664e545ad73de844ed9b71e03a93eed4","trans_date":"2023-04-28","amt":113.88}, //SM664e545ad73de844ed9b71e03a93eed4
{"id":"SM66f49855b9b7ec36b8e01a5a9c83cc3f","trans_date":"2023-04-28","amt":50.69}, //SM66f49855b9b7ec36b8e01a5a9c83cc3f
{"id":"SM6970e728dbf09726184dcacb68d19bc2","trans_date":"2023-04-28","amt":80.08}, //SM6970e728dbf09726184dcacb68d19bc2
{"id":"SM6b8b66138d555fe966658f61a9f6f432","trans_date":"2023-04-28","amt":30.00}, //SM6b8b66138d555fe966658f61a9f6f432
{"id":"SM6d4de3642b9f831e900a50a0960141d1","trans_date":"2023-04-28","amt":30.00}, //SM6d4de3642b9f831e900a50a0960141d1
{"id":"SM6d59e57132886141b767693bde652139","trans_date":"2023-04-28","amt":89.28}, //SM6d59e57132886141b767693bde652139
{"id":"SM7507bd723a27538c40aed7349d5c3b1a","trans_date":"2023-04-28","amt":40.94}, //SM7507bd723a27538c40aed7349d5c3b1a
{"id":"SM75c9fc8476a40eebeef467837e111537","trans_date":"2023-04-28","amt":41.21}, //SM75c9fc8476a40eebeef467837e111537
{"id":"SM767a21362654eb77b8f9c5eceeb4901d","trans_date":"2023-04-28","amt":60.00}, //SM767a21362654eb77b8f9c5eceeb4901d
{"id":"SM77798d3edcac82493e05d1af50b5ce75","trans_date":"2023-04-28","amt":106.57}, //SM77798d3edcac82493e05d1af50b5ce75
{"id":"SM7adc830df7a54255829edc8cee2ccaf9","trans_date":"2023-04-28","amt":25.00}, //SM7adc830df7a54255829edc8cee2ccaf9
{"id":"SM7b4d257c43eafb8a4666ed0f04eb1bb8","trans_date":"2023-04-28","amt":20.00}, //SM7b4d257c43eafb8a4666ed0f04eb1bb8
{"id":"SM83754d5aad94f7ffaf0e8739b0226664","trans_date":"2023-04-28","amt":33.10}, //SM83754d5aad94f7ffaf0e8739b0226664
{"id":"SM85219ecb35fdbeb138b45a5cb7045f7c","trans_date":"2023-04-28","amt":33.10}, //SM85219ecb35fdbeb138b45a5cb7045f7c
{"id":"SM86fe2a2653e7a7d43514b64ceaf1163b","trans_date":"2023-04-28","amt":31.31}, //SM86fe2a2653e7a7d43514b64ceaf1163b
{"id":"SM8af70332a06d89694159cf7dce1a6b82","trans_date":"2023-04-28","amt":64.45}, //SM8af70332a06d89694159cf7dce1a6b82
{"id":"SM8ddc332432ce4d3f6ee3819f6d4bfa5c","trans_date":"2023-04-28","amt":31.68}, //SM8ddc332432ce4d3f6ee3819f6d4bfa5c
{"id":"SM8ec1630a0317c9a515304c70defbbff7","trans_date":"2023-04-28","amt":29.02}, //SM8ec1630a0317c9a515304c70defbbff7
{"id":"SM8ee0d490c3d1a359488db4b92e3be1cd","trans_date":"2023-04-28","amt":209.56}, //SM8ee0d490c3d1a359488db4b92e3be1cd
{"id":"SM908b1a0d0a3228e392823747d86b7eee","trans_date":"2023-04-28","amt":214.44}, //SM908b1a0d0a3228e392823747d86b7eee
{"id":"SM90d25d334698497f2e656349cbdc7a85","trans_date":"2023-04-28","amt":120.00}, //SM90d25d334698497f2e656349cbdc7a85
{"id":"SM9439ad9a160ae2add15d799c121cf30d","trans_date":"2023-04-28","amt":50.00}, //SM9439ad9a160ae2add15d799c121cf30d
{"id":"SM946f955f64d8f6fbd8bda8bca808a90f","trans_date":"2023-04-28","amt":15.00}, //SM946f955f64d8f6fbd8bda8bca808a90f
{"id":"SM96a9d81479ac73e803f98c5b1607cd24","trans_date":"2023-04-28","amt":52.87}, //SM96a9d81479ac73e803f98c5b1607cd24
{"id":"SM9aad7601a3d9c09e33506c0308e40be3","trans_date":"2023-04-28","amt":40.66}, //SM9aad7601a3d9c09e33506c0308e40be3
{"id":"SM9ae30871b03aafdfcacc0d5a5cfb7e48","trans_date":"2023-04-28","amt":100.69}, //SM9ae30871b03aafdfcacc0d5a5cfb7e48
{"id":"SM9af69f2f74118435f6c347fdd5f4ec99","trans_date":"2023-04-28","amt":5.00}, //SM9af69f2f74118435f6c347fdd5f4ec99
{"id":"SM9d47e939da5774e8b8c1b7b51349412a","trans_date":"2023-04-28","amt":55.90}, //SM9d47e939da5774e8b8c1b7b51349412a
{"id":"SM9ecca5b148f99068a8069dad8f4f7040","trans_date":"2023-04-28","amt":43.10}, //SM9ecca5b148f99068a8069dad8f4f7040
{"id":"SMa092bd131d8631bdefbdadffe7867053","trans_date":"2023-04-28","amt":149.38}, //SMa092bd131d8631bdefbdadffe7867053
{"id":"SMa1a8f6657f76003607664706b59c1e87","trans_date":"2023-04-28","amt":20.00}, //SMa1a8f6657f76003607664706b59c1e87
{"id":"SMa1a93ab146868ad8f02185e341c63ce2","trans_date":"2023-04-28","amt":100.69}, //SMa1a93ab146868ad8f02185e341c63ce2
{"id":"SMa656e7fea6b9c1803736adcecae2d262","trans_date":"2023-04-28","amt":77.31}, //SMa656e7fea6b9c1803736adcecae2d262
{"id":"SMaa64e58d65b7baf98a2a628b4e5691e5","trans_date":"2023-04-28","amt":25.00}, //SMaa64e58d65b7baf98a2a628b4e5691e5
{"id":"SMab1908994a9e22a63b222ac37dfc4ff8","trans_date":"2023-04-28","amt":75.00}, //SMab1908994a9e22a63b222ac37dfc4ff8
{"id":"SMad74cd29c230820018175d08df9ad8d9","trans_date":"2023-04-28","amt":31.50}, //SMad74cd29c230820018175d08df9ad8d9
{"id":"SMadb0d4eae0a236f9ff31844eaffeb732","trans_date":"2023-04-28","amt":15.00}, //SMadb0d4eae0a236f9ff31844eaffeb732
{"id":"SMae6eb46195ab181e9ba9d50902b52ca6","trans_date":"2023-04-28","amt":110.00}, //SMae6eb46195ab181e9ba9d50902b52ca6
{"id":"SMb1733ecd87893154d08035db1487cb8d","trans_date":"2023-04-28","amt":41.48}, //SMb1733ecd87893154d08035db1487cb8d
{"id":"SMb5ae7d520f8ba074f5df5b314893706b","trans_date":"2023-04-28","amt":19.50}, //SMb5ae7d520f8ba074f5df5b314893706b
{"id":"SMb70c512027544f2596f5c1553a28de51","trans_date":"2023-04-28","amt":101.31}, //SMb70c512027544f2596f5c1553a28de51
{"id":"SMb816d5f2a6f366184c007157ec6cb019","trans_date":"2023-04-28","amt":71.00}, //SMb816d5f2a6f366184c007157ec6cb019
{"id":"SMb9996a236cb52c5e3787e087002287de","trans_date":"2023-04-28","amt":110.05}, //SMb9996a236cb52c5e3787e087002287de
{"id":"SMbdf53f9fd6153fcba36a34420d27a69a","trans_date":"2023-04-28","amt":95.07}, //SMbdf53f9fd6153fcba36a34420d27a69a
{"id":"SMbe191b502dc494b1b1dd8687083fe8e8","trans_date":"2023-04-28","amt":95.00}, //SMbe191b502dc494b1b1dd8687083fe8e8
{"id":"SMbe2372da95375494659141ed6dac9331","trans_date":"2023-04-28","amt":89.05}, //SMbe2372da95375494659141ed6dac9331
{"id":"SMc05287913702468ac95242c182b28ec7","trans_date":"2023-04-28","amt":90.00}, //SMc05287913702468ac95242c182b28ec7
{"id":"SMc179b9c6b41dea053adc9c9cc60a89fc","trans_date":"2023-04-28","amt":135.00}, //SMc179b9c6b41dea053adc9c9cc60a89fc
{"id":"SMc46b4f046a301b084e61025b7d633db9","trans_date":"2023-04-28","amt":48.10}, //SMc46b4f046a301b084e61025b7d633db9
{"id":"SMc4783c7df7d4f426e8f7fd798af3ec22","trans_date":"2023-04-28","amt":10.00}, //SMc4783c7df7d4f426e8f7fd798af3ec22
{"id":"SMc5c4134d83cc86e53096628ad44b676b","trans_date":"2023-04-28","amt":25.00}, //SMc5c4134d83cc86e53096628ad44b676b
{"id":"SMc9fbbce49c3aab0bfc807df49c3818fa","trans_date":"2023-04-28","amt":25.00}, //SMc9fbbce49c3aab0bfc807df49c3818fa
{"id":"SMcab974d6e9d62fa3d712d3151a66b8a1","trans_date":"2023-04-28","amt":26.71}, //SMcab974d6e9d62fa3d712d3151a66b8a1
{"id":"SMcb59bc840e2f78d095379ba5ac83eed3","trans_date":"2023-04-28","amt":35.00}, //SMcb59bc840e2f78d095379ba5ac83eed3
{"id":"SMcc45da3536d3db80d17a5a67a6bfd809","trans_date":"2023-04-28","amt":70.56}, //SMcc45da3536d3db80d17a5a67a6bfd809
{"id":"SMcd3f19d28077257f85b7432ab35b611d","trans_date":"2023-04-28","amt":40.00}, //SMcd3f19d28077257f85b7432ab35b611d
{"id":"SMce32ede40e5156e0b6e5b6a07367ef59","trans_date":"2023-04-28","amt":136.87}, //SMce32ede40e5156e0b6e5b6a07367ef59
{"id":"SMd0eab58a2c7fa67d27d3a1fb32b63071","trans_date":"2023-04-28","amt":115.07}, //SMd0eab58a2c7fa67d27d3a1fb32b63071
{"id":"SMd4148b65e42dba3888068028257b944b","trans_date":"2023-04-28","amt":30.00}, //SMd4148b65e42dba3888068028257b944b
{"id":"SMd7941dce32d10ebdb0778a136f4d55cb","trans_date":"2023-04-28","amt":17.25}, //SMd7941dce32d10ebdb0778a136f4d55cb
{"id":"SMd849db0d1246f4a04be1e9dafc94cc7f","trans_date":"2023-04-28","amt":17.54}, //SMd849db0d1246f4a04be1e9dafc94cc7f
{"id":"SMdaccd5503a20879be3f8d4caa57392a6","trans_date":"2023-04-28","amt":29.00}, //SMdaccd5503a20879be3f8d4caa57392a6
{"id":"SMdd46028154ea478ac695b6e200113615","trans_date":"2023-04-28","amt":50.00}, //SMdd46028154ea478ac695b6e200113615
{"id":"SMdd7a5545e14e757c4b344e14b8c87616","trans_date":"2023-04-28","amt":91.77}, //SMdd7a5545e14e757c4b344e14b8c87616
{"id":"SMdf66130f75bb8ae224eb00dc4f3bf895","trans_date":"2023-04-28","amt":129.34}, //SMdf66130f75bb8ae224eb00dc4f3bf895
{"id":"SMdfd2468d9dc6edff55b5615196b7e4d6","trans_date":"2023-04-28","amt":10.00}, //SMdfd2468d9dc6edff55b5615196b7e4d6
{"id":"SMe50d3af017f85a198c75298119483150","trans_date":"2023-04-28","amt":35.00}, //SMe50d3af017f85a198c75298119483150
{"id":"SMe535f333268d082932f11760a9e65400","trans_date":"2023-04-28","amt":50.00}, //SMe535f333268d082932f11760a9e65400
{"id":"SMe5a081ef92847e6bc35ada6d87c955ba","trans_date":"2023-04-28","amt":12.58}, //SMe5a081ef92847e6bc35ada6d87c955ba
{"id":"SMe6f42ea4d0a88a2ed39e2d2d2df27338","trans_date":"2023-04-28","amt":50.00}, //SMe6f42ea4d0a88a2ed39e2d2d2df27338
{"id":"SMe974a78157de8922b6a2e547c78f42f6","trans_date":"2023-04-28","amt":35.00}, //SMe974a78157de8922b6a2e547c78f42f6
{"id":"SMe99726b70349adfc957d392b0886879a","trans_date":"2023-04-28","amt":72.07}, //SMe99726b70349adfc957d392b0886879a
{"id":"SMeb42b5b8381e9a8ebdbc03da38778769","trans_date":"2023-04-28","amt":20.00}, //SMeb42b5b8381e9a8ebdbc03da38778769
{"id":"SMede783cb9767fc3f9b587070e23e76e0","trans_date":"2023-04-28","amt":50.00}, //SMede783cb9767fc3f9b587070e23e76e0
{"id":"SMedfeaf40a2255b96607e0e233ef06870","trans_date":"2023-04-28","amt":50.00}, //SMedfeaf40a2255b96607e0e233ef06870
{"id":"SMee597fc1f19fdb57929050fa2099a926","trans_date":"2023-04-28","amt":113.05}, //SMee597fc1f19fdb57929050fa2099a926
{"id":"SMefadbbde72912a359971002e60e3454f","trans_date":"2023-04-28","amt":35.00}, //SMefadbbde72912a359971002e60e3454f
{"id":"SMf18b8d173bd513e3670d9ea7063e4513","trans_date":"2023-04-28","amt":118.72}, //SMf18b8d173bd513e3670d9ea7063e4513
{"id":"SMf2b6084f7a27f46a34be8d8ba2baf443","trans_date":"2023-04-28","amt":25.00}, //SMf2b6084f7a27f46a34be8d8ba2baf443
{"id":"SMf3239de41f35926dbe0f39f30fe9e292","trans_date":"2023-04-28","amt":98.02}, //SMf3239de41f35926dbe0f39f30fe9e292
{"id":"SMf461e4a744786c5af807aa6b7b098c34","trans_date":"2023-04-28","amt":120.00}, //SMf461e4a744786c5af807aa6b7b098c34
{"id":"SMf5bdfd6e6314c5c72bb3d423c6d5bfb3","trans_date":"2023-04-28","amt":20.93}, //SMf5bdfd6e6314c5c72bb3d423c6d5bfb3
{"id":"SMf740db13f41fa2932235a9384711e4dd","trans_date":"2023-04-28","amt":115.00}, //SMf740db13f41fa2932235a9384711e4dd
{"id":"SMf8c94d0b61c2a302dd5d612cc282572a","trans_date":"2023-04-28","amt":135.00}, //SMf8c94d0b61c2a302dd5d612cc282572a
{"id":"SMf99ebf908f8f17f2e5f98f976f1139cc","trans_date":"2023-04-28","amt":34.00}, //SMf99ebf908f8f17f2e5f98f976f1139cc
{"id":"SMfc68516566d136370e0a3d6b1ce88791","trans_date":"2023-04-28","amt":140.11}, //SMfc68516566d136370e0a3d6b1ce88791
{"id":"SMfcfb70272c306c024ccd8a6055bae571","trans_date":"2023-04-28","amt":88.71}, //SMfcfb70272c306c024ccd8a6055bae571
{"id":"SMfdaef3684986dae0a066a34288ac7436","trans_date":"2023-04-28","amt":77.30}, //SMfdaef3684986dae0a066a34288ac7436
{"id":"SMfe25c22d6d309bc8745c2fe84fb84ed1","trans_date":"2023-04-28","amt":25.00}, //SMfe25c22d6d309bc8745c2fe84fb84ed1
{"id":"SMfe2b95635895687039e41a05f4815c1d","trans_date":"2023-04-28","amt":44.72}, //SMfe2b95635895687039e41a05f4815c1d
{"id":"SMfe38aed45e01a8818345e918dee76ba9","trans_date":"2023-04-28","amt":81.53}, //SMfe38aed45e01a8818345e918dee76ba9
{"id":"SM016d7a4d610392d36bf9f2ac5c876af5","trans_date":"2023-04-29","amt":30.00}, //SM016d7a4d610392d36bf9f2ac5c876af5
{"id":"SM0680421db124a283bedfe9ce9c8e5875","trans_date":"2023-04-29","amt":50.00}, //SM0680421db124a283bedfe9ce9c8e5875
{"id":"SM0caf9acd8476f67cd9c029f26402d94f","trans_date":"2023-04-29","amt":120.03}, //SM0caf9acd8476f67cd9c029f26402d94f
{"id":"SM10a9b71bc9075fc21cab052f8e624772","trans_date":"2023-04-29","amt":60.00}, //SM10a9b71bc9075fc21cab052f8e624772
{"id":"SM14f2dcc7a15a15d5bb7ae6d0804085e7","trans_date":"2023-04-29","amt":36.45}, //SM14f2dcc7a15a15d5bb7ae6d0804085e7
{"id":"SM17886c8df6e1c695c3e88c20328e3dc8","trans_date":"2023-04-29","amt":28.00}, //SM17886c8df6e1c695c3e88c20328e3dc8
{"id":"SM21299c72b4ee70b7956d2bd6ca325f1d","trans_date":"2023-04-29","amt":30.00}, //SM21299c72b4ee70b7956d2bd6ca325f1d
{"id":"SM2407ec02eff46c169cf20af72fdca570","trans_date":"2023-04-29","amt":111.13}, //SM2407ec02eff46c169cf20af72fdca570
{"id":"SM51a9c9f4a3b7d067aae9c808bfe512ae","trans_date":"2023-04-29","amt":160.00}, //SM51a9c9f4a3b7d067aae9c808bfe512ae
{"id":"SM52938b5885d0c7641bed0092288c80d0","trans_date":"2023-04-29","amt":60.00}, //SM52938b5885d0c7641bed0092288c80d0
{"id":"SM52a71d7f450e6891bc5dfab4302f2036","trans_date":"2023-04-29","amt":151.82}, //SM52a71d7f450e6891bc5dfab4302f2036
{"id":"SM5ba1ef4942b509c8d0f8bc8e4f82b104","trans_date":"2023-04-29","amt":50.00}, //SM5ba1ef4942b509c8d0f8bc8e4f82b104
{"id":"SM5c470cac4e89b5975c2934108976645c","trans_date":"2023-04-29","amt":35.00}, //SM5c470cac4e89b5975c2934108976645c
{"id":"SM5f24cdedd9a76bf6cd37b7e1069735e0","trans_date":"2023-04-29","amt":36.06}, //SM5f24cdedd9a76bf6cd37b7e1069735e0
{"id":"SM6fa9490fa9fae21ba642f50007d37a6b","trans_date":"2023-04-29","amt":81.53}, //SM6fa9490fa9fae21ba642f50007d37a6b
{"id":"SM705d16b183dd22f6acf016667efce565","trans_date":"2023-04-29","amt":47.31}, //SM705d16b183dd22f6acf016667efce565
{"id":"SM7d318fa587beb5f047ee110bfd99a4f4","trans_date":"2023-04-29","amt":40.00}, //SM7d318fa587beb5f047ee110bfd99a4f4
{"id":"SM7faba7e35d1874b26f7b2ba24a8c2b48","trans_date":"2023-04-29","amt":82.00}, //SM7faba7e35d1874b26f7b2ba24a8c2b48
{"id":"SM8b7fc65aba500b3cca8c6e286659aaf4","trans_date":"2023-04-29","amt":10.01}, //SM8b7fc65aba500b3cca8c6e286659aaf4
{"id":"SM8e06851e59d72edb4053452d8f3e2adb","trans_date":"2023-04-29","amt":70.00}, //SM8e06851e59d72edb4053452d8f3e2adb
{"id":"SM8e1909457f9927a0fe848f7b0b749469","trans_date":"2023-04-29","amt":35.01}, //SM8e1909457f9927a0fe848f7b0b749469
{"id":"SM8e60c2f429914047ec0c44cde9da44d3","trans_date":"2023-04-29","amt":70.00}, //SM8e60c2f429914047ec0c44cde9da44d3
{"id":"SM8f10589d6a65b4ccc38c44015f69b734","trans_date":"2023-04-29","amt":135.02}, //SM8f10589d6a65b4ccc38c44015f69b734
{"id":"SM9054f9e7ac64bf6c7ff8c02870ff27b2","trans_date":"2023-04-29","amt":35.35}, //SM9054f9e7ac64bf6c7ff8c02870ff27b2
{"id":"SMa542d7736e1b575a0397242a873dafb5","trans_date":"2023-04-29","amt":15.20}, //SMa542d7736e1b575a0397242a873dafb5
{"id":"SMa840ae828a2eb7194599d71ab1c34109","trans_date":"2023-04-29","amt":28.28}, //SMa840ae828a2eb7194599d71ab1c34109
{"id":"SMaa36d409ac76804c8197bb315a1fdf4b","trans_date":"2023-04-29","amt":110.78}, //SMaa36d409ac76804c8197bb315a1fdf4b
{"id":"SMadf09ee8834f933f4953eb433fac30a5","trans_date":"2023-04-29","amt":72.18}, //SMadf09ee8834f933f4953eb433fac30a5
{"id":"SMaf0cf937fd9b465033f048a6c8b62978","trans_date":"2023-04-29","amt":65.00}, //SMaf0cf937fd9b465033f048a6c8b62978
{"id":"SMb7c8f378743ba525323b327c6975e941","trans_date":"2023-04-29","amt":79.03}, //SMb7c8f378743ba525323b327c6975e941
{"id":"SMc06596989f9ceb377e4d1f0e5e394d2b","trans_date":"2023-04-29","amt":70.02}, //SMc06596989f9ceb377e4d1f0e5e394d2b
{"id":"SMc6afaea9e6948ab1d7208c640b822e0e","trans_date":"2023-04-29","amt":182.72}, //SMc6afaea9e6948ab1d7208c640b822e0e
{"id":"SMcd23d3c92126af847f8cdf4d3322a9a6","trans_date":"2023-04-29","amt":120.00}, //SMcd23d3c92126af847f8cdf4d3322a9a6
{"id":"SMdea98f9ce9d14c12836c3d953ab77bfb","trans_date":"2023-04-29","amt":120.00}, //SMdea98f9ce9d14c12836c3d953ab77bfb
{"id":"SMe44a361e1236fe8942d21df969ac7849","trans_date":"2023-04-29","amt":17.54}, //SMe44a361e1236fe8942d21df969ac7849
{"id":"SMec6fd45b70969706e3ef3656f4d2ff24","trans_date":"2023-04-29","amt":102.34}, //SMec6fd45b70969706e3ef3656f4d2ff24
{"id":"SMf0cc612ebca09604569d2e454ed71927","trans_date":"2023-04-29","amt":77.97}, //SMf0cc612ebca09604569d2e454ed71927
{"id":"SMf65433ad096037ec44adb76f9ecd6f8c","trans_date":"2023-04-29","amt":10.00}, //SMf65433ad096037ec44adb76f9ecd6f8c
{"id":"SMf88e2905be89c2e0a38f0ea4a88539be","trans_date":"2023-04-29","amt":96.04}, //SMf88e2905be89c2e0a38f0ea4a88539be
{"id":"SMf8b873e08710d2a89db9e868b8956e49","trans_date":"2023-04-29","amt":50.00}, //SMf8b873e08710d2a89db9e868b8956e49
{"id":"SM16b1be541383d4f18482a8761b442357","trans_date":"2023-05-01","amt":30.00}, //SM16b1be541383d4f18482a8761b442357
{"id":"SM3235084022173ce064f2f9cf4840c185","trans_date":"2023-05-01","amt":15.00}, //SM3235084022173ce064f2f9cf4840c185
{"id":"SM389b061f80a5cd05932c1f475dd5034b","trans_date":"2023-05-01","amt":50.00}, //SM389b061f80a5cd05932c1f475dd5034b
{"id":"SM414bad1cc19856c1f4f6fff44b75c160","trans_date":"2023-05-01","amt":33.91}, //SM414bad1cc19856c1f4f6fff44b75c160
{"id":"SM458d5c47ce64985984c32e89432208e1","trans_date":"2023-05-01","amt":20.00}, //SM458d5c47ce64985984c32e89432208e1
{"id":"SM52ac09adfaee1369231db378424d03c6","trans_date":"2023-05-01","amt":20.00}, //SM52ac09adfaee1369231db378424d03c6
{"id":"SM67fc6db3720f77f6ec21635f52da8442","trans_date":"2023-05-01","amt":40.45}, //SM67fc6db3720f77f6ec21635f52da8442
{"id":"SM6827d44b30308f6049af54127fbd4b38","trans_date":"2023-05-01","amt":130.00}, //SM6827d44b30308f6049af54127fbd4b38
{"id":"SM81f36547ef41d8291a76cbaf01f375a3","trans_date":"2023-05-01","amt":96.00}, //SM81f36547ef41d8291a76cbaf01f375a3
{"id":"SM850c4a08cd248850b8b474140bf972ec","trans_date":"2023-05-01","amt":95.57}, //SM850c4a08cd248850b8b474140bf972ec
{"id":"SM8915ff29a711b426d203f6830a191b15","trans_date":"2023-05-01","amt":29.80}, //SM8915ff29a711b426d203f6830a191b15
{"id":"SM99561295099286040fcd4bf985fe7122","trans_date":"2023-05-01","amt":32.40}, //SM99561295099286040fcd4bf985fe7122
{"id":"SM9e8e3a113e32257fc435c3f7318c32f4","trans_date":"2023-05-01","amt":18.30}, //SM9e8e3a113e32257fc435c3f7318c32f4
{"id":"SMa633758005400cfe11ecd25c12ac7bd7","trans_date":"2023-05-01","amt":32.96}, //SMa633758005400cfe11ecd25c12ac7bd7
{"id":"SMa76551fb8901d7048a7cda4e3151afad","trans_date":"2023-05-01","amt":72.18}, //SMa76551fb8901d7048a7cda4e3151afad
{"id":"SMdb310cb282ce3982dc748a4abd8f0305","trans_date":"2023-05-01","amt":50.00}, //SMdb310cb282ce3982dc748a4abd8f0305
{"id":"SMdcebce93df101a5bf5eeffc750bc8c94","trans_date":"2023-05-01","amt":80.00}, //SMdcebce93df101a5bf5eeffc750bc8c94
{"id":"SMebc79923be8e1d936993c7ad62de06b1","trans_date":"2023-05-01","amt":81.09}, //SMebc79923be8e1d936993c7ad62de06b1
{"id":"SMfd1fb92b2f1e100aff4c191c619e3325","trans_date":"2023-05-01","amt":40.07}, //SMfd1fb92b2f1e100aff4c191c619e3325
{"id":"SMff4498d4c4a77a65a774666d3fa1943b","trans_date":"2023-05-01","amt":148.79}, //SMff4498d4c4a77a65a774666d3fa1943b
    ]

    //console.log("looking up id: ", message_sid);
    return balance_data.filter( function(item) { 
      return item.id === message_sid;
    })[0] || {"id":message_sid,"trans_date":null,"amt":null};
  }

  async function getTwilioMessageCost(message_sid) {
    //console.log("looking up ID: " + message_sid);
    var _msg_api = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/messages/${message_sid}`);
    const message = await _msg_api.json();
    //console.log("Price: ", message["price"]);
    return message["price"];
  }