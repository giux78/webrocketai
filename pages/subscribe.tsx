import { SessionProvider, useSession} from "next-auth/react"
import { getToken } from "next-auth/jwt"
import { useContext } from 'react'
import Layout from "../components/layout"
import { SubsctiptionContext } from "../components/context";
import { 
  Button,
} from "react-bootstrap"; 

export default function Subscribe() {
  const { data: session, status } = useSession()
  const {subscribed, setSubscribed} = useContext(SubsctiptionContext);

  const SERVER_URL =  'http://localhost:9090/v1.0'
  console.log(session)
  console.log(status)

  const subscribe = async (event) => {
    event.preventDefault();
    const res = await fetch(SERVER_URL + "/subscribe/stripe" , {
        headers: new Headers({
          'accept': '*/*',
          'content-type': 'application/json'
        }),
        //mode: 'no-cors',
        method: "GET"
       // redirect: 'follow'
    })

      const result = await res.json() //.json()
      console.log(result)
      //window.location.href = test.link_stripe
      window.open(result.link_stripe, '_blank', 'noopener,noreferrer');
  }
  
  return (
    <Layout>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      {session?.subStatus !== 'active' && session?.user && (
          <Button style={{width: "100%"}} 
                  size="lg" 
                  variant="outline-success"
                  onClick={event => subscribe(event)} id="checkout-button">
              Subscribe
          </Button>
      )}
    </Layout>
  )
}
