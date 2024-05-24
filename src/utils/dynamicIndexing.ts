import {
  FastFactoryContract_ModuleClonedEvent_eventArgs,
  FastFactoryContract_ModuleClonedEvent_loaderContext,
  eventLog,
} from 'generated';
import { Module } from './constants';

export const indexerModuleFactory = (
  event: eventLog<FastFactoryContract_ModuleClonedEvent_eventArgs>,
  context: FastFactoryContract_ModuleClonedEvent_loaderContext
) => {
  if (event.params.moduleName === Module.HatsAllowList_v0_1_0) {
    context.contractRegistration.addHatsAllowList(event.params.moduleAddress);
  }
};
