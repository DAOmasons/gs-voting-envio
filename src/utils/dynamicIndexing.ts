import {
  contractRegistrations,
  FastFactory_ModuleTemplateCreated_eventArgs,  
  FastFactory_ModuleCloned_eventArgs,
  FastFactory_ContestCloned_eventArgs,
  eventLog,
} from 'generated';
import { ContestVersion, Module } from './constants';

export const indexerModuleFactory = (
  event: eventLog<FastFactory_ModuleCloned_eventArgs | FastFactory_ModuleCloned_eventArgs>,
  context: contractRegistrations
) => {
  if (event.params.moduleName === Module.HatsAllowList_v0_1_1) {
    context.addHatsAllowList(event.params.moduleAddress);
  }
  if (event.params.moduleName === Module.TimedVotes_v0_1_1) {
    context.addTimedVotes(event.params.moduleAddress);
  }
  if (event.params.moduleName === Module.ERC20VotesPoints_v0_1_1) {
    context.addERC20VotesPoints(
      event.params.moduleAddress
    );
  }
  if (event.params.moduleName === Module.SBTBalancePoints_v0_1_1) {
    context.addSBTBalancePoints(
      event.params.moduleAddress
    );
  }
};

export const indexContestVersionFactory = (
  event: eventLog<FastFactory_ContestCloned_eventArgs>,
  context: contractRegistrations
) => {
  if (event.params.contestVersion === ContestVersion.v0_1_0) {
    context.addContest_v0_1_0(event.params.contestAddress);
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

export const isSBTVoting = ({
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
  pointsModuleName === Module.SBTBalancePoints_v0_1_1 &&
  executionModuleName === Module.EmptyExecutionModule_v0_1_1 &&
  contestVersion === ContestVersion.v0_1_0
    ? true
    : false;
