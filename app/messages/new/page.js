
export default async function MessagePage() {

    return (
      <form action="/api/messages" method="post">
        <FormItem id="email" name="Email" type="text" label="Email:" />
        <FormItem id="first" name="first" type="text" label="First name:" />
        <FormItem id="last" name="last" type="text" label="Last name:" />
        <FormItem id="title" name="title" type="text" label="Title:" />
        <button type="submit">Submit</button>
      </form>
    )
}

function FormItem ({ id, name, type, label}) {
  return (
    <>
        <label for={`${name}`}>{label}</label>
        <input type={`${type}`} id={`${id}`} name={`${name}`} />
        <br/>
    </>
  );
};
