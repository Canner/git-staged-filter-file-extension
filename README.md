# git-status-filter-file-extension

get git current uncommit status, and filter with file extension.

## Install

```
npm install @canner/git-status-filter-file-extension
```

## Usage

```ts
const filterFile = new GitFilterFile("./", ".wow");

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