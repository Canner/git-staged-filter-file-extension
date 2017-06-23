
import {Commit, ConvenientPatch, Diff, DiffFile, Oid, Repository, Tag, Tree} from "nodegit";
import {resolve} from "path";

type DiffTypes = Diff | Diff[];

function noop() {} // tslint:disable-line

export default class GitDiffCommit {
  private commitFrom: string;
  private commitFromObj: Commit;
  private commitTo: string;
  private commitToObj: Commit;
  private dirPath: string;
  private commitFromTree: Tree;
  private commitToTree: Tree;

  constructor(dirPath: string, commitFrom: string, commitTo: string) {
    if (!commitFrom && commitTo) {
      throw new Error("if commitTo is defined, commitFrom must defined");
    }
    this.commitFrom = commitFrom;
    this.commitTo = commitTo;
    this.dirPath = resolve(process.cwd(), dirPath);
  }

  public start(): Promise<Diff[]> {
    return Repository.open(this.dirPath)
      .then(this.getCommitFromTree)
      .then(this.getCommitToTree)
      .then(this.diffTreeToTree)
      .then(this.diff);
  }

  public getCommitFrom() {
    return this.commitFrom;
  }

  public getCommitTo() {
    return this.commitTo;
  }

  private getCommitToTree = (repo: Repository): Promise<Repository> => {
    if (this.commitTo) {
      const getCommitTo = this.getCommit(repo, this.commitTo);
      return getCommitTo
        .then((commit) => {
          this.commitToObj = commit;
          return commit.getTree();
        })
        .then((tree) => {
          this.commitToTree = tree;
          return repo;
        });
    }

    return Promise.resolve(repo);
  }

  private getCommitFromTree = (repo: Repository): Promise<Repository> => {
    if (this.commitFrom) {
      const getCommitFrom = this.getCommit(repo, this.commitFrom);
      return getCommitFrom
        .then((commit) => {
          this.commitFromObj = commit;
          return commit.getTree();
        })
        .then((tree) => {
          this.commitFromTree = tree;
          return repo;
        });
    }

    return Promise.resolve(repo);
  }

  private getCommit(repo: Repository, commitSha: string): Promise<Commit> {
    const oid = Oid.fromString(commitSha);
    return Commit.lookupPrefix(repo, oid, commitSha.length);
  }

  private diffTreeToTree = (repo: Repository): Promise<DiffTypes> => {
    if (!this.commitFrom) {
      // if commitFrom is not defined get from HEAD commit to current
      return repo.getHeadCommit()
        .then((commit) => {
          return commit.getDiff(noop);
        });
    }

    if (!this.commitTo) {
      // if commitTo is not defined get from commitFrom to current
      return this.commitFromObj.getDiff(noop);
    }
    return Diff.treeToTree(repo, this.commitFromTree, this.commitToTree, null);
  }

  private diff = (diff: DiffTypes): Promise<Diff[]> => {
    if (Array.isArray(diff)) {
      return Promise.resolve(diff);
    }

    return Promise.resolve([diff]);
  }
}
