
import * as minimatch from "minimatch";
import {DiffDelta, Repository} from "nodegit";
import {extname, resolve} from "path";

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

export interface Ioptions {
  ext?: string | string[];
  pattern?: string;
}

export default class GitStatusFilterFileExt {
  private dirPath: string;

  constructor(dirPath: string, readonly options?: Ioptions) {
    this.dirPath = resolve(__dirname, dirPath);
  }

  public start(): Promise<IFileStatus[]> {
    return Repository.open(this.dirPath)
      .then(this.getStatus)
      .then(this.filterFiles);
  }

  private getStatus = (repo: Repository) => {
    return repo.getStatus(null);
  }

  private filterFiles = (arrayStatusFile: IFileStatus[]) => {
    const pattern = this.options.pattern;
    const ext = this.options.ext;

    return arrayStatusFile.filter((file) => {
      const filePath = file.path();
      const fileExt = extname(file.path());
      const matchPattern = pattern ? minimatch(filePath, pattern, {matchBase: true}) : true;

      if (typeof ext === "string") {
        // if options ext is string
        return fileExt === ext && matchPattern;
      } else if (Array.isArray(ext)) {
        // if options is array
        return ext.indexOf(fileExt) !== -1 && matchPattern;
      }

      return matchPattern;
    });
  }
}
