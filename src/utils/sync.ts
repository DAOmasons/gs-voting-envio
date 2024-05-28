import { eventLog, transactionEntity } from 'generated';

export const addTransaction = (
  event: eventLog<unknown>,
  set: (_1: transactionEntity) => void
) => {
  set({
    id: event.transactionHash,
    blockNumber: BigInt(event.blockNumber),
    srcAddress: event.srcAddress,
    txOrigin: event.txOrigin,
    txHash: event.transactionHash,
  });
};
