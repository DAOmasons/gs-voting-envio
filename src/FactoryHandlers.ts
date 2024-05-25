import {
  FastFactoryContract,
  FactoryEventsSummaryEntity,
  ContestTemplateEntity,
} from 'generated';
import {
  indexContestVersionFactory,
  indexerModuleFactory,
} from './utils/dynamicIndexing';

export const FACTORY_EVENTS_SUMMARY_KEY = 'GlobalEventsSummary';
const FACTORY_ADDRESS = '0x1670EEfb9B638243559b6Fcc7D6d3e6f9d4Ca5Fc';

const FACTORY_EVENTS_SUMMARY: FactoryEventsSummaryEntity = {
  id: FACTORY_EVENTS_SUMMARY_KEY,
  address: FACTORY_ADDRESS,
  admins: [],
  contestTemplateCount: 0n,
  moduleTemplateCount: 0n,
  moduleCloneCount: 0n,
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
    id: event.params.moduleName,
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

FastFactoryContract.ModuleTemplateDeleted.loader(({ event, context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
});

FastFactoryContract.ModuleTemplateDeleted.handler(({ event, context }) => {
  const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: FactoryEventsSummaryEntity =
    summary ?? FACTORY_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    moduleTemplateCount: currentSummaryEntity.moduleTemplateCount - 1n,
  };

  const module = context.ModuleTemplate.get(event.params.moduleName);

  if (!module) {
    context.log.error(
      `ModuleTemplate with address ${event.params.moduleName} not found`
    );
    return;
  }

  context.FactoryEventsSummary.set(nextSummaryEntity);
  context.ModuleTemplate.set({
    ...module,
    active: false,
  });
});

FastFactoryContract.ModuleCloned.loader(({ event, context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
  indexerModuleFactory(event, context);
});

FastFactoryContract.ModuleCloned.handler(({ event, context }) => {
  const summary = context.FactoryEventsSummary.get(FACTORY_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: FactoryEventsSummaryEntity =
    summary ?? FACTORY_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    moduleCloneCount: currentSummaryEntity.moduleCloneCount + 1n,
  };

  context.StemModule.set({
    id: event.params.moduleAddress,
    moduleAddress: event.params.moduleAddress,
    moduleName: event.params.moduleName,
    filterTag: event.params.filterTag,
    moduleTemplate_id: event.params.moduleName,
  });
  context.FactoryEventsSummary.set(nextSummaryEntity);
});

/// ===============================
/// ======= CONTEST BUILT =========
/// ===============================

FastFactoryContract.ContestBuilt.loader(({ event, context }) => {
  context.FactoryEventsSummary.load(FACTORY_EVENTS_SUMMARY_KEY);
  indexContestVersionFactory(event, context);
});
