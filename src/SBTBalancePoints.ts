import { SBTBalancePoints } from 'generated';
import { addTransaction } from './utils/sync';

SBTBalancePoints.Initialized.handler(async ({ event, context }) => {
  context.SBTBalParams.set({
    id: event.srcAddress,
    voteTokenAddress: event.params.token,
  });
  addTransaction(event, context.EnvioTX.set);
});
