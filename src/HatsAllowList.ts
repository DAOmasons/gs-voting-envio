import { HatsAllowListContract } from 'generated';
import { HatsAllowListContract_Removed_handler } from 'generated/src/Handlers.gen';

HatsAllowListContract.Initialized.loader(() => {});

HatsAllowListContract.Initialized.handler(({ event, context }) => {
  context.HALParams.set({
    id: event.srcAddress,
    hatId: event.params.hatId,
    hatsAddress: event.params.hatsAddress,
  });
});

HatsAllowListContract.Registered.loader(({ event, context }) => {
  context.StemModule.load(event.srcAddress, undefined);
});

HatsAllowListContract.Registered.handler(({ event, context }) => {
  const stemModule = context.StemModule.get(event.srcAddress);
  if (stemModule === undefined) {
    context.log.error(
      `StemModule not found: Module address ${event.srcAddress}`
    );
    return;
  }
  if (stemModule.contestAddress === undefined) {
    context.log.error(
      `StemModule contestAddress not found: contest address ${stemModule.contestAddress}`
    );
    return;
  }

  const choiceId = `choice-${event.params.choiceId}-${stemModule.contestAddress}`;

  context.ShipChoice.set({
    id: choiceId,
    contest_id: stemModule.contestAddress,
    mdProtocol: event.params._1[0][0],
    mdPointer: event.params._1[0][1],
    choiceData: event.params._1[1],
    active: event.params._1[2],
  });
});

HatsAllowListContract.Removed.loader(({ event, context }) => {});

HatsAllowListContract.Removed.handlerAsync(async ({ event, context }) => {
  const stemModule = await context.StemModule.get(event.srcAddress);
  if (stemModule === undefined) {
    context.log.error(
      `StemModule not found: Module address ${event.srcAddress}`
    );
    return;
  }
  const shipChoice = await context.ShipChoice.get(
    `choice-${event.params.choiceId}-${stemModule.contestAddress}`
  );

  if (shipChoice === undefined) {
    context.log.error(
      `ShipChoice not found: choice id ${event.params.choiceId}`
    );
    return;
  }

  context.ShipChoice.set({
    ...shipChoice,
    active: false,
  });
});
