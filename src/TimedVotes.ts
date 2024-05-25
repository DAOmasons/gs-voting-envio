import { TimedVotesContract } from 'generated';

TimedVotesContract.Initialized.loader(() => {});

TimedVotesContract.Initialized.handler(({ event, context }) => {
  context.TVParams.set({
    id: event.srcAddress,
    voteDuration: event.params.duration,
  });
});
