import {
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
  useNetwork,
  useAddress,
  useDisconnect,
} from '@thirdweb-dev/react';

import { 
  Button
 } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ConnectWallet = () => {
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const disconnectWallet = useDisconnect();
  const address = useAddress();
  const network = useNetwork();

  // If a wallet is connected, show address, chainId and disconnect button
  if (address) {
    return (
      <div>
        <br />
        <br />
        <h6>
          Connected as : {address}
        </h6>
        <br />
        <Button style={{width: "100%"}} size="lg" variant="outline-info"   onClick={disconnectWallet}>
          Disconnect
        </Button>
      </div>
    );
  }

  // If no wallet is connected, show connect wallet options
  return (
    <div>
      <Button style={{width: "100%"}} size="lg" variant="outline-success"  onClick={() => connectWithMetamask()} id="connect-mm">
        Connect metamask and buy
      </Button>
    </div>
  );
};
