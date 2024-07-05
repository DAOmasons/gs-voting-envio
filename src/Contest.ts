import { Contest_v0_1_0Contract, GrantShipsVotingEntity } from 'generated';
import { isGrantShipsVoting } from './utils/dynamicIndexing';
import { addTransaction } from './utils/sync';
import { ContestStatus } from './utils/constants';

Contest_v0_1_0Contract.ContestInitialized.loader(({ event, context }) => {
  context.ContestClone.load(event.srcAddress);

  context.StemModule.load(event.params.votesModule, undefined);
  context.StemModule.load(event.params.pointsModule, undefined);
  context.StemModule.load(event.params.choicesModule, undefined);
  context.StemModule.load(event.params.executionModule, undefined);

  context.HALParams.load(event.params.choicesModule);
  context.TVParams.load(event.params.votesModule);
  context.ERCPointParams.load(event.params.pointsModule);
  // context.SBTBalParams.load(event.params.pointsModule);
});

Contest_v0_1_0Contract.ContestInitialized.handler(({ event, context }) => {
  const contestClone = context.ContestClone.get(event.srcAddress);
  const votingModule = context.StemModule.get(event.params.votesModule);
  const pointsModule = context.StemModule.get(event.params.pointsModule);
  const choicesModule = context.StemModule.get(event.params.choicesModule);
  const executionModule = context.StemModule.get(event.params.executionModule);

  const halParams = context.HALParams.get(event.params.choicesModule);
  const tvParams = context.TVParams.get(event.params.votesModule);
  const ercPointParams = context.ERCPointParams.get(event.params.pointsModule);
  // const sbtBalParams = context.SBTBalParams.get(event.params.pointsModule);

  if (
    contestClone === undefined ||
    votingModule === undefined ||
    pointsModule === undefined ||
    choicesModule === undefined ||
    executionModule === undefined
  ) {
    if (contestClone === undefined)
      context.log.error(
        `ContestClone not found: Contest address ${event.srcAddress}`
      );
    if (votingModule === undefined)
      context.log.error(
        `VotingModule not found: Module address ${event.params.votesModule}`
      );
    if (pointsModule === undefined)
      context.log.error(
        `PointsModule not found: Module address ${event.params.pointsModule}`
      );
    if (choicesModule === undefined)
      context.log.error(
        `ChoicesModule not found: Module address ${event.params.choicesModule}`
      );
    if (executionModule === undefined)
      context.log.error(
        `ExecutionModule not found: Module address ${event.params.executionModule}`
      );

    return;
  }

  context.StemModule.set({
    ...executionModule,
    contestAddress: contestClone.contestAddress,
    contest_id: contestClone.contestAddress,
  });

  context.StemModule.set({
    ...votingModule,
    contestAddress: contestClone.contestAddress,
    contest_id: contestClone.contestAddress,
  });

  context.StemModule.set({
    ...pointsModule,
    contestAddress: contestClone.contestAddress,
    contest_id: contestClone.contestAddress,
  });

  context.StemModule.set({
    ...choicesModule,
    contestAddress: contestClone.contestAddress,
    contest_id: contestClone.contestAddress,
  });

  context.Contest.set({
    id: contestClone.contestAddress,
    contestAddress: contestClone.contestAddress,
    contestVersion: contestClone.contestVersion,
    filterTag: contestClone.filterTag,
    contestStatus: event.params.status,
    votesModule_id: event.params.votesModule,
    pointsModule_id: event.params.pointsModule,
    choicesModule_id: event.params.choicesModule,
    executionModule_id: event.params.executionModule,
    isContinuous: event.params.isContinuous,
    isRetractable: event.params.isRetractable,
  });

  if (
    isGrantShipsVoting({
      choiceModuleName: choicesModule.moduleName,
      votesModuleName: votingModule.moduleName,
      pointsModuleName: pointsModule.moduleName,
      executionModuleName: executionModule.moduleName,
      contestVersion: contestClone.contestVersion,
    })
  ) {
    if (
      halParams === undefined ||
      tvParams === undefined ||
      ercPointParams === undefined
    ) {
      if (halParams === undefined)
        context.log.error(
          `HALParams not found: ID ${event.params.choicesModule}`
        );
      if (tvParams === undefined)
        context.log.error(`TVParams not found: ID ${event.params.votesModule}`);

      if (ercPointParams === undefined)
        context.log.error(
          `ERCPointParams not found: ID ${event.params.pointsModule}`
        );
      return;
    }

    context.GrantShipsVoting.set({
      id: event.srcAddress,
      contest_id: contestClone.contestAddress,
      hatId: halParams.hatId,
      hatsAddress: halParams.hatsAddress,
      voteTokenAddress: ercPointParams.voteTokenAddress,
      votingCheckpoint: ercPointParams.votingCheckpoint,
      voteDuration: tvParams.voteDuration,
      startTime: undefined,
      endTime: undefined,
      isVotingActive: false,
      totalVotes: 0n,
    });
  }
  addTransaction(event, context.EnvioTX.set);
});

Contest_v0_1_0Contract.ContestStatusChanged.loader(({ event, context }) => {
  context.Contest.load(event.srcAddress, undefined);
  context.GrantShipsVoting.load(event.srcAddress, undefined);
});

Contest_v0_1_0Contract.ContestStatusChanged.handler(({ event, context }) => {
  const contest = context.Contest.get(event.srcAddress);
  const grantShipsVoting = context.GrantShipsVoting.get(event.srcAddress);
  if (contest === undefined) {
    context.log.error(
      `GrantShipsVoting not found: Contest address ${event.srcAddress}`
    );
    return;
  }

  context.Contest.set({
    ...contest,
    contestStatus: event.params.status,
  });

  if (Number(event.params.status) === ContestStatus.Finalized) {
    if (grantShipsVoting === undefined) {
      context.log.error(
        `GrantShipsVoting not found: Contest address ${event.srcAddress}`
      );
      return;
    }

    context.GrantShipsVoting.set({
      ...grantShipsVoting,
      isVotingActive: false,
    });
  }

  addTransaction(event, context.EnvioTX.set);
});
