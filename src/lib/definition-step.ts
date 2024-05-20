import { Command } from './command'
import { DefinitionStatus } from './definition'

class DefinitionStep {
  public stepID: string;
  public message: string;
  public type: string;
  public command?: Command;
  public status: DefinitionStatus
  public dependency?: string;
  public path?: string
  public platforms?: string[]

  constructor(data: DefinitionStep) {
    this.stepID = data['step_id'];
    this.message = data['message'];
    this.type = data['type'];
    this.path = data['path']
    this.platforms = data['platforms']


    if (['enabled', 'disabled', 'only'].includes(data.status)) {
      this.status = data.status
    } else {
      this.status = 'enabled'
    }

    if (this.type === 'shell') {
      this.command = new Command(data.command);
    }

    if (this.type === 'dependency') {
      this.dependency = data['definition'];
    }
  }
}

export { DefinitionStep }
