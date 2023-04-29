import { CosmosClient, Database, Container } from "@azure/cosmos";
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'

export async function GET() {
  console.log("[GET] /api/messages/dashboard    (from CosmosDB)");

  const messages = await getMessageOptions("Messages");
  console.log("\t# of messages = ", messages.length);
  //console.log("API got data type: ", typeof( messages ));

  return NextResponse.json(messages);
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

    //get NGE transactions
    /* Individual encounter breakdown */
    /*
    
;with individual_balances AS (
  select pe.practice_id, pe.enc_nbr, d.MESSAGE_ID, d.type, CONVERT(DATE, td.create_timestamp) as trans_date, td.paid_amt
  from appdev_billing_outreach_encounters d (NOLOCK)
  inner join patient_encounter pe (NOLOCK) on d.practice=pe.practice_id and d.[encounter number]=pe.enc_nbr 
  left outer JOIN trans_detail td (NOLOCK) on pe.enc_id=td.source_id
    AND td.create_timestamp>=convert(datetime, d.sent_at)
    AND td.paid_amt is not null
  WHERE ISNULL(d.message_id,'')<>''
  AND isnull(td.paid_amt,0)<0
  )
  SElECT '{"id":"'+message_id+'","trans_date":"'+ FORMAT(trans_date,'yyyy-MM-dd') + '","amt":'+convert(varchar(10), sum(paid_amt)*-1)+'},'
  from individual_balances
  group by message_id, trans_date
    */
    const balance_data = [
      {"id":"SMfdaef3684986dae0a066a34288ac7436","trans_date":"2023-04-28","amt":77.30},
      {"id":"SM06224486f59e1a270b3de6399fec7ee4","trans_date":"2023-04-28","amt":10.00},
      {"id":"SM61e0098ba98b0e119cae508f7f9626ec","trans_date":"2023-04-28","amt":11.90},
      {"id":"SMee597fc1f19fdb57929050fa2099a926","trans_date":"2023-04-28","amt":113.05},
      {"id":"SMf8c94d0b61c2a302dd5d612cc282572a","trans_date":"2023-04-28","amt":135.00},
      {"id":"SMd849db0d1246f4a04be1e9dafc94cc7f","trans_date":"2023-04-28","amt":17.54},
      {"id":"SMb9996a236cb52c5e3787e087002287de","trans_date":"2023-04-28","amt":110.05},
      {"id":"SMedfeaf40a2255b96607e0e233ef06870","trans_date":"2023-04-28","amt":50.00},
      {"id":"SM235a5458362ed3e2b7ec4f5b20c1c53a","trans_date":"2023-04-28","amt":81.52},
      {"id":"SM57d1c99b6b9af7ac1b9fa8c016908195","trans_date":"2023-04-28","amt":100.69},
      {"id":"SM9ae30871b03aafdfcacc0d5a5cfb7e48","trans_date":"2023-04-28","amt":100.69},
      {"id":"SM0c61403ed8427a7c561b5bb2ec2690aa","trans_date":"2023-04-28","amt":126.43},
      {"id":"SM8ec1630a0317c9a515304c70defbbff7","trans_date":"2023-04-28","amt":29.02},
      {"id":"SM159160d633f371862d552c18c8b3e23b","trans_date":"2023-04-28","amt":50.00},
      {"id":"SM6b8b66138d555fe966658f61a9f6f432","trans_date":"2023-04-28","amt":30.00},
      {"id":"SM7adc830df7a54255829edc8cee2ccaf9","trans_date":"2023-04-28","amt":25.00},
      {"id":"SMf99ebf908f8f17f2e5f98f976f1139cc","trans_date":"2023-04-28","amt":34.00},
      {"id":"SMe6f42ea4d0a88a2ed39e2d2d2df27338","trans_date":"2023-04-28","amt":50.00},
      {"id":"SMadb0d4eae0a236f9ff31844eaffeb732","trans_date":"2023-04-28","amt":15.00},
      {"id":"SM4ac18e58850c839fc68629e4e62343f1","trans_date":"2023-04-28","amt":26.31},
      {"id":"SM38e824a169573d1c89e84c1d3f3b015d","trans_date":"2023-04-28","amt":100.69},
      {"id":"SMf740db13f41fa2932235a9384711e4dd","trans_date":"2023-04-28","amt":115.00},
      {"id":"SMc179b9c6b41dea053adc9c9cc60a89fc","trans_date":"2023-04-28","amt":135.00},
      {"id":"SMdd46028154ea478ac695b6e200113615","trans_date":"2023-04-28","amt":50.00},
      {"id":"SM2c62f15632a91f7b8b24487658a2bbbf","trans_date":"2023-04-28","amt":40.50},
      {"id":"SM908b1a0d0a3228e392823747d86b7eee","trans_date":"2023-04-28","amt":214.44},
      {"id":"SM4987f4b76952fe91bad508d8897478e3","trans_date":"2023-04-28","amt":50.00},
      {"id":"SM33779105c0e5fb08017544b48510e65a","trans_date":"2023-04-28","amt":95.80},
      {"id":"SM2cfcb74d5f6555ffc4869bda40ad8106","trans_date":"2023-04-28","amt":20.00},
      {"id":"SM101b457d656b0283fa13b0fd4308a968","trans_date":"2023-04-28","amt":30.00},
      {"id":"SM25ba4e2b5918a6c05626c7ab8ed3bb99","trans_date":"2023-04-28","amt":75.04},
      {"id":"SM3de7a34f94d2f634c47097f8af0e7ff5","trans_date":"2023-04-28","amt":107.24},
      {"id":"SM0dbd7a47a48e00d7a28c8f7f97b4be06","trans_date":"2023-04-28","amt":10.00},
      {"id":"SM05efecb2aa70c87b741cb5972740efc3","trans_date":"2023-04-28","amt":12.22},
      {"id":"SMc4783c7df7d4f426e8f7fd798af3ec22","trans_date":"2023-04-28","amt":10.00},
      {"id":"SM66f49855b9b7ec36b8e01a5a9c83cc3f","trans_date":"2023-04-28","amt":50.69},
      {"id":"SM6d4de3642b9f831e900a50a0960141d1","trans_date":"2023-04-28","amt":30.00},
      {"id":"SMdaccd5503a20879be3f8d4caa57392a6","trans_date":"2023-04-28","amt":29.00},
      {"id":"SM4ee40c1b5f5c6f9fbf25b6cba8b6bed2","trans_date":"2023-04-28","amt":70.00},
      {"id":"SM04a49f139d023c3f7775e486721d80fa","trans_date":"2023-04-28","amt":20.00},
      {"id":"SMaa64e58d65b7baf98a2a628b4e5691e5","trans_date":"2023-04-28","amt":25.00},
      {"id":"SMf2b6084f7a27f46a34be8d8ba2baf443","trans_date":"2023-04-28","amt":25.00},
      {"id":"SM6d59e57132886141b767693bde652139","trans_date":"2023-04-28","amt":89.28},
      {"id":"SM83754d5aad94f7ffaf0e8739b0226664","trans_date":"2023-04-28","amt":33.10},
      {"id":"SM619e100d04d0b73baa6d89180463fc09","trans_date":"2023-04-28","amt":205.31},
      {"id":"SMd0eab58a2c7fa67d27d3a1fb32b63071","trans_date":"2023-04-28","amt":115.07},
      {"id":"SM60dd1bbf0639f4d599f054456f708963","trans_date":"2023-04-28","amt":50.00},
      {"id":"SM00e5d0c52bf622d1c06afd4a1b1eaf54","trans_date":"2023-04-28","amt":175.69},
      {"id":"SMefadbbde72912a359971002e60e3454f","trans_date":"2023-04-28","amt":35.00},
      {"id":"SM0ecc526723f9652c75040a8d61646d8e","trans_date":"2023-04-28","amt":35.00},
      {"id":"SM09dc5011fc4fd24fbebfc4545465ff6d","trans_date":"2023-04-28","amt":50.00},
      {"id":"SMf3239de41f35926dbe0f39f30fe9e292","trans_date":"2023-04-28","amt":98.02},
      {"id":"SM0a101ac0969d7aa5ec164be31ba218cf","trans_date":"2023-04-28","amt":32.00},
      {"id":"SMd7941dce32d10ebdb0778a136f4d55cb","trans_date":"2023-04-28","amt":17.25},
      {"id":"SM351f1d5927df5c5fb638f1f8908edc3a","trans_date":"2023-04-28","amt":40.00},
      {"id":"SMab1908994a9e22a63b222ac37dfc4ff8","trans_date":"2023-04-28","amt":75.00},
      {"id":"SMb70c512027544f2596f5c1553a28de51","trans_date":"2023-04-28","amt":101.31},
      {"id":"SMdf66130f75bb8ae224eb00dc4f3bf895","trans_date":"2023-04-28","amt":129.34},
      {"id":"SM1dcdb7c851725fc8ed4475b06f822ab2","trans_date":"2023-04-28","amt":140.00},
      {"id":"SMcab974d6e9d62fa3d712d3151a66b8a1","trans_date":"2023-04-28","amt":26.71},
      {"id":"SM9af69f2f74118435f6c347fdd5f4ec99","trans_date":"2023-04-28","amt":5.00},
      {"id":"SM26b0a624b639ba793e789d60d689fd52","trans_date":"2023-04-28","amt":22.87},
      {"id":"SMd4148b65e42dba3888068028257b944b","trans_date":"2023-04-28","amt":30.00},
      {"id":"SMede783cb9767fc3f9b587070e23e76e0","trans_date":"2023-04-28","amt":50.00},
      {"id":"SM183ec537f1f853e1d1cea624c8e1af6e","trans_date":"2023-04-28","amt":42.52},
      {"id":"SMc5c4134d83cc86e53096628ad44b676b","trans_date":"2023-04-28","amt":25.00},
      {"id":"SMc46b4f046a301b084e61025b7d633db9","trans_date":"2023-04-28","amt":48.10},
      {"id":"SMb1733ecd87893154d08035db1487cb8d","trans_date":"2023-04-28","amt":41.48},
      {"id":"SMae6eb46195ab181e9ba9d50902b52ca6","trans_date":"2023-04-28","amt":110.00},
      {"id":"SM0a0189c68c137cce972f8f90019a7c74","trans_date":"2023-04-28","amt":15.00},
      {"id":"SM033db49a2f237355a870d3ecd305a1a6","trans_date":"2023-04-28","amt":31.97},
      {"id":"SM2f4d130c3806a9b0c70cea771e89a465","trans_date":"2023-04-28","amt":75.00},
      {"id":"SMcb59bc840e2f78d095379ba5ac83eed3","trans_date":"2023-04-28","amt":35.00},
      {"id":"SMcd3f19d28077257f85b7432ab35b611d","trans_date":"2023-04-28","amt":40.00},
      {"id":"SM9ecca5b148f99068a8069dad8f4f7040","trans_date":"2023-04-28","amt":43.10},
      {"id":"SM57171352686c1c90bbacd9481d568ec5","trans_date":"2023-04-28","amt":136.87},
      {"id":"SM0fa5d3f882eea2bb681b5759269503ab","trans_date":"2023-04-28","amt":101.50},
      {"id":"SM8ee0d490c3d1a359488db4b92e3be1cd","trans_date":"2023-04-28","amt":209.56},
      {"id":"SMa1a8f6657f76003607664706b59c1e87","trans_date":"2023-04-28","amt":20.00},
      {"id":"SM48410111abcffe9bf014d7a1e6d6f1c6","trans_date":"2023-04-28","amt":17.32},
      {"id":"SMcc45da3536d3db80d17a5a67a6bfd809","trans_date":"2023-04-28","amt":70.56},
      {"id":"SMfc68516566d136370e0a3d6b1ce88791","trans_date":"2023-04-28","amt":140.11},
      {"id":"SM63ccbba46da3ef1c6d3114461a205a37","trans_date":"2023-04-28","amt":30.00},
      {"id":"SM6970e728dbf09726184dcacb68d19bc2","trans_date":"2023-04-28","amt":80.08},
      {"id":"SM426a82ad60cff8fc67e9779433413d7b","trans_date":"2023-04-28","amt":20.42},
      {"id":"SMf461e4a744786c5af807aa6b7b098c34","trans_date":"2023-04-28","amt":120.00},
      {"id":"SM9aad7601a3d9c09e33506c0308e40be3","trans_date":"2023-04-28","amt":40.66},
      {"id":"SM584ce00db8946ad36ac669a3be620ee7","trans_date":"2023-04-28","amt":25.00},
      {"id":"SM42324b22efdfa26e63c6a868a769b31c","trans_date":"2023-04-28","amt":155.45},
      {"id":"SM32bbf39ae0347d5c867233dd0cc31fec","trans_date":"2023-04-28","amt":23.00},
      {"id":"SM1ac72650ada0a8df772861843f3bf163","trans_date":"2023-04-28","amt":25.00},
      {"id":"SM2cc393a9f9fd232bd6a7e01b0f08098d","trans_date":"2023-04-28","amt":19.84},
      {"id":"SMe99726b70349adfc957d392b0886879a","trans_date":"2023-04-28","amt":72.07},
      {"id":"SM59737933d351123a7cb5a3abf53e685d","trans_date":"2023-04-28","amt":140.00},
      {"id":"SM5afa8b58782b54953663028863d97377","trans_date":"2023-04-28","amt":25.00},
      {"id":"SM55564b8bca63d718fe16927a3c9d9c78","trans_date":"2023-04-28","amt":59.32},
      {"id":"SMeb42b5b8381e9a8ebdbc03da38778769","trans_date":"2023-04-28","amt":20.00},
      {"id":"SM413a1970f51d92112318f78e35454305","trans_date":"2023-04-28","amt":15.00},
      {"id":"SMfe2b95635895687039e41a05f4815c1d","trans_date":"2023-04-28","amt":44.72},
      {"id":"SM946f955f64d8f6fbd8bda8bca808a90f","trans_date":"2023-04-28","amt":15.00},
      {"id":"SMbe2372da95375494659141ed6dac9331","trans_date":"2023-04-28","amt":89.05},
      {"id":"SM5d16340e04f5f5898875ba7eef7f768d","trans_date":"2023-04-28","amt":77.45},
      {"id":"SMa1a93ab146868ad8f02185e341c63ce2","trans_date":"2023-04-28","amt":100.69},
      {"id":"SMdfd2468d9dc6edff55b5615196b7e4d6","trans_date":"2023-04-28","amt":10.00},
      {"id":"SM5b63550287b56ced97d2dcc21cf82a66","trans_date":"2023-04-28","amt":60.00},
      {"id":"SMfe38aed45e01a8818345e918dee76ba9","trans_date":"2023-04-28","amt":81.53},
      {"id":"SMc05287913702468ac95242c182b28ec7","trans_date":"2023-04-28","amt":90.00},
      {"id":"SM90d25d334698497f2e656349cbdc7a85","trans_date":"2023-04-28","amt":120.00},
      {"id":"SMe50d3af017f85a198c75298119483150","trans_date":"2023-04-28","amt":35.00},
      {"id":"SM2a4f9a788f74ddcaae0e2848ecb0e9a9","trans_date":"2023-04-28","amt":135.00},
      {"id":"SM1d98880d9a101a0adcb9f2fdd9f6a70f","trans_date":"2023-04-28","amt":195.67},
      {"id":"SMb816d5f2a6f366184c007157ec6cb019","trans_date":"2023-04-28","amt":71.00},
      {"id":"SM8af70332a06d89694159cf7dce1a6b82","trans_date":"2023-04-28","amt":64.45},
      {"id":"SM0834ad4f8924da90ebd01b63ecc9a174","trans_date":"2023-04-28","amt":26.96},
      {"id":"SM5c20897dd5d9797c5c8fd16902f8ea88","trans_date":"2023-04-28","amt":50.00},
      {"id":"SM77798d3edcac82493e05d1af50b5ce75","trans_date":"2023-04-28","amt":106.57},
      {"id":"SMf5bdfd6e6314c5c72bb3d423c6d5bfb3","trans_date":"2023-04-28","amt":20.93},
      {"id":"SM96a9d81479ac73e803f98c5b1607cd24","trans_date":"2023-04-28","amt":52.87},
      {"id":"SMfe25c22d6d309bc8745c2fe84fb84ed1","trans_date":"2023-04-28","amt":25.00},
      {"id":"SMad74cd29c230820018175d08df9ad8d9","trans_date":"2023-04-28","amt":31.50},
      {"id":"SMa092bd131d8631bdefbdadffe7867053","trans_date":"2023-04-28","amt":149.38},
      {"id":"SM3ec548ced0e15470a23579becd77165c","trans_date":"2023-04-28","amt":30.00},
      {"id":"SMbe191b502dc494b1b1dd8687083fe8e8","trans_date":"2023-04-28","amt":95.00},
      {"id":"SMfcfb70272c306c024ccd8a6055bae571","trans_date":"2023-04-28","amt":88.71},
      {"id":"SM31b65e914c103484605bf0875865607b","trans_date":"2023-04-28","amt":143.15},
      {"id":"SM75c9fc8476a40eebeef467837e111537","trans_date":"2023-04-28","amt":41.21},
      {"id":"SM0beddd0cd42f4d22385fc9bc3365da50","trans_date":"2023-04-28","amt":25.00},
      {"id":"SM9d47e939da5774e8b8c1b7b51349412a","trans_date":"2023-04-28","amt":55.90},
      {"id":"SM7b4d257c43eafb8a4666ed0f04eb1bb8","trans_date":"2023-04-28","amt":20.00},
      {"id":"SM32fbe2736d9927b2ce3186ef463553cc","trans_date":"2023-04-28","amt":50.00},
      {"id":"SMce32ede40e5156e0b6e5b6a07367ef59","trans_date":"2023-04-28","amt":136.87},
      {"id":"SM518ad872acdc3f52688fc2ef9525693d","trans_date":"2023-04-28","amt":30.00},
      {"id":"SM7507bd723a27538c40aed7349d5c3b1a","trans_date":"2023-04-28","amt":40.94},
      {"id":"SM069fa7a7485fc8f104f393daa0dfe290","trans_date":"2023-04-28","amt":50.00},
      {"id":"SM039b776b85c27f38a983dfe79dfddc02","trans_date":"2023-04-28","amt":50.00},
      {"id":"SM26f3b9a749bcd51e556db83ca6552743","trans_date":"2023-04-28","amt":40.00},
      {"id":"SMf18b8d173bd513e3670d9ea7063e4513","trans_date":"2023-04-28","amt":118.72},
      {"id":"SM86fe2a2653e7a7d43514b64ceaf1163b","trans_date":"2023-04-28","amt":31.31},
      {"id":"SMe535f333268d082932f11760a9e65400","trans_date":"2023-04-28","amt":50.00},
      {"id":"SMbdf53f9fd6153fcba36a34420d27a69a","trans_date":"2023-04-28","amt":95.07},
      {"id":"SM9439ad9a160ae2add15d799c121cf30d","trans_date":"2023-04-28","amt":50.00},
      {"id":"SMa656e7fea6b9c1803736adcecae2d262","trans_date":"2023-04-28","amt":77.31},
      {"id":"SMe5a081ef92847e6bc35ada6d87c955ba","trans_date":"2023-04-28","amt":12.58},
      {"id":"SM85219ecb35fdbeb138b45a5cb7045f7c","trans_date":"2023-04-28","amt":33.10},
      {"id":"SMb5ae7d520f8ba074f5df5b314893706b","trans_date":"2023-04-28","amt":19.50},
      {"id":"SMdd7a5545e14e757c4b344e14b8c87616","trans_date":"2023-04-28","amt":91.77},
      {"id":"SMe974a78157de8922b6a2e547c78f42f6","trans_date":"2023-04-28","amt":35.00},
      {"id":"SM8ddc332432ce4d3f6ee3819f6d4bfa5c","trans_date":"2023-04-28","amt":31.68},
      {"id":"SM767a21362654eb77b8f9c5eceeb4901d","trans_date":"2023-04-28","amt":60.00},
      {"id":"SM3b252165b46fb8d9d3b2eefa53c85fcb","trans_date":"2023-04-28","amt":27.92},
      {"id":"SM664e545ad73de844ed9b71e03a93eed4","trans_date":"2023-04-28","amt":113.88},
      {"id":"SMc9fbbce49c3aab0bfc807df49c3818fa","trans_date":"2023-04-28","amt":25.00},
      {"id":"SM15eb42ed3da1959163a8b9ed6be25161","trans_date":"2023-04-28","amt":15.00},
      {"id":"SM0676fa97c80abff20bdeba936e52be43","trans_date":"2023-04-28","amt":25.00},
       
    ]
    
    balance_data.forEach(payment => {
      upsertMessagePayment(container, payment );
    });
      

    // query to return all children in a family
    const querySpec = {
      query: "SELECT m.message_type, IS_DEFINED(m.message_clicks.isClicked) AS isClicked, COUNT(m.id) AS cnt, SUM(m.payments.paid_amt) AS paid_amt "+
      "FROM Messages m "+
      "WHERE m.id<>'SMxxx' "+
      "GROUP BY m.message_type, m.message_clicks.isClicked",
    }
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
  
  }


  async function upsertMessagePayment(container, payment) {
    
    const c = await container.item( payment.id, payment.id );
    const {resource} = await c.read();

    const operations = [
      { op: 'add',  path: '/payments', value: {}},
      { op: 'add',  path: '/payments/trans_date', value: payment.trans_date},
      { op: 'add',  path: '/payments/paid_amt', value: payment.amt},
    ];

    const r = await c.patch( operations );
    return r;
  }