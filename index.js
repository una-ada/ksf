/**
 * Kramdown Sort Numbered Footnotes
 * @author Una Ada <una@anarchy.website>
 * @version 2021.09.02
 * @since 2021.09.02
 */

import { readFile, writeFile } from 'fs/promises';

readFile('in.kd')
  .then(d =>
    writeFile(
      'out.kd',
      ((i, o) =>
        [
          ...[...d.toString().matchAll(i('(\\d+)'))].reduce(
            (m, [, v]) => (m.has(v) ? m : m.set(v, m.size + 1)),
            new Map()
          ),
        ]
          .reduce((t, [k, v]) => t.replace(i(k), o('x' + v)), d.toString())
          .replace(i('(x)(\\d+)'), o('$2')))(
        n => new RegExp(`\\[\\^${n}\\]`, 'gm'),
        n => `[^${n}]`
      )
    ).catch(e => console.error(e))
  )
  .catch(e => console.error(e));
