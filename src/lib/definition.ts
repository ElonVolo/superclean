import { DefinitionStep } from './definition-step'

type DefinitionStepType = ('dependency' | 'delete' | 'shell')
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

    for (const currentStep of definitionObj.steps) {
      let nextStep = new DefinitionStep(currentStep)
      this.steps.push(nextStep)
    }
  }
}

export { Definition, DefinitionStepType }
