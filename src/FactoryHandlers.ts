/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  FastFactoryContract,
  // FastFactory_AdminAddedEntity,
  // FastFactory_AdminRemovedEntity,
  // FastFactory_ContestBuiltEntity,
  // FastFactory_ContestTemplateCreatedEntity,
  // FastFactory_ContestTemplateDeletedEntity,
  // FastFactory_FactoryInitializedEntity,
  // FastFactory_ModuleClonedEntity,
  // FastFactory_ModuleTemplateCreatedEntity,
  // FastFactory_ModuleTemplateDeletedEntity,
  EventsSummaryEntity,
  // ContestEntity,
  // ContestModuleEntity,
} from 'generated';

export const GLOBAL_EVENTS_SUMMARY_KEY = 'GlobalEventsSummary';
const FACTORY_ADDRESS = '0x1670EEfb9B638243559b6Fcc7D6d3e6f9d4Ca5Fc';

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  address: FACTORY_ADDRESS,
  // fastFactory_AdminAddedCount: BigInt(0),
  // fastFactory_AdminRemovedCount: BigInt(0),
  // fastFactory_ContestBuiltCount: BigInt(0),
  // fastFactory_ContestTemplateCreatedCount: BigInt(0),
  // fastFactory_ContestTemplateDeletedCount: BigInt(0),
  // fastFactory_ModuleClonedCount: BigInt(0),
  // fastFactory_ModuleTemplateCreatedCount: BigInt(0),
  // fastFactory_ModuleTemplateDeletedCount: BigInt(0),
};

FastFactoryContract.FactoryInitialized.loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

FastFactoryContract.FactoryInitialized.handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const fastFactory_FactoryInitializedEntity: FastFactory_FactoryInitializedEntity =
    {
      id: event.transactionHash + event.logIndex.toString(),
      admin: event.params.admin,
      eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    };

  context.FastFactory_FactoryInitialized.set(
    fastFactory_FactoryInitializedEntity
  );
});

// FastFactoryContract.AdminAdded.loader(({ event, context }) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.AdminAdded.handler(({ event, context }) => {
//   const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: EventsSummaryEntity =
//     summary ?? INITIAL_EVENTS_SUMMARY;

//   const nextSummaryEntity = {
//     ...currentSummaryEntity,
//     fastFactory_AdminAddedCount:
//       currentSummaryEntity.fastFactory_AdminAddedCount + BigInt(1),
//   };

//   const fastFactory_AdminAddedEntity: FastFactory_AdminAddedEntity = {
//     id: event.transactionHash + event.logIndex.toString(),
//     admin: event.params.admin,
//     eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
//   };

//   context.EventsSummary.set(nextSummaryEntity);
//   context.FastFactory_AdminAdded.set(fastFactory_AdminAddedEntity);
// });
// FastFactoryContract.AdminRemoved.loader(({ event, context }) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.AdminRemoved.handler(({ event, context }) => {
//   const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: EventsSummaryEntity =
//     summary ?? INITIAL_EVENTS_SUMMARY;

//   const nextSummaryEntity = {
//     ...currentSummaryEntity,
//     fastFactory_AdminRemovedCount:
//       currentSummaryEntity.fastFactory_AdminRemovedCount + BigInt(1),
//   };

//   const fastFactory_AdminRemovedEntity: FastFactory_AdminRemovedEntity = {
//     id: event.transactionHash + event.logIndex.toString(),
//     admin: event.params.admin,
//     eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
//   };

//   context.EventsSummary.set(nextSummaryEntity);
//   context.FastFactory_AdminRemoved.set(fastFactory_AdminRemovedEntity);
// });
// FastFactoryContract.ContestBuilt.loader(({ event, context }) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ContestBuilt.handler(({ event, context }) => {
//   const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: EventsSummaryEntity =
//     summary ?? INITIAL_EVENTS_SUMMARY;

//   const nextSummaryEntity = {
//     ...currentSummaryEntity,
//     fastFactory_ContestBuiltCount:
//       currentSummaryEntity.fastFactory_ContestBuiltCount + BigInt(1),
//   };

//   const fastFactory_ContestBuiltEntity: FastFactory_ContestBuiltEntity = {
//     id: event.transactionHash + event.logIndex.toString(),
//     votesModule: event.params.votesModule,
//     pointsModule: event.params.pointsModule,
//     choicesModule: event.params.choicesModule,
//     executionModule: event.params.executionModule,
//     contestAddress: event.params.contestAddress,
//     contestVersion: event.params.contestVersion,
//     filterTag: event.params.filterTag,
//     eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
//   };

//   context.EventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ContestBuilt.set(fastFactory_ContestBuiltEntity);
// });

// FastFactoryContract.ContestTemplateCreated.loader(({ event, context }) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ContestTemplateCreated.handler(({ event, context }) => {
//   const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: EventsSummaryEntity =
//     summary ?? INITIAL_EVENTS_SUMMARY;

//   const nextSummaryEntity = {
//     ...currentSummaryEntity,
//     fastFactory_ContestTemplateCreatedCount:
//       currentSummaryEntity.fastFactory_ContestTemplateCreatedCount + BigInt(1),
//   };

//   const fastFactory_ContestTemplateCreatedEntity: FastFactory_ContestTemplateCreatedEntity =
//     {
//       id: event.transactionHash + event.logIndex.toString(),
//       contestVersion: event.params.contestVersion,
//       contestAddress: event.params.contestAddress,
//       contestInfo_0: event.params.contestInfo[0],
//       contestInfo_1: event.params.contestInfo[1],
//       eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
//     };

//   context.EventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ContestTemplateCreated.set(
//     fastFactory_ContestTemplateCreatedEntity
//   );
// });
// FastFactoryContract.ContestTemplateDeleted.loader(({ event, context }) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ContestTemplateDeleted.handler(({ event, context }) => {
//   const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: EventsSummaryEntity =
//     summary ?? INITIAL_EVENTS_SUMMARY;

//   const nextSummaryEntity = {
//     ...currentSummaryEntity,
//     fastFactory_ContestTemplateDeletedCount:
//       currentSummaryEntity.fastFactory_ContestTemplateDeletedCount + BigInt(1),
//   };

//   const fastFactory_ContestTemplateDeletedEntity: FastFactory_ContestTemplateDeletedEntity =
//     {
//       id: event.transactionHash + event.logIndex.toString(),
//       contestVersion: event.params.contestVersion,
//       contestAddress: event.params.contestAddress,
//       eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
//     };

//   context.EventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ContestTemplateDeleted.set(
//     fastFactory_ContestTemplateDeletedEntity
//   );
// });

// FastFactoryContract.ModuleCloned.loader(({ event, context }) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ModuleCloned.handler(({ event, context }) => {
//   const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: EventsSummaryEntity =
//     summary ?? INITIAL_EVENTS_SUMMARY;

//   const nextSummaryEntity = {
//     ...currentSummaryEntity,
//     fastFactory_ModuleClonedCount:
//       currentSummaryEntity.fastFactory_ModuleClonedCount + BigInt(1),
//   };

//   const fastFactory_ModuleClonedEntity: FastFactory_ModuleClonedEntity = {
//     id: event.transactionHash + event.logIndex.toString(),
//     moduleAddress: event.params.moduleAddress,
//     moduleName: event.params.moduleName,
//     filterTag: event.params.filterTag,
//     eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
//   };

//   context.EventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ModuleCloned.set(fastFactory_ModuleClonedEntity);
// });
// FastFactoryContract.ModuleTemplateCreated.loader(({ event, context }) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ModuleTemplateCreated.handler(({ event, context }) => {
//   const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: EventsSummaryEntity =
//     summary ?? INITIAL_EVENTS_SUMMARY;

//   const nextSummaryEntity = {
//     ...currentSummaryEntity,
//     fastFactory_ModuleTemplateCreatedCount:
//       currentSummaryEntity.fastFactory_ModuleTemplateCreatedCount + BigInt(1),
//   };

//   const fastFactory_ModuleTemplateCreatedEntity: FastFactory_ModuleTemplateCreatedEntity =
//     {
//       id: event.transactionHash + event.logIndex.toString(),
//       moduleName: event.params.moduleName,
//       moduleAddress: event.params.moduleAddress,
//       moduleInfo_0: event.params.moduleInfo[0],
//       moduleInfo_1: event.params.moduleInfo[1],
//       eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
//     };

//   context.EventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ModuleTemplateCreated.set(
//     fastFactory_ModuleTemplateCreatedEntity
//   );
// });
// FastFactoryContract.ModuleTemplateDeleted.loader(({ event, context }) => {
//   context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ModuleTemplateDeleted.handler(({ event, context }) => {
//   const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: EventsSummaryEntity =
//     summary ?? INITIAL_EVENTS_SUMMARY;

//   const nextSummaryEntity = {
//     ...currentSummaryEntity,
//     fastFactory_ModuleTemplateDeletedCount:
//       currentSummaryEntity.fastFactory_ModuleTemplateDeletedCount + BigInt(1),
//   };

//   const fastFactory_ModuleTemplateDeletedEntity: FastFactory_ModuleTemplateDeletedEntity =
//     {
//       id: event.transactionHash + event.logIndex.toString(),
//       moduleName: event.params.moduleName,
//       moduleAddress: event.params.moduleAddress,
//       eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
//     };

//   context.EventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ModuleTemplateDeleted.set(
//     fastFactory_ModuleTemplateDeletedEntity
//   );
// });
