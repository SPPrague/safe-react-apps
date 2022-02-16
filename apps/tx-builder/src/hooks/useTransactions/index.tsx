import { useCallback, useState } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

import { ProposedTransaction } from '../../typings/models';

export default function useTransactions() {
  const [transactions, setTransactions] = useState<ProposedTransaction[]>([]);
  const { sdk } = useSafeAppsSDK();

  const handleAddTransaction = useCallback(
    (newTransaction: ProposedTransaction) => {
      setTransactions([...transactions, newTransaction]);
    },
    [transactions],
  );

  const handleReplaceTransaction = useCallback(
    (newTransaction: ProposedTransaction) => {
      const index = transactions.findIndex((transaction) => transaction.id === newTransaction.id);
      if (index !== -1) {
        const newTransactions = [...transactions];
        newTransactions[index] = newTransaction;

        setTransactions(newTransactions);
      }
    },
    [transactions],
  );

  const handleRemoveAllTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

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
      await sdk.txs.send({ txs: transactions.map((transaction) => transaction.raw) });
      setTransactions([]);
    } catch (e) {
      console.error('Error sending transactions:', e);
    }
  }, [sdk.txs, transactions]);

  const handleReorderTransactions = useCallback((sourceIndex, destinationIndex) => {
    setTransactions((transactions) => {
      const transactionToMove = transactions[sourceIndex];
      transactions.splice(sourceIndex, 1); // we remove the transaction from the list
      transactions.splice(destinationIndex, 0, transactionToMove); // we add the transaction in the new position
      return transactions;
    });
  }, []);

  return {
    transactions,
    handleAddTransaction,
    handleRemoveTransaction,
    handleSubmitTransactions,
    handleRemoveAllTransactions,
    handleReorderTransactions,
    handleReplaceTransaction,
  };
}
