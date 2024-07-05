import { Contest_v0_1_0Contract, GrantShipsVotingEntity } from 'generated';
import { isGrantShipsVoting, isSBTVoting } from './utils/dynamicIndexing';
import { addTransaction } from './utils/sync';
import { ContestStatus } from './utils/constants';

Contest_v0_1_0Contract.ContestInitialized.loader(({ event, context }) => {});

Contest_v0_1_0Contract.ContestInitialized.handlerAsync(
  async ({ event, context }) => {
    const contestClone = await context.ContestClone.get(event.srcAddress);
    const votingModule = await context.StemModule.get(event.params.votesModule);
    const pointsModule = await context.StemModule.get(
      event.params.pointsModule
    );
    const choicesModule = await context.StemModule.get(
      event.params.choicesModule
    );
    const executionModule = await context.StemModule.get(
      event.params.executionModule
    );

    const halParams = await context.HALParams.get(event.params.choicesModule);
    const tvParams = await context.TVParams.get(event.params.votesModule);
    const ercPointParams = await context.ERCPointParams.get(
      event.params.pointsModule
    );

    // context.log.info(`contestClone ${contestClone}`);
    // context.log.info(`votingModule ${votingModule}`);
    // context.log.info(`pointsModule ${pointsModule}`);
    // context.log.info(`choicesModule ${choicesModule}`);
    // context.log.info(`executionModule ${executionModule}`);
    // context.log.info(`halParams ${halParams}`);
    // context.log.info(`tvParams ${tvParams}`);
    // context.log.info(`ercPointParams ${ercPointParams}`);

    // const sbtBalParams = await context.SBTBalParams.get(
    //   event.params.pointsModule
    // );
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
          context.log.error(
            `TVParams not found: ID ${event.params.votesModule}`
          );

        if (ercPointParams === undefined) {
          context.log.error(
            `!!! ERCPointParams not found: ID ${event.params.pointsModule}, `
          );
        }
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
      context.log.info(`Normal Voting`);

      addTransaction(event, context.EnvioTX.set);
      return;
    }

    // if (
    //   isSBTVoting({
    //     choiceModuleName: choicesModule.moduleName,
    //     votesModuleName: votingModule.moduleName,
    //     pointsModuleName: pointsModule.moduleName,
    //     executionModuleName: executionModule.moduleName,
    //     contestVersion: contestClone.contestVersion,
    //   })
    // ) {
    //   addTransaction(event, context.EnvioTX.set);
    //   context.log.info(`SBT Voting`);
    //   return;
    // }
  }
);

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
