
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

export default class GitStatusFilterFileExt {
  private dirPath: string;

  constructor(dirPath: string, readonly ext: string[] | string) {
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
    return arrayStatusFile.filter((file) => {
      const fileExt = extname(file.path());
      if (typeof this.ext === "string") {
        return fileExt === this.ext;
      }
      return this.ext.indexOf(fileExt) !== -1;
    });
  }
}
