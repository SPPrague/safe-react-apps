import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { RpcUri, RPC_AUTHENTICATION } from '@gnosis.pm/safe-react-gateway-sdk';

function useWeb3() {
  const [web3, setWeb3] = useState<Web3 | undefined>();

  const { sdk } = useSafeAppsSDK();

  useEffect(() => {
    const setWeb3Instance = async () => {
      const chainInfo = await sdk.safe.getChainInfo();

      if (!chainInfo) {
        return;
      }

      const rpcUrl = formatRpcServiceUrl(chainInfo.safeAppsRpcUri);

      if (!rpcUrl) {
        throw Error(`RPC URL not defined for ${chainInfo.chainName} chain`);
      }

      const web3Instance = new Web3(rpcUrl);

      setWeb3(web3Instance);
    };

    setWeb3Instance();
  }, [sdk.safe]);

  return {
    web3,
  };
}

export default useWeb3;

const RPC_TOKEN = process.env.REACT_APP_RPC_TOKEN;

const formatRpcServiceUrl = ({ authentication, value }: RpcUri): string => {
  const isAuthenticatedRpc = authentication === RPC_AUTHENTICATION.API_KEY_PATH;
  const safeAppsRpcUri = isAuthenticatedRpc && RPC_TOKEN ? `${value}${RPC_TOKEN}` : value;
  return safeAppsRpcUri;
};
