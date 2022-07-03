import * as fs from 'fs';
import * as path from 'path';

const glob = require('glob');
const nunjucks = require('nunjucks');
import * as mjml2html from 'mjml';
import {getMails, SRC_FOLDER} from './utils';

export default class NunjucksBuild {
  files: Array<any> = [];
  paths: Array<any> = [];
  // Any options should be passed in the constructor of your plugin,
  // (this is a public API of your plugin).
  constructor(options = {}) {
    // Applying user-specified options over the default options
    // and making merged options further available to the plugin methods.
    // You should probably validate all the options here as well.
  }

  _rebuildPage(compiler: any) {
    // TODO: refactor this
    // in order to make hot reload properly, i.e. should re-compile when component
    // gets update, we need to use new nunjucks env
    nunjucks.configure({
      watch: false,
      noCache: true,
    });

    const nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader([`./src`, `./src/components`, `./src/mails`])
    );

    nunjucksEnv.addFilter('json', JSON.stringify);

    const mailHTML: Array<any> = getMails(/.*\.njk$/);

    mailHTML.forEach(async (page) => {
      const out = path.join(`${page.name}.html`);

      const templateData = fs.readFileSync(page.entry, 'utf8');

      const templateContent = nunjucksEnv.renderString(templateData);

      const {html} = mjml2html(templateContent);

      compiler(
        out,
        html,
      );
    });
  }

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler: any) {
    // webpack module instance can be accessed from the compiler object,
    // this ensures that correct version of the module is used
    // (do not require/import the webpack or any symbols from it directly).
    const { webpack } = compiler;

    // Compilation object gives us reference to some useful constants.
    const { Compilation } = webpack;

    // RawSource is one of the "sources" classes that should be used
    // to represent asset sources in compilation.
    const { RawSource } = webpack.sources;

    compiler.hooks.make.tapAsync(
      'NunjucksBuildWebpackPlugin',
      (compilation: any, callback: Function) => {
        compilation.contextDependencies.add(path.resolve(__dirname, '..', SRC_FOLDER, 'components'));
        compilation.contextDependencies.add(path.resolve(__dirname, '..', SRC_FOLDER, 'mails'));

        callback();
      }
    );

    // add file to watch
    compiler.hooks.afterCompile.tapAsync(
      'NunjucksBuildWebpackPlugin',
      (compilation: any, callback: Function) => {
        const pagesToWatch = glob.sync(
          path.join(__dirname, '..', SRC_FOLDER, 'mails', '**/*.njk'),
          {
            absolute: true,
          }
        );

        const componentToWatch = glob.sync(
          path.join(__dirname, '..', SRC_FOLDER, 'components', '**/*.njk'),
          {
            absolute: true,
          }
        );

        const filesToWatch = [...pagesToWatch, ...componentToWatch];

        filesToWatch.filter((f: string) => !this.files.includes(f)).forEach((f: string) => {
          if (Array.isArray(compilation.fileDependencies)) {
            compilation.fileDependencies.push(f);
          } else {
            compilation.fileDependencies.add(f);
          }
        });

        this.files = [...filesToWatch];

        callback();
      }
    );

    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync(
      'NunjucksBuildWebpackPlugin',
      (compilation: any, callback: Function) => {
        this._rebuildPage((out: string, templateContent: string) => {
          compilation.emitAsset(
            out,
            new RawSource(templateContent)
          );
        });

        callback();
      }
    );
  }
}
