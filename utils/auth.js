import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import { getContainer, getClient, getApprovedUser } from "@/utils/DatabaseWrapper";
import { compare, hash, genSalt } from "bcryptjs";

export const authOptions = {
    session: {
        strategy: "jwt",
      },

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await getUser("Users","email",credentials.email);
        // console.log("Get user returned: ",user);
        // console.log("Compare (user provided): ", credentials.password);
        // try {
        //   const salt = await genSalt(10);
        //   console.log("Compare (user provided): ", await hash( credentials.password, salt ));
        // } catch(hashE) {
        //   console.log("Hash failed: ", hashE);
        // }
        // console.log("against (truth)",user.password);
        // console.log("Compared: ", await compare(credentials.password, user.password));
        
        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    ],callbacks: {
      session: ({ session, token }) => {
        //console.log("Session Callback", { session, token });
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            randomKey: token.randomKey,
          },
        };
      },
      jwt: ({ token, user }) => {
        //console.log("JWT Callback", { token, user });
        if (user) {
          const u = user;
          return {
            ...token,
            id: u.id,
            randomKey: u.randomKey,
          };
        }
        return token;
      },
    },
  };
  

async function getUser(containerName,column,value) {
  const client = await getClient();
  const container = await getContainer(client, containerName)
  const data = await getApprovedUser(container,value).then((r)=>r[0])
  return data;
}

export default NextAuth(authOptions)