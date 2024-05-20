import { DefinitionStep } from './definition-step'

type DefinitionStepType = ('dependency' | 'delete' | 'shell')
type DefinitionStatus = ('enabled' | 'disabled' | 'only')

interface DefinitionCommandData {
  name: string,
  args?: string[]
}

interface DefinitionStepData {
  step_id: string
  message: string
  type: DefinitionStepType
  definition?:string
  command?: DefinitionCommandData
  status: DefinitionStatus
}

interface DefinitionData {
  name: string
  steps: DefinitionStepData[]
}

class Definition {
  public name: string
  public steps: DefinitionStep[] = []

  constructor(definitionObj) {
    this.name = definitionObj.name

    //
    // Gets what status the definiton has
    // - DefinitionStatus.enabled  All the steps in the definition will be run, and this is their status by default
    // - DefinitionStatus.disabled All the steps that do not have a disabled status flag will be run
    // - DefinitionStatus.only     Only steps marked in the definition has "only" will be run
    // - In the event that there both a DefinitionStatus.disabled and DefinitionStatus.only flag set for steps,
    //    the DefinitionStatus.only flag has priority
    let currentStatus:DefinitionStatus = 'enabled'

    for (const currentStep of definitionObj.steps) {
      let nextStep = new DefinitionStep(currentStep)

      if (nextStep.status === 'disabled' && currentStatus === 'enabled') {
        // We've encountered a 'disabled' step, so we set the behavior of the definition
        // to "run only the not-disabled steps"
        currentStatus = 'disabled'
      } else if (nextStep.status === 'only') {
        // We've encountered an 'only' step, so we set the behavior of the definition
        // to "run only the steps flagged with the 'only" flag set
        currentStatus = 'only'
      }

      this.steps.push(nextStep)
    }

    if (currentStatus === 'disabled') {
      this.steps = this.steps.filter(x => x.status !== 'disabled')
    } else if (currentStatus === 'only') {
      this.steps = this.steps.filter(x => x.status === 'only')
    }
  }
}

export { Definition, DefinitionStepType, DefinitionStatus }
