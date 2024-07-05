import { ERC20VotesPointsContract } from 'generated';
import { addTransaction } from './utils/sync';

ERC20VotesPointsContract.Initialized.loader(() => {});

ERC20VotesPointsContract.Initialized.handler(({ event, context }) => {
  context.SBTBalParams.set({
    id: event.srcAddress,
    voteTokenAddress: event.params.token,
  });
  addTransaction(event, context.EnvioTX.set);
});
