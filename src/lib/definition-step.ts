import { Command } from './command'

class DefinitionStep {
  public stepID: string;
  public message: string;
  public type: string;
  public command?: Command;
  public dependency?: string;
  public path?: string
  public platforms?: string[]

  constructor(data: DefinitionStep) {
    this.stepID = data['step_id'];
    this.message = data['message'];
    this.type = data['type'];
    this.path = data['path']
    this.platforms = data['platforms']

    if (this.type === 'shell') {
      this.command = new Command(data.command);
    }

    if (this.type === 'dependency') {
      this.dependency = data['definition'];
    }
  }
}

export { DefinitionStep }
