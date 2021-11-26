import { Text, Title, Link, AddressInput } from '@gnosis.pm/safe-react-components';
import React, { ReactElement, useState, useCallback, useEffect } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import styled from 'styled-components';
import { InputAdornment } from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';

import { ContractInterface } from '../hooks/useServices/interfaceRepository';
import useServices from '../hooks/useServices';
import { Builder } from './Builder';
import { ProposedTransaction } from '../typings/models';

const Wrapper = styled.div`
  display: flex;
  justify-content: left;
  flex-direction: column;
  padding: 24px;
  width: 520px;
`;

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`;

const StyledText = styled(Text)`
  margin-bottom: 15px;
`;

const StyledWarningText = styled(Text)`
  margin-top: 5px;
`;

const CheckIconAddressAdornment = styled(CheckCircle)`
  color: #03ae60;
  height: 20px;
`;

const Dashboard = (): ReactElement => {
  const { sdk, safe } = useSafeAppsSDK();

  const services = useServices(safe.chainId);

  const [addressOrAbi, setAddressOrAbi] = useState('');
  const [isABILoading, setIsABILoading] = useState(false);

  const [contract, setContract] = useState<ContractInterface | null>(null);
  const [loadContractError, setLoadContractError] = useState('');

  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);

  const handleAddTransaction = useCallback(
    (tx: ProposedTransaction) => {
      setTransactions([...transactions, tx]);
    },
    [transactions],
  );

  const handleRemoveTransaction = useCallback(
    (index: number) => {
      const newTxs = transactions.slice();
      newTxs.splice(index, 1);
      setTransactions(newTxs);
    },
    [transactions],
  );

  const handleSubmitTransactions = useCallback(async () => {
    if (!transactions.length) {
      return;
    }

    try {
      await sdk.txs
        .send({ txs: transactions.map((transaction: ProposedTransaction) => transaction.raw) })
        .catch(console.error);
      setTransactions([]);
    } catch (e) {
      console.error('Error sending transactions:', e);
    }
  }, [sdk.txs, transactions]);

  // Load contract from address or ABI
  useEffect(() => {
    const loadContract = async (addressOrAbi: string) => {
      setContract(null);
      setLoadContractError('');

      if (!addressOrAbi || !services.web3 || !services.interfaceRepo) {
        return;
      }

      try {
        setIsABILoading(true);
        const contract = await services.interfaceRepo.loadAbi(addressOrAbi);
        setContract(contract);
      } catch (e) {
        setContract(null);
        setLoadContractError('No ABI found for this address');
        console.error(e);
      }
      setIsABILoading(false);
    };

    loadContract(addressOrAbi);
  }, [addressOrAbi, services.interfaceRepo, services.web3]);

  const getAddressFromDomain = (name: string): Promise<string> => {
    return services?.web3?.eth.ens.getAddress(name) || new Promise((resolve) => resolve(name));
  };

  const isValidAddress = useCallback(
    (address: string | null) => {
      if (!address) {
        return false;
      }
      return services?.web3?.utils.isAddress(address);
    },
    [services.web3],
  );

  const isValidAddressOrContract = (isValidAddress(addressOrAbi) || contract) && !isABILoading;

  return (
    <Wrapper>
      <StyledTitle size="sm">Multisend transaction builder</StyledTitle>
      <StyledText size="sm">
        This app allows you to build a custom multisend transaction. Enter a Ethereum contract address or ABI to get
        started.{' '}
        <Link
          href="https://help.gnosis-safe.io/en/articles/4680071-create-a-batched-transaction-with-the-transaction-builder-safe-app"
          size="lg"
          target="_blank"
          rel="noreferrer"
        >
          Learn how to use the transaction builder.
        </Link>
      </StyledText>

      {/* ABI or Address Input */}
      <AddressInput
        id={'address-or-ABI-input'}
        name="addressOrAbi"
        label="Address or ABI"
        address={addressOrAbi}
        placeholder={'Enter Address, ENS Name or ABI'}
        showNetworkPrefix={!!services.networkPrefix}
        networkPrefix={services.networkPrefix}
        error={!isValidAddressOrContract ? loadContractError : ''}
        showLoadingSpinner={isABILoading}
        getAddressFromDomain={getAddressFromDomain}
        onChangeAddress={(addressOrAbi: string) => setAddressOrAbi(addressOrAbi)}
        InputProps={{
          endAdornment: isValidAddressOrContract && (
            <InputAdornment position="end">
              <CheckIconAddressAdornment />
            </InputAdornment>
          ),
        }}
      />

      {/* ABI Warning */}
      {isValidAddressOrContract && !contract && (
        <StyledWarningText color="warning" size="lg">
          No ABI found for this address
        </StyledWarningText>
      )}

      {/* Builder */}
      {isValidAddressOrContract && (
        <Builder
          contract={contract}
          to={addressOrAbi}
          chainId={safe.chainId}
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
          onRemoveTransaction={handleRemoveTransaction}
          onSubmitTransactions={handleSubmitTransactions}
          networkPrefix={services.networkPrefix}
          getAddressFromDomain={getAddressFromDomain}
        />
      )}
    </Wrapper>
  );
};

export default Dashboard;
