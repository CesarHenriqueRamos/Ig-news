import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import {query as q} from 'faunadb';
import { fauna } from "@/pages/services/fauna";

interface UserProps{
  user:{
    email:string;
  }
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  // A database is optional, but required to persist accounts in a database
  callbacks: {
    async session(session:any){
      try{
        const userActiveSubscription = fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              )
            ])
          )
        )
        return {
          ...session,
          activeSubscription:userActiveSubscription
        }
      }catch{
        return {
          ...session,
          activeSubscription:null
        }
      }
    },
    async signIn({user}:any) {

      const {email} = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), q.Casefold(user.email)),
              ),
            ),
            q.Create(q.Collection('users'), { data: { email } }),
            q.Get(q.Match(q.Index('user_by_email'), q.Casefold(user.email))),
          ),
        );
        return true
      } catch {
        return false;
      }
      
    }
  }
}
export default NextAuth(authOptions)