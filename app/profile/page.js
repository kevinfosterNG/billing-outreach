import { User } from "@/components/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export default async function Profile() {
    const session = await getServerSession(authOptions);
    console.log(session);

    return (
        <div className="content">
            <h1>Server Session</h1>
            <pre>{JSON.stringify(session)}</pre>
            <User />
        </div>
    )
}