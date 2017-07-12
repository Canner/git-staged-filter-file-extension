# git-status-filter-file-extension

get git current uncommit status, and filter with file extension.

## Install

```
npm install git-status-filter-file-extension
```

## Usage

```ts
const filterFile = new GitFilterFile("./", {ext: ".wow"});
// multiple file extensions
// const filterFile = new GitFilterFile("./", {ext: [".wow", ".txt"]});

filterFile.start()
  .then((filesArr) => {
    // filesArr type is interface IFileStatus
    // see interface in `./src/index.ts`
  })
```

IFileStatus interface

```ts
export interface IFileStatus {
  path(): string;
  headToIndex(): DiffDelta;
  indexToWorkdir(): DiffDelta;
  inIndex(): number;
  inWorkingTree(): number;
  isConflicted(): boolean;
  isDeleted(): boolean;
  isIgnored(): boolean;
  isModified(): boolean;
  isNew(): boolean;
  isRenamed(): boolean;
  isTypechange(): boolean;
  status(): string[];
  statusBit(): number;
}
```

## API

#### GitFilterFile(<.git path>, options)

- .git path: where your git repo lives.
- options: should pass a object, like below.
  - ext: file extensions, could be string or string array. For example `.js` or `['.js', '.jsx']`
  - pattern: uses minimatch for glob patterns. so this allow you to use `*.js` or `*.scss` to get filtered files. 

```ts
export interface Ioptions {
  ext?: string | string[]; // optional
  pattern?: string; // optional
}
```
