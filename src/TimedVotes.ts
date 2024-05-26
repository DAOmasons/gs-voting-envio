import { TimedVotesContract } from 'generated';

TimedVotesContract.Initialized.loader(() => {});

TimedVotesContract.Initialized.handler(({ event, context }) => {
  context.TVParams.set({
    id: event.srcAddress,
    voteDuration: event.params.duration,
  });
});

TimedVotesContract.VotingStarted.loader(() => {});

TimedVotesContract.VotingStarted.handlerAsync(async ({ event, context }) => {
  const module = await context.StemModule.get(event.srcAddress);

  if (module === undefined) {
    context.log.error(
      `StemModule not found: Module address ${event.srcAddress}`
    );
    return;
  }
  if (module.contestAddress === undefined) {
    context.log.error(
      `StemModule contestAddress not found: contest address ${module.contestAddress}`
    );
    return;
  }

  const gsVoting = await context.GrantShipsVoting.get(module.contestAddress);

  if (gsVoting === undefined) {
    context.log.error(
      `GrantShipsVoting not found: Contest address ${module.contestAddress}`
    );
    return;
  }

  context.GrantShipsVoting.set({
    ...gsVoting,
    startTime: event.params.startTime,
    endTime: event.params.endTime,
  });
});

TimedVotesContract.VoteCast.loader(() => {});

TimedVotesContract.VoteCast.handlerAsync(async ({ event, context }) => {
  const module = await context.StemModule.get(event.srcAddress);

  if (module === undefined) {
    context.log.error(
      `StemModule not found: Module address ${event.srcAddress}`
    );
    return;
  }

  if (module.contestAddress === undefined) {
    context.log.error(
      `StemModule contestAddress not found: contest address ${module.contestAddress}`
    );
    return;
  }

  const gsVoting = await context.GrantShipsVoting.get(module.contestAddress);

  if (gsVoting === undefined) {
    context.log.error(
      `GrantShipsVoting not found: Contest address ${module.contestAddress}`
    );
    return;
  }

  const choice = await context.ShipChoice.get(
    `choice-${event.params.choiceId}-${gsVoting.id}`
  );

  if (choice === undefined) {
    context.log.error(`ShipChoice not found: choice id ${choice}`);
    return;
  }

  const voteId = `vote-${event.transactionHash}-${event.logIndex}`;

  context.ShipVote.set({
    id: voteId,
    choice_id: choice.id,
    voter: event.params.voter,
    amount: event.params.amount,
    contest_id: gsVoting.id,
    mdProtocol: event.params._3[0],
    mdPointer: event.params._3[1],
  });

  context.ShipChoice.set({
    ...choice,
    voteTally: choice.voteTally + event.params.amount,
  });

  context.GrantShipsVoting.set({
    ...gsVoting,
    totalVotes: gsVoting.totalVotes + 1n,
  });
});
