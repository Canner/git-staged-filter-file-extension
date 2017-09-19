import {expect} from "chai";
import {exec, execSync} from "child_process";
import {mkdirSync, writeFileSync} from "fs";
import {resolve} from "path";
import {sync as rmSync} from "rimraf";
import GitFilterFile from "../src/index";

describe("get git state uncommit files.", () => {
  before(() => {
    rmSync(resolve(__dirname, "file"));
  });

  beforeEach(() => {
    mkdirSync(resolve(__dirname, "file"));
  });

  afterEach(() => {
    rmSync(resolve(__dirname, "file"));
    execSync("git add .");
  });

  it("should get one uncommit file/test.txt", (done) => {
    writeFileSync(resolve(__dirname, "file/test.txt"), "test");
    exec("git add .", (err, stdout, stderr) => {
      const filterFile = new GitFilterFile("../", {ext: ".txt"});
      filterFile.start()
        .then((files) => {
          expect(files.length).equal(1);
          expect(files[0].path === "test/file/test.txt");
          expect(files[0].status === "A");
          done();
        })
        .catch((e) => {
          done(new Error(e));
        });
    });
  });

  it ("should get two uncommit files .txt extension", (done) => {
    writeFileSync(resolve(__dirname, "file/test.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test2.txt"), "test");

    exec("git add .", (err, stdout, stderr) => {
      const filterFile = new GitFilterFile("../", {ext: ".txt"});
      filterFile.start()
        .then((files) => {
          expect(files.length).equal(2);
          expect(files[0].path === "test/file/test.txt");
          expect(files[0].status === "A");
          expect(files[1].path === "test/file/test2.txt");
          expect(files[1].status === "A");
          done();
        })
        .catch((e) => {
          done(new Error(e));
        });
    });
  });

  it ("should get two uncommit files .wow extension", (done) => {
    writeFileSync(resolve(__dirname, "file/test.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test2.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test.wow"), "test");

    exec("git add .", (err, stdout, stderr) => {
      const filterFile = new GitFilterFile("../", {ext: ".wow"});
      filterFile.start()
        .then((files) => {
          expect(files.length).equal(1);
          expect(files[0].path === "test/file/test.wow");
          expect(files[0].status === "A");
          done();
        })
        .catch((e) => {
          done(new Error(e));
        });
    });
  });

  it ("should get multiple file extension files.", (done) => {
    writeFileSync(resolve(__dirname, "file/test.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test2.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test.wow"), "test");

    exec("git add .", (err, stdout, stderr) => {
      const filterFile = new GitFilterFile("../", {ext: [".wow", ".txt"]});
      filterFile.start()
        .then((files) => {
          expect(files.length).equal(3);
          done();
        })
        .catch((e) => {
          done(new Error(e));
        });
    });
  });

  it ("should use pattern to get .txt files", (done) => {
    writeFileSync(resolve(__dirname, "file/test.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test2.txt"), "test");
    writeFileSync(resolve(__dirname, "file/test.wow"), "test");

    exec("git add .", (err, stdout, stderr) => {
      const filterFile = new GitFilterFile("../", {pattern: "\.txt$"});
      filterFile.start()
        .then((files) => {
          expect(files.length).equal(2);
          expect(files[0].path === "test/file/test.txt");
          expect(files[1].path === "test/file/test2.txt");
          done();
        })
        .catch((e) => {
          done(new Error(e));
        });
    });
  });
});
