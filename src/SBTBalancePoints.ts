import { SBTBalancePointsContract } from 'generated';
import { addTransaction } from './utils/sync';

SBTBalancePointsContract.Initialized.loader(() => {});

SBTBalancePointsContract.Initialized.handler(({ event, context }) => {
  context.SBTBalParams.set({
    id: event.srcAddress,
    voteTokenAddress: event.params.token,
  });
  addTransaction(event, context.EnvioTX.set);
});
