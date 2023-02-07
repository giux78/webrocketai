import { SessionProvider } from "next-auth/react"
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

import type { AppProps } from "next/app"
import type { Session } from "next-auth"
import '../generate.css'
import "../BlockUI.css";
import "./styles.css"
import React, { useState } from "react";
import { SubsctiptionContext } from "../components/context";
import { ChakraProvider } from '@chakra-ui/react'

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const [subscribed, setSubscribed] = useState<boolean>(false);
  
  return (
    <ChakraProvider>
      <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
      <SessionProvider session={session}>
        <SubsctiptionContext.Provider value={{subscribed, setSubscribed}}>
          <Component {...pageProps} />
        </SubsctiptionContext.Provider>
      </SessionProvider>
      </ThirdwebProvider>
    </ChakraProvider>

  )
}
