'use strict';

// Load modules

const Path = require('path');
const Code = require('code');
const Lab = require('lab');
const Linters = require('lab/lib/lint');


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const linterPath = Path.join(__dirname, '..', 'lib', 'index.js');


describe('Linters - jslint', () => {

    it('should lint files in a folder', (done) => {

        const path = Path.join(__dirname, 'lint', 'basic');
        Linters.lint({ lintingPath: path, linter: linterPath }, (err, result) => {

            expect(err).not.to.exist();
            expect(result).to.include('lint');

            const jslintResults = result.lint;
            expect(jslintResults).to.have.length(1);

            const checkedFile = jslintResults[0];
            expect(checkedFile).to.include({ filename: 'fail.js' });
            expect(checkedFile.errors).to.deep.include([
                { line: 12, severity: 'ERROR', message: 'Use spaces, not tabs.' },
                { line: 13, severity: 'ERROR', message: 'Expected \';\' and instead saw \'}\'.' },
                { line: 13, severity: 'ERROR', message: 'Stopping.' }
            ]);

            done();
        });
    });

    it('should use local configuration files', (done) => {

        const path = Path.join(__dirname, 'lint', 'with_config');
        Linters.lint({ lintingPath: path, linter: linterPath }, (err, result) => {

            expect(err).not.to.exist();
            expect(result).to.include('lint');

            const jslintResults = result.lint;
            expect(jslintResults).to.have.length(1);

            const checkedFile = jslintResults[0];
            expect(checkedFile).to.include({ filename: 'fail.js' });
            expect(checkedFile.errors).to.deep.include([
                { line: 7, severity: 'ERROR', message: 'Unused \'internals\'.' },
                { line: 13, severity: 'ERROR', message: 'Unused \'myObject\'.' }
            ]);
            expect(checkedFile.errors).to.not.deep.include({ line: 14, severity: 'ERROR', message: 'Unexpected \'eval\'.' });
            done();
        });
    });

    it('displays success message if no issues found', (done) => {

        const path = Path.join(__dirname, 'lint', 'clean');
        Linters.lint({ lintingPath: path, linter: linterPath }, (err, result) => {

            expect(err).not.to.exist();
            expect(result.lint).to.exist();

            const jslintResults = result.lint;
            expect(jslintResults).to.have.length(1);

            const checkedFile = jslintResults[0];
            expect(checkedFile.errors.length).to.equal(0);

            done();
        });
    });

    it('should pass options and not find any files', (done) => {

        const lintOptions = JSON.stringify({ argv: { remain: ['**/*.jsx'] } });
        const path = Path.join(__dirname, 'lint', 'basic');
        Linters.lint({ lintingPath: path, linter: linterPath, 'lint-options': lintOptions }, (err, result) => {

            expect(err).not.to.exist();
            expect(result).to.include('lint');

            const jslintResults = result.lint;
            expect(jslintResults).to.have.length(0);

            done();
        });
    });
});
