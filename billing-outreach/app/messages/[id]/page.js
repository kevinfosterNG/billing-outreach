

export default async function MessagePage({
    params,
    searchParams,
}) {
    console.log(searchParams);

    await new Promise(r => setTimeout(r, 2000));

    return (
        <div>
            <h1>Messages</h1>
            <br/>
            <div>{params.id}</div>
            <div>{searchParams['four']}</div>
          
        </div>
    )
}
