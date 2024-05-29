import { eventLog } from 'generated';

export const createChoiceId = ({
  contestAddress,
  choiceId,
}: {
  contestAddress: string;
  choiceId: string;
}) => `choice-${choiceId}-${contestAddress}`;

export const createVoteId = (event: eventLog<unknown>) =>
  `vote-${event.transactionHash}-${event.logIndex}`;

export const addChainId = (event: eventLog<unknown>, id: string) => {
  return `${id}-${event.chainId}`;
};
