import * as path from 'path'
import { GluegunToolbox } from 'gluegun'
import { DefinitionsBuilder } from '../lib/definition-builder'
import { DefinitionStep } from '../lib/definition-step'

export default function attach(toolbox: GluegunToolbox) {
  const { filesystem, print, strings, system, } = toolbox

  const runCommand = async (step: DefinitionStep) => {
    // build command ('command_name ' + arg1 + ' ' + arg2 + ' ' arg3, etc
    let commandString = [step.command.name].concat(step.command.args).join(' ')
    
    // execute the command
    const exec = await system.spawn(commandString, { shell: true })
    const { stdout = '' } = exec

    // clean it up
    const output = strings.trimEnd(stdout.toString())
    print.info(output)
  }

  const clean = (topStackLevelKey: string) => {
    let builder = new DefinitionsBuilder(toolbox)
    let defs = builder.getDefinitions(topStackLevelKey)
    
    for (const definition of defs) {
      for (const step of definition.steps) {
        if (step.type === 'delete') {
          print.info(step.message)
          let deletePath = path.join(process.cwd(), step.path)
          filesystem.remove(step.path)
        } else {
          if (step.type === 'shell') {
            print.info(step.message)
            runCommand(step)
          }
        }
      }
    }
  }

  toolbox.cleaning = {}
  toolbox.cleaning.clean = clean
}
