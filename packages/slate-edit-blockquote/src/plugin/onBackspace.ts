import { Change } from '@gitbook/slate';

import { unwrapBlockquote } from '../changes';
import Options from '../options';
import { getCurrentBlockquote } from '../utils';

/*
 * User pressed Delete in an editor:
 * Unwrap the blockquote if at the start of the inner block.
 */

function onBackspace(opts: Options, event: any, change: Change, editor: any) {
    const { value } = change;
    const { startOffset, isCollapsed } = value;

    if (!getCurrentBlockquote(opts, value) || !isCollapsed) {
        return undefined;
    }

    if (startOffset !== 0) {
        return undefined;
    }

    // Block is empty, we exit the blockquote
    event.preventDefault();

    return unwrapBlockquote(opts, change);
}

export default onBackspace;
