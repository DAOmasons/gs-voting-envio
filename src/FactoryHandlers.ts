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
  FactoryEventsSummaryEntity,
  ContestTemplateEntity,
  // ContestEntity,
  // ContestModuleEntity,
} from 'generated';

export const FACTORY_EVENTS_SUMMARY_KEY = 'GlobalEventsSummary';
const FACTORY_ADDRESS = '0x1670EEfb9B638243559b6Fcc7D6d3e6f9d4Ca5Fc';

const FACTORY_EVENTS_SUMMARY: FactoryEventsSummaryEntity = {
  id: FACTORY_EVENTS_SUMMARY_KEY,
  address: FACTORY_ADDRESS,
  admins: [],
  contestTemplateCount: 0n,
  moduleTemplateCount: 0n,
  // fastFactory_AdminAddedCount: BigInt(0),
  // fastFactory_AdminRemovedCount: BigInt(0),
  // fastFactory_ContestBuiltCount: BigInt(0),
  // fastFactory_ContestTemplateCreatedCount: BigInt(0),
  // fastFactory_ContestTemplateDeletedCount: BigInt(0),
  // fastFactory_ModuleClonedCount: BigInt(0),
  // fastFactory_ModuleTemplateCreatedCount: BigInt(0),
  // fastFactory_ModuleTemplateDeletedCount: BigInt(0),
};

/// ===============================
/// ======= FACTORY INIT ==========
/// ===============================

FastFactoryContract.FactoryInitialized.loader(({ context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
});

FastFactoryContract.FactoryInitialized.handler(({ event, context }) => {
  const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

  const admin = event.params.admin;

  const currentSummaryEntity: FactoryEventsSummaryEntity =
    summary ?? FACTORY_EVENTS_SUMMARY;

  context.FactoryEventsSummary.set({
    ...currentSummaryEntity,
    admins: [...currentSummaryEntity.admins, admin],
  });
});

/// ===============================
/// ======= ADMIN ADDED ===========
/// ===============================

FastFactoryContract.AdminAdded.loader(({ context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
});

FastFactoryContract.AdminAdded.handler(({ event, context }) => {
  const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: FactoryEventsSummaryEntity =
    summary ?? FACTORY_EVENTS_SUMMARY;

  const newAdmin = event.params.admin;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    admins: [...currentSummaryEntity.admins, newAdmin],
  };

  context.FactoryEventsSummary.set(nextSummaryEntity);
});

/// ===============================
/// ======= ADMIN REMOVED =========
/// ===============================

FastFactoryContract.AdminRemoved.loader(({ context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
});

FastFactoryContract.AdminRemoved.handler(({ event, context }) => {
  const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: FactoryEventsSummaryEntity =
    summary ?? FACTORY_EVENTS_SUMMARY;

  const removedAdmin = event.params.admin;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    admins: currentSummaryEntity.admins.filter(
      (admin) => admin !== removedAdmin
    ),
  };

  context.FactoryEventsSummary.set(nextSummaryEntity);
});

/// ===============================
/// ==== ADD CONTEST TEMPLATE =====
/// ===============================

FastFactoryContract.ContestTemplateCreated.loader(({ context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
});

FastFactoryContract.ContestTemplateCreated.handler(({ event, context }) => {
  const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: FactoryEventsSummaryEntity =
    summary ?? FACTORY_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    contestTemplateCount: currentSummaryEntity.contestTemplateCount + 1n,
  };

  const contestTemplate: ContestTemplateEntity = {
    id: event.params.contestVersion,
    contestVersion: event.params.contestVersion,
    contestAddress: event.params.contestAddress,
    mdProtocol: event.params.contestInfo[0],
    mdPointer: event.params.contestInfo[1],
    active: true,
  };

  context.FactoryEventsSummary.set(nextSummaryEntity);
  context.ContestTemplate.set(contestTemplate);
});

/// ===============================
/// ==== DELETE CONTEST TEMPLATE ==
/// ===============================

FastFactoryContract.ContestTemplateDeleted.loader(({ event, context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
  // context.ContestTemplate.load(event.params.contestVersion);
});

FastFactoryContract.ContestTemplateDeleted.handler(({ event, context }) => {
  const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: FactoryEventsSummaryEntity =
    summary ?? FACTORY_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    contestTemplateCount: currentSummaryEntity.contestTemplateCount - 1n,
  };

  const contest = context.ContestTemplate.get(event.params.contestVersion);

  context.log.info(
    `ContestTemplate with version ${event.params.contestVersion}`
  );

  if (!contest) {
    context.log.error(
      `ContestTemplate with version ${event.params.contestVersion} not found`
    );
    return;
  }

  const deletedContestTemplate: ContestTemplateEntity = {
    ...contest,
    active: false,
  };

  context.FactoryEventsSummary.set(nextSummaryEntity);
  context.ContestTemplate.set(deletedContestTemplate);
});

/// ===============================
/// ==== ADD MODULE TEMPLATE ======
/// ===============================

FastFactoryContract.ModuleTemplateCreated.loader(({ context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
});

FastFactoryContract.ModuleTemplateCreated.handler(({ event, context }) => {
  const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: FactoryEventsSummaryEntity =
    summary ?? FACTORY_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    moduleTemplateCount: currentSummaryEntity.moduleTemplateCount + 1n,
  };

  context.FactoryEventsSummary.set(nextSummaryEntity);
  context.ModuleTemplate.set({
    id: event.params.moduleAddress,
    templateAddress: event.params.moduleAddress,
    moduleName: event.params.moduleName,
    mdProtocol: event.params.moduleInfo[0],
    mdPointer: event.params.moduleInfo[1],
    active: true,
  });
});

/// ===============================
/// === DELETE MODULE TEMPLATE ====
/// ===============================

FastFactoryContract.ModuleTemplateCreated.loader(({ context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
});

// FastFactoryContract.ContestBuilt.handler(({ event, context }) => {
//   const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: FactoryEventsSummaryEntity =
//     summary ?? FACTORY_EVENTS_SUMMARY;

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
//     eventsSummary: FACTORY_EVENTS_SUMMARY_KEY,
//   };

//   context.FactoryEventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ContestBuilt.set(fastFactory_ContestBuiltEntity);
// });

// FastFactoryContract.ContestTemplateCreated.loader(({ event, context }) => {
//   context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ContestTemplateCreated.handler(({ event, context }) => {
//   const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: FactoryEventsSummaryEntity =
//     summary ?? FACTORY_EVENTS_SUMMARY;

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
//       eventsSummary: FACTORY_EVENTS_SUMMARY_KEY,
//     };

//   context.FactoryEventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ContestTemplateCreated.set(
//     fastFactory_ContestTemplateCreatedEntity
//   );
// });
// FastFactoryContract.ContestTemplateDeleted.loader(({ event, context }) => {
//   context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ContestTemplateDeleted.handler(({ event, context }) => {
//   const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: FactoryEventsSummaryEntity =
//     summary ?? FACTORY_EVENTS_SUMMARY;

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
//       eventsSummary: FACTORY_EVENTS_SUMMARY_KEY,
//     };

//   context.FactoryEventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ContestTemplateDeleted.set(
//     fastFactory_ContestTemplateDeletedEntity
//   );
// });

// FastFactoryContract.ModuleCloned.loader(({ event, context }) => {
//   context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ModuleCloned.handler(({ event, context }) => {
//   const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: FactoryEventsSummaryEntity =
//     summary ?? FACTORY_EVENTS_SUMMARY;

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
//     eventsSummary: FACTORY_EVENTS_SUMMARY_KEY,
//   };

//   context.FactoryEventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ModuleCloned.set(fastFactory_ModuleClonedEntity);
// });
// FastFactoryContract.ModuleTemplateCreated.loader(({ event, context }) => {
//   context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ModuleTemplateCreated.handler(({ event, context }) => {
//   const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: FactoryEventsSummaryEntity =
//     summary ?? FACTORY_EVENTS_SUMMARY;

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
//       eventsSummary: FACTORY_EVENTS_SUMMARY_KEY,
//     };

//   context.FactoryEventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ModuleTemplateCreated.set(
//     fastFactory_ModuleTemplateCreatedEntity
//   );
// });
// FastFactoryContract.ModuleTemplateDeleted.loader(({ event, context }) => {
//   context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
// });

// FastFactoryContract.ModuleTemplateDeleted.handler(({ event, context }) => {
//   const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

//   const currentSummaryEntity: FactoryEventsSummaryEntity =
//     summary ?? FACTORY_EVENTS_SUMMARY;

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
//       eventsSummary: FACTORY_EVENTS_SUMMARY_KEY,
//     };

//   context.FactoryEventsSummary.set(nextSummaryEntity);
//   context.FastFactory_ModuleTemplateDeleted.set(
//     fastFactory_ModuleTemplateDeletedEntity
//   );
// });
