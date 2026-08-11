export type AutomationModel = string;

export type AutomationReasoningEffort =
  | "low"
  | "medium"
  | "high"
  | "xhigh"
  | "max"
  | "ultra";

export interface AutomationModelOption {
  readonly label: string;
  readonly slug: AutomationModel;
  readonly defaultEffort: AutomationReasoningEffort;
  readonly efforts: readonly AutomationReasoningEffort[];
}

export const AUTOMATION_MODELS: readonly AutomationModelOption[];

export function getAutomationModel(value: AutomationModel): AutomationModelOption;
export function getAutomationModel(value: unknown): AutomationModelOption | undefined;
export function isAutomationModel(value: unknown): value is AutomationModel;
export function isAutomationReasoningEffort(
  value: unknown,
): value is AutomationReasoningEffort;
export function isSupportedModelEffort(
  model: unknown,
  effort: unknown,
): model is AutomationModel;
export function normalizeAutomationModels(
  catalogModels: Array<{
    slug: string;
    displayName?: string;
    defaultReasoningEffort?: string;
    supportedReasoningEfforts?: string[];
  }>,
): AutomationModelOption[];
export function withAutomationModel<
  T extends { model: AutomationModel; reasoningEffort: AutomationReasoningEffort },
>(
  options: T,
  model: AutomationModel,
): Omit<T, "model" | "reasoningEffort"> & {
  model: AutomationModel;
  reasoningEffort: AutomationReasoningEffort;
};
