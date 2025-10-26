/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  CHAIN_METADATA,
  ProgressStep,
  type OnIntentHookData,
} from "@avail-project/nexus-core";
import { useState } from "react";
import { Label } from "../ui/label";
import { ProcessingState } from "@/hooks/useListenBridgeTransactions";
import { getStatusText } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNexus } from "@/providers/NexusProvider";

const IntentModal = ({
  intent,
  processing,
  resetProcessingState,
}: {
  intent: OnIntentHookData;
  processing: ProcessingState;
  resetProcessingState: () => void;
}) => {
  const { intent: intentData } = intent;

  const { intentRefCallback } = useNexus();

  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (!isOpen) {
          resetProcessingState();
          intentRefCallback.current = null;
        }
      }}
    >
      <DialogContent
        className="gap-y-3"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Sweep Details
          </DialogTitle>
          <DialogDescription>
            Please wait while we process your sweep. Do not close this window.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-4 pt-4">
          <div className="flex flex-col gap-y-1">
            <Label>Source Chains</Label>
            <div className="flex flex-wrap items-center gap-x-2">
              {intentData.sources.map((source) => (
                <img
                  key={source.chainID}
                  src={CHAIN_METADATA[source?.chainID]?.logo}
                  alt={CHAIN_METADATA[source?.chainID]?.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Destination Chain</Label>
            <div className="flex items-center gap-x-2">
              <img
                src={CHAIN_METADATA[intentData?.destination?.chainID]?.logo}
                alt={CHAIN_METADATA[intentData?.destination?.chainID]?.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 w-full">
          <div className="flex flex-col gap-y-3 w-full">
            {processing.steps.map((step, index) => {
              const isCurrentStep = index === processing.currentStep;
              const isCompleted = step.completed;

              return (
                <div key={step.id} className="flex items-center gap-x-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-colors",
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground border border-border"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isCurrentStep ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm transition-colors",
                      isCompleted
                        ? "text-muted-foreground line-through"
                        : isCurrentStep
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {getStatusText(
                      (step.stepData as ProgressStep)?.type,
                      "bridge"
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntentModal;
