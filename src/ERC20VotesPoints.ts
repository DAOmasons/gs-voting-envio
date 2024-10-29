import { ERC20VotesPoints } from 'generated';
import { addTransaction } from './utils/sync';

ERC20VotesPoints.Initialized.handler(async ({ event, context }) => {
  context.ERCPointParams.set({
    id: event.srcAddress,
    voteTokenAddress: event.params.token,
    votingCheckpoint: event.params.votingCheckpoint,
  });
  addTransaction(event, context.EnvioTX.set);
});
