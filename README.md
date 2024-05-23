# superclean 

superclean is a one-stop shopping project cleaner that supports multiple platforms, frameworks, and development environments.

It collates all those really good pieces of advice on cleaning projects that you search for in the dark corners of StackOverflow when your project stops running and you've ruled out everything else.


## Install

$ ```npm install -g superclean```

## Usage

$ __superclean__ _project_type_

example: 
```
superclean react-native
```

_project_type_ can be one of the following:

| project_type | Description | notes |
| ---- | ---- | ---- |
| android | Android projects | mac-only (win/linux coming)
| cocoapods | Cleans cocoapods dependencies | mac-only |
| docker | Docker Environment | Experimental, save your data, mac-only (win/linux coming) |
| homebrew | Cleans homebrew dependencies | mac-only |
| node | node.js projects |
| react-native | React Native projects | mac-only
| vscode | Cleans vscode caches |
| xcode | Xcode projects | mac-only


## caveats

superclean will delete most build artifacts in project's directory, as well as both local and global caches that the project relies on. When you use it, you will have to re-download all those dependencies and re-run commands to rebuild the project.

# License

MIT - see LICENSE
