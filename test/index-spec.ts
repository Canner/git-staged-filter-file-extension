import {expect} from "chai";
import {mkdirSync, writeFileSync} from "fs";
import {ConvenientPatch, DiffFile, Repository, Tag} from "nodegit";
import {resolve} from "path";
import {sync as rmSync} from "rimraf";
import GitFilterFile from "../src/index";

describe("get git state uncommit files.", () => {
  it("should get one uncommit file/test.txt", (done) => {
    rmSync(resolve(__dirname, "file"));
    mkdirSync(resolve(__dirname, "file"));
    writeFileSync(resolve(__dirname, "file/test.txt"), "test");

    const filterFile = new GitFilterFile("./", ".txt");
    filterFile.start()
      .then((files) => {
        expect(files.length).equal(1);
        expect(files[0].path() === "file/test.txt");
        rmSync(resolve(__dirname, "file"));
        done();
      })
      .catch((e) => {
        done(new Error(e));
      });
  });

  it ("should get two uncommit files .txt extension", (done) => {
    rmSync(resolve(__dirname, "file"));
    mkdirSync(resolve(__dirname, "file"));
    writeFileSync(resolve(__dirname, "file/test.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test2.txt"), "test");

    const filterFile = new GitFilterFile("./", ".txt");
    filterFile.start()
      .then((files) => {
        expect(files.length).equal(2);
        expect(files[0].path() === "file/test.txt");
        expect(files[1].path() === "file/test2.txt");
        rmSync(resolve(__dirname, "file"));
        done();
      })
      .catch((e) => {
        done(new Error(e));
      });
  });

  it ("should get two uncommit files .wow extension", (done) => {
    rmSync(resolve(__dirname, "file"));
    mkdirSync(resolve(__dirname, "file"));
    writeFileSync(resolve(__dirname, "file/test.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test2.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test.wow"), "test");

    const filterFile = new GitFilterFile("./", ".wow");
    filterFile.start()
      .then((files) => {
        expect(files.length).equal(1);
        expect(files[0].path() === "file/test.wow");
        rmSync(resolve(__dirname, "file"));
        done();
      })
      .catch((e) => {
        done(new Error(e));
      });
  });

  it ("should get multiple file extension files.", (done) => {
    rmSync(resolve(__dirname, "file"));
    mkdirSync(resolve(__dirname, "file"));
    writeFileSync(resolve(__dirname, "file/test.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test2.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test.wow"), "test");

    const filterFile = new GitFilterFile("./", [".wow", ".txt"]);
    filterFile.start()
      .then((files) => {
        expect(files.length).equal(3);
        rmSync(resolve(__dirname, "file"));
        done();
      })
      .catch((e) => {
        done(new Error(e));
      });
  });
});
