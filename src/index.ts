/* tslint:disable no-console */
import {spawn} from "child_process";
import * as minimatch from "minimatch";
import {extname, resolve} from "path";

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

export interface Ioptions {
  ext?: string | string[];
  pattern?: string | string[];
}

export default class GitStatusFilterFileExt {
  private dirPath: string;

  constructor(dirPath: string, readonly options?: Ioptions) {
    this.dirPath = resolve(__dirname, dirPath);
  }

  public start(): Promise<any> {
    const {ext, pattern} = this.options;
    const gitDiff = spawn("git", [
      `--git-dir=${this.dirPath}/.git`,
      "diff",
      "--cached",
      "--name-status",
      "--diff-filter=ACM",
    ]);

    // filter extensions or pattern
    let grepCommand: string | string[] = "\.js$";
    if (typeof ext === "string") {
      grepCommand = `${ext}$`;
    } else if (Array.isArray(ext)) {
      const rmDot = ext.map((item) => item.replace(".", ""));
      grepCommand = ["-E", `\.(${rmDot.join("|")})$`];
    } else if (pattern) {
      grepCommand = pattern;
    }

    const grep = spawn("grep", typeof grepCommand === "string" ? [grepCommand] : grepCommand);
    let result = "";

    gitDiff.stdout.on("data", (data) => {
      grep.stdin.write(data);
    });

    gitDiff.stderr.on("data", (data) => {
      console.error(`git diff stderr: ${data}`);
    });

    gitDiff.on("close", () => {
      grep.stdin.end();
    });

    grep.stdout.on("data", (data) => {
      result += data.toString();
    });

    grep.stderr.on("data", (data) => {
      console.error(`grep stderr: ${data}`);
    });

    return new Promise((resolved, reject) => {
      grep.on("close", (code) => {
        // split and remove last item
        const resultArr = result.split("\n").slice(0, -1);
        return resolved(resultArr.map((file) => {
          const fileStatus = file.split("\t");

          return {
            path: fileStatus[1],
            status: fileStatus[0],
          };
        }));
      });
    });
  }
}
