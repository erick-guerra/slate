import { Block, Change, Schema } from '@gitbook/slate';
import { CHILD_OBJECT_INVALID } from '@gitbook/slate-schema-violations';

import Options from '../options';

/*
 * Create a schema definition with rules to normalize blockquotes
 */
function createSchema(opts: Options): Schema {
    return Schema.create({
        blocks: {
            [opts.type]: {
                nodes: [
                    {
                        objects: ['block']
                    }
                ],
                normalize(change, violation, context) {
                    switch (violation) {
                        case CHILD_OBJECT_INVALID:
                            return containBlocks(opts, change, context);
                        default:
                            return undefined;
                    }
                }
            }
        }
    });
}

/*
 *  Ensures that blockquotes always contain blocks.
 */
function containBlocks(
    opts: Options,
    change: Change,
    context: object
): Change | null {
    const toWrap = context.node.nodes.filter(n => n.object !== 'block');

    if (toWrap.isEmpty()) {
        return undefined;
    }

    // Wrap text/inline nodes in default block
    const wrapper = Block.create({
        type: opts.typeDefault,
        nodes: []
    });

    change.insertNodeByKey(
        context.node.key,
        0,
        wrapper,
        // Be careful of Slate's core schema removing inlines or blocks when
        // a block contains a mix of them.
        { normalize: false }
    );

    toWrap.forEach((child, index) => {
        const isLast = index === toWrap.size - 1;

        change.moveNodeByKey(child.key, wrapper.key, index, {
            normalize: isLast
        });
    });

    return change;
}

export default createSchema;
