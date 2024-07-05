import { ERC20VotesPointsContract } from 'generated';
import { addTransaction } from './utils/sync';

ERC20VotesPointsContract.Initialized.loader(() => {});

ERC20VotesPointsContract.Initialized.handler(({ event, context }) => {
  context.log.info('!!!!!! RAN');
  context.ERCPointParams.set({
    id: event.srcAddress,
    voteTokenAddress: event.params.token,
    votingCheckpoint: event.params.votingCheckpoint,
  });
  addTransaction(event, context.EnvioTX.set);
});
