import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'superclean',
  run: async (toolbox) => {
    const { print, clean, parameters } = toolbox
    toolbox.cleaning.clean(parameters.first)
  },
}

module.exports = command
