"use client";
import { getStatusText } from "@/lib/utils";
import { useNexus } from "@/providers/NexusProvider";
import {
  NEXUS_EVENTS,
  type ProgressStep,
  type ProgressSteps,
  type SwapStep,
} from "@avail-project/nexus-core";
import { useCallback, useEffect, useState } from "react";

interface ProcessingStep {
  id: number;
  completed: boolean;
  progress: number; // 0-100
  stepData?: ProgressStep | ProgressSteps | SwapStep;
}

interface ProcessingState {
  currentStep: number;
  totalSteps: number;
  steps: ProcessingStep[];
  statusText: string;
}

const DEFAULT_INITIAL_STEPS = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasTypeID(obj: any): obj is { typeID: string } {
  return obj && typeof obj === "object" && "typeID" in obj;
}

const getInitialProcessingState = (
  totalSteps = DEFAULT_INITIAL_STEPS,
  statusText = "Verifying Request"
): ProcessingState => ({
  currentStep: 0,
  totalSteps,
  steps: Array.from({ length: totalSteps }, (_, i) => ({
    id: i,
    completed: false,
    progress: 0,
  })),
  statusText,
});

const useListenBridgeTransaction = () => {
  const [processing, setProcessing] = useState<ProcessingState>(() =>
    getInitialProcessingState()
  );
  const [explorerURL, setExplorerURL] = useState<string | null>(null);
  const [explorerURLs, setExplorerURLs] = useState<{
    source?: string;
    destination?: string;
  }>({});

  const { nexusSDK: sdk } = useNexus();

  const resetProcessingState = useCallback(() => {
    setProcessing(getInitialProcessingState());
    setExplorerURL(null);
    setExplorerURLs({});
  }, []);

  useEffect(() => {
    if (!sdk) return;

    let expectedReceived = false;
    const pendingSteps: ProgressStep[] = [];

    const processStep = (
      state: ProcessingState,
      stepData: ProgressStep
    ): ProcessingState => {
      const { type: stepType, typeID, data } = stepData;
      let stepIndex = state.steps.findIndex(
        (s) => hasTypeID(s.stepData) && s.stepData.typeID === typeID
      );

      console.log("[Process Step] state: ", state);
      console.log("[Process Step] stepData: ", stepData);

      if (stepIndex === -1) {
        stepIndex = Math.min(state.currentStep, state.totalSteps - 1);
      }

      console.log("[Process Step] stepIndex: ", stepIndex);

      const newSteps = [...state.steps];

      console.log("[Process Step] newSteps 1: ", newSteps);
      for (let i = 0; i <= stepIndex && i < newSteps.length; i++) {
        newSteps[i] = {
          ...newSteps[i],
          completed: true,
          progress: 100,
          stepData: i === stepIndex ? stepData : newSteps[i].stepData,
        };
      }

      console.log("[Process Step] newSteps 2: ", newSteps);

      const nextStep = Math.min(stepIndex + 1, state.totalSteps);

      console.log("[Process Step] nextStep: ", nextStep);
      let description = getStatusText(stepData?.type, "bridge");

      console.log("[Process Step] description: ", description);

      if (stepType === "INTENT_COLLECTION" && data) {
        description = "Collecting Confirmations";
      }

      return {
        ...state,
        currentStep: nextStep,
        steps: newSteps,
        statusText: description,
      };
    };

    const handleExpectedSteps = (expectedSteps: ProgressSteps[]) => {
      expectedReceived = true;

      console.log("expected steps", expectedSteps);

      const stepCount = Array.isArray(expectedSteps)
        ? expectedSteps.length
        : expectedSteps;

      console.log("stepCount", stepCount);
      const steps = Array.isArray(expectedSteps) ? expectedSteps : [];

      console.log("steps", steps);

      const initialSteps = Array.from({ length: stepCount }, (_, i) => ({
        id: i,
        completed: false,
        progress: 0,
        stepData: steps[i] || null,
      }));

      console.log("initialSteps", initialSteps);

      setProcessing((prev) => {
        const completedTypeIDs = prev.steps
          .filter((s) => s.completed)
          .map((s) => {
            if (hasTypeID(s.stepData)) {
              return s.stepData.typeID;
            }
            return null;
          })
          .filter(Boolean) as string[];

        console.log("completedTypeIDs", completedTypeIDs);

        const mergedSteps = initialSteps.map((step) => {
          if (hasTypeID(step.stepData)) {
            if (completedTypeIDs.includes(step.stepData.typeID)) {
              return { ...step, completed: true, progress: 100 };
            }
          }
          return step;
        });

        console.log("mergedSteps", mergedSteps);

        const completedCount = mergedSteps.filter((s) => s.completed).length;
        let newState: ProcessingState = {
          ...prev,
          totalSteps: stepCount,
          steps: mergedSteps,
          currentStep: completedCount,
        };

        console.log("newState 1", newState);

        pendingSteps.forEach((queuedStep) => {
          newState = processStep(newState, queuedStep);
        });

        console.log("pendingSteps", pendingSteps);
        pendingSteps.length = 0;

        console.log("newState 2", newState);
        return newState;
      });
    };

    const handleStepComplete = (stepData: ProgressStep) => {
      console.log("[Handle Step Complete] stepData: ", stepData);
      console.log("[Handle Step Complete] expectedReceived", expectedReceived);
      if (!expectedReceived) {
        pendingSteps.push(stepData);
      } else {
        setProcessing((prev) => processStep(prev, stepData));
      }

      if (
        stepData.typeID === "IS" &&
        stepData.data &&
        "explorerURL" in stepData.data
      ) {
        setExplorerURL(stepData.data.explorerURL as string);
      }
    };

    const expectedEventType = NEXUS_EVENTS.EXPECTED_STEPS;
    const completedEventType = NEXUS_EVENTS.STEP_COMPLETE;

    sdk.nexusEvents?.on(expectedEventType, handleExpectedSteps);
    sdk.nexusEvents?.on(completedEventType, handleStepComplete);

    return () => {
      sdk.nexusEvents?.off(expectedEventType, handleExpectedSteps);
      sdk.nexusEvents?.off(completedEventType, handleStepComplete);
    };
  }, [resetProcessingState, sdk]);

  return { processing, explorerURL, explorerURLs, resetProcessingState };
};

export default useListenBridgeTransaction;
