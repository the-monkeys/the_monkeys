import { create } from 'zustand';

export type UpdateProfileSteps =
  | 'details'
  | 'select-image'
  | 'confirm-image'
  | 'delete-image';

interface UpdateProfileStepsState {
  currentStep: number;
  steps: UpdateProfileSteps[];

  handleBack: () => void;
  handleNext: () => void;
  resetStep: () => void;
  handleJumpToStep: (step: UpdateProfileSteps) => void;
}

export const useUpdateProfileSteps = create<UpdateProfileStepsState>()(
  (set) => ({
    currentStep: 0,
    steps: ['details', 'select-image', 'confirm-image', 'delete-image'],

    handleBack: () =>
      set((state) => {
        if (state.currentStep <= 0) return {};

        return { currentStep: state.currentStep - 1 };
      }),

    handleNext: () =>
      set((state) => {
        if (state.currentStep === state.steps.length - 1) return {};

        return { currentStep: state.currentStep + 1 };
      }),

    handleJumpToStep: (step: UpdateProfileSteps) =>
      set((state) => ({
        currentStep: state.steps.findIndex((el) => el === step),
      })),

    resetStep: () => set(() => ({ currentStep: 0 })),
  })
);
