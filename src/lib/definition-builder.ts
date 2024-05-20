import { GluegunToolbox } from 'gluegun'
import { Definition } from './definition'
import * as path from 'path'

class DefinitionsBuilder {
  public toolbox: GluegunToolbox

  constructor(toolbox: GluegunToolbox) {
    this.toolbox = toolbox
  }

  public getDefinitionsLookupTable(): { [definitionName: string]: string } {
    const definitionsPath = path.join(__dirname, '..', '..', 'clean-defs')
    const definitionsPaths = this.toolbox.filesystem.find(definitionsPath, {
      matching: 'definition.json',
    })

    const resultsHash = {}
    for (const iterator of definitionsPaths) {
      const theDirName = path.basename(path.dirname(iterator))
      resultsHash[theDirName.toString()] = iterator
    }

    return resultsHash
  }

  public getDefinitions(rootDefinitionKey: string): Definition[] | undefined {
    let returnDefinitions = undefined

    if (!rootDefinitionKey) {
      throw new Error(`root definition key must not be null`)
    }

    // Get the lookup table where (name of definition) => (file path of definition)
    const allDefinitionPathsLUT = this.getDefinitionsLookupTable()

    const rootDefinitionFilePath = allDefinitionPathsLUT[rootDefinitionKey]
    if (!rootDefinitionFilePath) {
      throw new Error(
        `definition file for ${rootDefinitionKey} could not be found`
      )
    }

    let rootDefinitionObj

    try {
      const rootDefinitionJSON = this.toolbox.filesystem.read(
        rootDefinitionFilePath,
        'json'
      )
      rootDefinitionObj = new Definition(rootDefinitionJSON)
    } catch (err) {
      this.toolbox.print.error(
        `root defintion file at ${rootDefinitionFilePath} could not be read`
      )
      throw err
    }

    let definitionsQueue = [rootDefinitionObj]

    returnDefinitions = [rootDefinitionObj]

    // Keep track of which dependencies we've added to avoid circular dependency issues
    // and entry entry for the initial root dependency
    const alreadyAddedDependenciesLUT = { [rootDefinitionKey]: true }

    do {
      const currentDefinition = definitionsQueue[0]

      for (let stepIndex = 0; stepIndex < currentDefinition.steps.length; stepIndex++) {
        const currentStep = currentDefinition.steps[stepIndex]
        if (currentStep['type'] === 'dependency') {
          if (alreadyAddedDependenciesLUT[currentDefinition['dependency']]) {
            // If we've already previously added this dependency then don't add it again
            // to avoid both redundant calls and circular dependencies
            continue
          }

          this.toolbox.print.info(
            `Adding dependecy ${currentStep.dependency} for step "${currentStep.stepID}"`
          )

          let depDefinitionObj
          const definitionFilePath = allDefinitionPathsLUT[currentStep.dependency]
          if (!definitionFilePath) {
            throw new Error(
              `definition file for ${currentDefinition['definition']} could not be found`
            )
          }

          try {
            depDefinitionObj = this.toolbox.filesystem.read(
              definitionFilePath,
              'json'
            )

            let nextDefinitionObj = new Definition(depDefinitionObj)

            definitionsQueue.push(nextDefinitionObj)
            returnDefinitions.push(nextDefinitionObj)
            alreadyAddedDependenciesLUT[nextDefinitionObj['name']] = true
          } catch (err) {
            this.toolbox.print.error(
              `definition file at ${definitionFilePath} could not be read`
            )

            throw err
          }
        }
      }

      // Remove the definition we're currently looking at
      definitionsQueue.shift()
    } while (definitionsQueue.length > 0);

    return returnDefinitions
  }
}

export { DefinitionsBuilder }
