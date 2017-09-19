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
  path: string;

  // refs: https://git-scm.com/docs/git-diff
  // A: addition of a file
  // C: copy of a file into a new one
  // D: deletion of a file
  // M: modification of the contents or mode of a file
  // R: renaming of a file
  // T: change in the type of the file
  // U: file is unmerged (you must complete the merge before it can be committed)
  // X: "unknown" change type (most probably a bug, please report it)
  status: "A" | "C" | "D" | "M" | "R" | "T" | "U" | "X";
}
```

## API

#### GitFilterFile(<.git path>, options)

- .git path: where your git repo lives.
- options: should pass a object, like below.
  - ext: file extensions, could be string or string array. For example `.js` or `['.js', '.jsx']`
  - pattern: this will pass to `grep` command as pattern, you can also passed as an array will be pass as arguments to `grep` command.

```ts
export interface Ioptions {
  ext?: string | string[]; // optional
  pattern?: string | string[]; // optional
}
```
