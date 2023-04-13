
async function getMessage(id) {
    const messageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/messages/${id}`;

    //await new Promise(r => setTimeout(r, 2000));
    const data  = await fetch( ${messageUrl} );
    const message = await data.json();
  
    return message;
  }

export default async function MessagePage({
    params,
    searchParams,
}) {
    //console.log(searchParams);
    console.log("messages/[id]/ page hit");
    const message = await getMessage( params.id );
    
    return (
        <div>
            <h1>Message #({params.id})</h1>
            <hr/>
            <div>
                <label>status:</label>
                <div>{message.status}</div>
            </div>
            <div>
                <label>To:</label>
                <div>{message.to}</div>
            </div>
            <div>
                <label>From:</label>
                <div>{message.from}</div>
            </div>
            <div>
                <label>Body:</label>
                <div>{message.body}</div>
            </div>
            <div>
                <label>numSegments:</label>
                <div>{message.numSegments}</div>
            </div>
            <div>
                <label>direction:</label>
                <div>{message.direction}</div>
            </div>
            <div>
                <label>dateCreated:</label>
                <div>{message.dateCreated}</div>
            </div>
            <div>
                <label>dateUpdated:</label>
                <div>{message.dateUpdated}</div>
            </div>
            <div>
                <label>numSegments:</label>
                <div>{message.numSegments}</div>
            </div>
            <div>
                <label>price:</label>
                <div>{message.price}</div>
            </div>
            <div>
                <label>status:</label>
                <div>{message.status}</div>
            </div>
            
            <div>
                <label>priceUnit:</label>
                <div>{message.priceUnit}</div>
            </div>
            <div>
                <label>errorMessage:</label>
                <div>{message.errorMessage}</div>
            </div>
            <div>
                <label>errorCode:</label>
                <div>{message.errorCode}</div>
            </div>
          <hr/>
        </div>
    )
}
