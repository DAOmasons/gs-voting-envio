import {
  FastFactoryContract_ContestClonedEvent_eventArgs,
  FastFactoryContract_ContestClonedEvent_loaderContext,
  FastFactoryContract_ModuleClonedEvent_eventArgs,
  FastFactoryContract_ModuleClonedEvent_loaderContext,
  eventLog,
} from 'generated';
import { ContestVersion, Module } from './constants';

export const indexerModuleFactory = (
  event: eventLog<FastFactoryContract_ModuleClonedEvent_eventArgs>,
  context: FastFactoryContract_ModuleClonedEvent_loaderContext
) => {
  if (event.params.moduleName === Module.HatsAllowList_v0_1_1) {
    context.contractRegistration.addHatsAllowList(event.params.moduleAddress);
  }
  if (event.params.moduleName === Module.TimedVotes_v0_1_1) {
    context.contractRegistration.addTimedVotes(event.params.moduleAddress);
  }
  if (event.params.moduleName === Module.ERC20VotesPoints_v0_1_1) {
    context.contractRegistration.addERC20VotesPoints(
      event.params.moduleAddress
    );
  }
};

export const indexContestVersionFactory = (
  event: eventLog<FastFactoryContract_ContestClonedEvent_eventArgs>,
  context: FastFactoryContract_ContestClonedEvent_loaderContext
) => {
  if (event.params.contestVersion === ContestVersion.v0_1_0) {
    context.contractRegistration.addContest_v0_1_0(event.params.contestAddress);
    return;
  }
};

export const isGrantShipsVoting = ({
  choiceModuleName,
  votesModuleName,
  pointsModuleName,
  executionModuleName,
  contestVersion,
}: {
  choiceModuleName: string;
  votesModuleName: string;
  pointsModuleName: string;
  executionModuleName: string;
  contestVersion: string;
}) =>
  choiceModuleName === Module.HatsAllowList_v0_1_1 &&
  votesModuleName === Module.TimedVotes_v0_1_1 &&
  pointsModuleName === Module.ERC20VotesPoints_v0_1_1 &&
  executionModuleName === Module.EmptyExecutionModule_v0_1_1 &&
  contestVersion === ContestVersion.v0_1_0
    ? true
    : false;
