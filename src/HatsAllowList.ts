import { HatsAllowListContract } from 'generated';

HatsAllowListContract.Initialized.loader(({ event, context }) => {});

HatsAllowListContract.Initialized.handler(({ event, context }) => {
  const stemModule = context.StemModule.get(event.srcAddress);

  if (stemModule === undefined) {
    context.log.error('stemModule is undefined');
    return;
  }

  context.LocalLog.set({
    id: event.srcAddress,
    message: 'Hats Allow List Initialized',
  });
});
