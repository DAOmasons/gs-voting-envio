export enum Module {
  HatsAllowList_v0_1_1 = 'HatsAllowList_v0.1.1',
  TimedVotes_v0_1_1 = 'TimedVotes_v0.1.1',
  EmptyExecutionModule_v0_1_1 = 'EmptyExecution_v0.1.1',
  ERC20VotesPoints_v0_1_1 = 'ERC20VotesPoints_v0.1.1',
  SBTBalancePoints_v0_1_1 = 'SBTBalancePoints_v0.1.1',
}

export enum ContestVersion {
  v0_1_0 = '0.1.0',
}

export enum ContestStatus {
  None,
  Populating,
  Voting,
  Continuous,
  Finalized,
  Executed,
}
