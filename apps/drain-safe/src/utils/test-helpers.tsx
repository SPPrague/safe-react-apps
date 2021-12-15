import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import { FEATURES, GAS_PRICE_TYPE, RPC_AUTHENTICATION } from '@gnosis.pm/safe-react-gateway-sdk';

export const mockTheme = {
  buttons: {
    size: {
      lg: { height: '' },
    },
  },
  colors: {
    disabled: {
      opacity: 0,
    },
  },
  fonts: {
    fontFamily: '',
  },
  text: {
    size: {
      sm: {
        fontSize: '',
        lineHeight: '',
      },
      md: {
        fontSize: '',
        lineHeight: '',
      },
      lg: {
        fontSize: '',
        lineHeight: '',
      },
      xl: {
        fontSize: '',
        lineHeight: '',
      },
    },
  },
  title: {
    size: {
      md: {
        fontSize: '32px',
        lineHeight: '36px',
      },
    },
  },
};

export const mockTxsRequest = {
  txs: [
    {
      data: '0x',
      to: '0x301812eb4c89766875eFe61460f7a8bBC0CadB96',
      value: '949938510499549077',
    },
    {
      data: '0xa9059cbb000000000000000000000000301812eb4c89766875efe61460f7a8bbc0cadb960000000000000000000000000000000000000000000000008ac7230489e80000',
      to: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
      value: '0',
    },
    {
      data: '0xa9059cbb000000000000000000000000301812eb4c89766875efe61460f7a8bbc0cadb960000000000000000000000000000000000000004522aeecb72953a54801c0000',
      to: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
      value: '0',
    },
    {
      data: '0xa9059cbb000000000000000000000000301812eb4c89766875efe61460f7a8bbc0cadb960000000000000000000000000000000000000000000000000001219e40046889',
      to: '0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85',
      value: '0',
    },
    {
      data: '0xa9059cbb000000000000000000000000301812eb4c89766875efe61460f7a8bbc0cadb960000000000000000000000000000000000000000000000000e92596fd629002c',
      to: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      value: '0',
    },
  ],
};

export const mockInitialBalances = [
  {
    tokenInfo: {
      type: 'NATIVE_TOKEN',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      symbol: 'ETH',
      name: 'Ether',
      logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
    },
    balance: '949938510499549077',
    fiatBalance: '3912.43897',
    fiatConversion: '4118.62339607',
  },
  {
    tokenInfo: {
      type: 'ERC20',
      address: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
      decimals: 18,
      symbol: 'LINK',
      name: 'ChainLink Token',
      logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0x01BE23585060835E02B77ef475b0Cc51aA1e0709.png',
    },
    balance: '10000000000000000000',
    fiatBalance: '32.17898',
    fiatConversion: '3.2178980896091103',
  },
  {
    tokenInfo: {
      type: 'ERC20',
      address: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
      decimals: 18,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735.png',
    },
    balance: '342342323423000000000000000000',
    fiatBalance: '24.89904',
    fiatConversion: '0.00000000007273142207527887',
  },
  {
    tokenInfo: {
      type: 'ERC20',
      address: '0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85',
      decimals: 18,
      symbol: 'MKR',
      name: 'Maker',
      logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85.png',
    },
    balance: '318438539290761',
    fiatBalance: '0.00000',
    fiatConversion: '0.0',
  },
  {
    tokenInfo: {
      type: 'ERC20',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      decimals: 18,
      symbol: 'UNI',
      name: 'Uniswap',
      logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984.png',
    },
    balance: '1050000000000000044',
    fiatBalance: '3971.92584',
    fiatConversion: '3782.786514637171',
  },
];

export const mockChainInfo = {
  transactionService: 'https://safe-transaction.rinkeby.staging.gnosisdev.com',
  chainName: 'Rinkeby',
  chainId: '4',
  shortName: 'rin',
  description: 'description',
  l2: false,
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUri: 'https://safe-transaction-assets.staging.gnosisdev.com/chains/4/currency_logo.png',
  },
  safeAppsRpcUri: {
    authentication: RPC_AUTHENTICATION.NO_AUTHENTICATION,
    value: 'https://api.url/rpc',
  },
  publicRpcUri: {
    authentication: RPC_AUTHENTICATION.API_KEY_PATH,
    value: 'https://rinkeby.infura.io/v3/',
  },
  blockExplorerUriTemplate: {
    address: 'https://rinkeby.etherscan.io/address/{{address}}',
    txHash: 'https://rinkeby.etherscan.io/tx/{{txHash}}',
    api: 'https://api-rinkeby.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
  },
  theme: {
    textColor: '#ffffff',
    backgroundColor: '#E8673C',
  },
  ensRegistryAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  gasPrice: [
    {
      type: GAS_PRICE_TYPE.ORACLE,
      uri: 'https://api-rinkeby.etherscan.io/api?module=gastracker&action=gasoracle',
      gasParameter: 'FastGasPrice',
      gweiFactor: '1000000000.000000000',
    },
  ],
  disabledWallets: ['fortmatic', 'lattice'],
  features: [
    FEATURES.CONTRACT_INTERACTION,
    FEATURES.DOMAIN_LOOKUP,
    FEATURES.ERC721,
    FEATURES.SAFE_APPS,
    FEATURES.SPENDING_LIMIT,
  ],
};

export function renderWithProviders(ui: JSX.Element) {
  return {
    ...render(<ThemeProvider theme={mockTheme}>{ui}</ThemeProvider>),
  };
}
