async function getMessage(id) {
    //await new Promise(r => setTimeout(r, 2000));
    const data  = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const message = await data.json();
  
    return message;
  }

export default async function MessagePage({
    params,
    searchParams,
}) {
    //console.log(searchParams);
    console.log("messages/page.js hit");
    const message = await getMessage( params.id );
    
    return (
        <div>
            <h1>Message #({params.id})</h1>
            <hr/>
            <div>
                <label>UserID:</label>
                <div>{message.userId}</div>
            </div>
            <div>
                <label>Body:</label>
                <div>{message.body}</div>
            </div>
            <div>
                <label>Title:</label>
                <div>{message.title}</div>
            </div>
          
        </div>
    )
}
