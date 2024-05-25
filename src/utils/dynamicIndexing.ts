import {
  FastFactoryContract_ContestBuiltEvent_eventArgs,
  FastFactoryContract_ContestBuiltEvent_loaderContext,
  FastFactoryContract_ModuleClonedEvent_eventArgs,
  FastFactoryContract_ModuleClonedEvent_loaderContext,
  eventLog,
} from 'generated';
import { ContestVersion, Module } from './constants';

export const indexerModuleFactory = (
  event: eventLog<FastFactoryContract_ModuleClonedEvent_eventArgs>,
  context: FastFactoryContract_ModuleClonedEvent_loaderContext
) => {
  if (event.params.moduleName === Module.HatsAllowList_v0_1_0) {
    context.contractRegistration.addHatsAllowList(event.params.moduleAddress);
  }
  if (event.params.moduleName === Module.TimedVotes_v0_1_0) {
    context.contractRegistration.addTimedVotes(event.params.moduleAddress);
  }
  if (event.params.moduleName === Module.ERC20VotesPoints_v0_1_0) {
    context.contractRegistration.addERC20VotesPoints(
      event.params.moduleAddress
    );
  }
};

export const indexContestVersionFactory = (
  event: eventLog<FastFactoryContract_ContestBuiltEvent_eventArgs>,
  context: FastFactoryContract_ContestBuiltEvent_loaderContext
) => {
  if (event.params.contestVersion === ContestVersion.v0_1_0) {
    context.contractRegistration.addContest_v0_1_0(event.params.contestAddress);
  }
};
