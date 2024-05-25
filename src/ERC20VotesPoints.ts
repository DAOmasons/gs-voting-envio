import { ERC20VotesPointsContract } from 'generated';

ERC20VotesPointsContract.Initialized.loader(() => {});

ERC20VotesPointsContract.Initialized.handler(({ event, context }) => {
  context.ERCPointParams.set({
    id: event.srcAddress,
    voteTokenAddress: event.params.token,
    votingCheckpoint: event.params.votingCheckpoint,
  });
});
