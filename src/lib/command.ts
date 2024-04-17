export class Command {
  public name: string;
  public args: string[] = [];

  constructor(commandProps: { name: string; args: string[]; }) {
    if (!commandProps.name) {
      throw new Error('Command must have a name');
    }

    this.name = commandProps['name'];
    this.args = commandProps['args'];
  }
}
