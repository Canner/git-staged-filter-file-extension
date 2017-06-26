
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
  private ext: string;

  constructor(dirPath: string, ext: string) {
    this.ext = ext;
    this.dirPath = resolve(process.cwd(), dirPath);
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
      return extname(file.path()) === this.ext;
    });
  }
}
