import { eventLog, envioTX } from 'generated';

export const addTransaction = (
  event: eventLog<unknown>,
  set: (_1: envioTX) => void
) => {
  set({
    id: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    srcAddress: event.srcAddress,
    txOrigin: event.transaction.from,
    txHash: event.transaction.hash,
  });
};
