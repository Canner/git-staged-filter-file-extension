import {expect} from "chai";
import {ConvenientPatch, DiffFile, Repository, Tag} from "nodegit";
import GitDiffCommits from "../src/index";

describe("diff files between commits", () => {
  it("should get modified package.json", (done) => {
    const diff = new GitDiffCommits("./", "1fb5a328806fa8dd8", null);

    diff.start()
      .then((result) => {
        return result[0].patches();
      })
      .then((arrayConvenientPatch: ConvenientPatch[]) => {
        arrayConvenientPatch.forEach((patch) => {
          console.log(patch.newFile().path());
        });
        done();
      })
      .catch((err) => {
        done(new Error(err));
      });
  });
});
