#!/usr/bin/env node

/**
 * Kramdown Sort Numbered Footnotes
 * @author Una Ada <una@anarchy.website>
 * @version 0.1.1
 * @since 0.1.0
 */

import { readFile, writeFile } from 'fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const sort = ({ d, f }) =>
  readFile(f)
    .then(t =>
      writeFile(
        d || f,
        ((i, o) =>
          [
            ...[...t.toString().matchAll(i('(\\d+)'))].reduce(
              (m, [, v]) => (m.has(v) ? m : m.set(v, m.size + 1)),
              new Map()
            ),
          ]
            .reduce((p, [k, v]) => p.replace(i(k), o('x' + v)), t.toString())
            .replace(i('(x)(\\d+)'), o('$2')))(
          n => new RegExp(`\\[\\^${n}\\]`, 'gm'),
          n => `[^${n}]`
        )
      ).catch(e => console.error(e))
    )
    .catch(e => console.error(e));

yargs(hideBin(process.argv))
  .usage('Usage: $0 <file> [options]')
  .command(
    '$0 <file>',
    'Sort the footnotes in a kramdown file.',
    yargs =>
      yargs.positional('file', {
        alias: 'f',
        describe: 'File to sort footnotes in',
        type: 'string',
      }),
    sort
  )
  .option('dest', {
    alias: 'd',
    default: null,
    describe: 'Set the destination of the sorted file',
    type: 'string',
  })
  .help().argv;
