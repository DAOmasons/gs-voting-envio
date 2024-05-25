import { Contest_v0_1_0Contract, StemModuleEntity } from 'generated';
import { isGrantShipsVoting } from './utils/dynamicIndexing';

Contest_v0_1_0Contract.ContestInitialized.loader(({ event, context }) => {
  context.ContestClone.load(event.srcAddress);
});

Contest_v0_1_0Contract.ContestInitialized.handler(({ event, context }) => {
  const contestClone = context.ContestClone.get(event.srcAddress);
  const votingModule = context.StemModule.get(event.params.votesModule);
  const pointsModule = context.StemModule.get(event.params.pointsModule);
  const choicesModule = context.StemModule.get(event.params.choicesModule);
  const executionModule = context.StemModule.get(event.params.executionModule);

  if (contestClone === undefined) {
    context.LocalLog.set({
      id: event.srcAddress,
      message: 'contestClone is undefined',
    });
    return;
  }

  if (executionModule === undefined) {
    context.LocalLog.set({
      id: event.srcAddress,
      message: contestClone.contestAddress,
    });
    return;
  }

  context.StemModule.set({
    ...executionModule,
    contestAddress: contestClone.contestAddress,
  });

  if (votingModule === undefined) {
    context.LocalLog.set({
      id: event.srcAddress,
      message: contestClone.contestAddress,
    });
    return;
  }

  context.StemModule.set({
    ...votingModule,
    contestAddress: contestClone.contestAddress,
  });

  if (pointsModule === undefined) {
    context.LocalLog.set({
      id: event.srcAddress,
      message: contestClone.contestAddress,
    });
    return;
  }

  context.StemModule.set({
    ...pointsModule,
    contestAddress: contestClone.contestAddress,
  });

  if (choicesModule === undefined) {
    context.LocalLog.set({
      id: event.srcAddress,
      message: contestClone.contestAddress,
    });
    return;
  }

  context.StemModule.set({
    ...choicesModule,
    contestAddress: contestClone.contestAddress,
  });

  context.LocalLog.set({
    id: event.srcAddress,
    message: contestClone.contestAddress,
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
    context.GrantShipsVoting.set({
      id: event.srcAddress,
      contest_id: contestClone.contestAddress,
    });
  }
});
