import { HatsAllowListContract } from 'generated';

HatsAllowListContract.Initialized.loader(() => {});

HatsAllowListContract.Initialized.handler(({ event, context }) => {
  context.HALParams.set({
    id: event.srcAddress,
    hatId: event.params.hatId,
    hatsAddress: event.params.hatsAddress,
  });
});
