import { useState, useEffect } from 'react';
import Web3 from 'web3';
import SafeAppsSDK, { ChainInfo } from '@gnosis.pm/safe-apps-sdk';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { RpcUri, RPC_AUTHENTICATION } from '@gnosis.pm/safe-react-gateway-sdk';

import InterfaceRepository from './interfaceRepository';
import { InterfaceRepo } from './interfaceRepository';

export interface Services {
  sdk: SafeAppsSDK;
  chainInfo: ChainInfo | undefined;
  web3: Web3 | undefined;
  interfaceRepo: InterfaceRepo | undefined;
}

export default function useServices(): Services {
  const { sdk } = useSafeAppsSDK();
  const [web3, setWeb3] = useState<Web3 | undefined>();
  const [chainInfo, setChainInfo] = useState<ChainInfo>();
  const [interfaceRepo, setInterfaceRepo] = useState<InterfaceRepository | undefined>();

  useEffect(() => {
    if (!chainInfo) {
      return;
    }

    const rpcUrl = formatRpcServiceUrl(chainInfo.safeAppsRpcUri);

    if (!rpcUrl) {
      throw Error(`RPC URL not defined for chain id ${chainInfo.chainId}`);
    }

    const web3Instance = new Web3(rpcUrl);
    const interfaceRepo = new InterfaceRepository(chainInfo, web3Instance);

    setWeb3(web3Instance);
    setInterfaceRepo(interfaceRepo);
  }, [chainInfo]);

  useEffect(() => {
    const getChainInfo = async () => {
      try {
        const chainInfo = await sdk.safe.getChainInfo();
        setChainInfo(chainInfo);
      } catch (error) {
        console.error('Unable to get chain info:', error);
      }
    };

    getChainInfo();
  }, [sdk.safe]);

  return {
    sdk,
    chainInfo,
    web3,
    interfaceRepo,
  };
}

const RPC_TOKEN = process.env.REACT_APP_RPC_TOKEN;

const formatRpcServiceUrl = ({ authentication, value }: RpcUri): string => {
  const isAuthenticatedRpc = authentication === RPC_AUTHENTICATION.API_KEY_PATH;
  const safeAppsRpcUri = isAuthenticatedRpc && RPC_TOKEN ? `${value}${RPC_TOKEN}` : value;
  return safeAppsRpcUri;
};
