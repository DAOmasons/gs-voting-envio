import { HatsPosterContract } from 'generated';
import { addTransaction } from './utils/sync';

HatsPosterContract.Initialized.loader(() => {});

HatsPosterContract.Initialized.handler(({ event, context }) => {
  context.HatsPoster.set({
    id: event.srcAddress,
    hatIds: event.params.hatIds,
    hatsAddress: event.params.hatsAddress,
  });

  addTransaction(event, context.EnvioTX.set);
});

HatsPosterContract.PostEvent.loader(({ event, context }) => {
  context.HatsPoster.load(event.srcAddress);
});

HatsPosterContract.PostEvent.handler(({ event, context }) => {
  const hatsPoster = context.HatsPoster.get(event.srcAddress);
  if (hatsPoster === undefined) {
    context.log.error(
      `HatsPoster not found: Poster address ${event.srcAddress}`
    );
    return;
  }

  context.EventPost.set({
    id: `post-${event.transactionHash}-${event.logIndex}`,
    tag: event.params.tag,
    hatsPoster_id: event.srcAddress,
    hatId: event.params.hatId,
    mdProtocol: event.params._2[0],
    mdPointer: event.params._2[1],
  });

  addTransaction(event, context.EnvioTX.set);
});

HatsPosterContract.PostRecord.loader(({ event, context }) => {
  context.HatsPoster.load(event.srcAddress);
});

HatsPosterContract.PostRecord.handler(({ event, context }) => {
  const hatsPoster = context.HatsPoster.get(event.srcAddress);
  if (hatsPoster === undefined) {
    context.log.error(
      `HatsPoster not found: Poster address ${event.srcAddress}`
    );
    return;
  }

  context.Record.set({
    id: `record-${event.srcAddress}-${event.params.nonce}`,
    tag: event.params.tag,
    hatsPoster_id: event.srcAddress,
    hatId: event.params.hatId,
    nonce: event.params.nonce,
    mdProtocol: event.params._3[0],
    mdPointer: event.params._3[1],
  });

  addTransaction(event, context.EnvioTX.set);
});
