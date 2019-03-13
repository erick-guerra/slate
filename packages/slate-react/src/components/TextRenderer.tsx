import { Block, Inline, Leaf, Mark, Range, Text } from '@gitbook/slate';
import { List, Set } from 'immutable';
import * as React from 'react';

import { EditorContainer } from './Editor';
import LeafRenderer from './LeafRenderer';

interface TextRendererProps {
    block: Block;
    decorations: List<Range>;
    editor: EditorContainer;
    node: Text;
    ancestors: Array<Block | Inline>;
}

/*
 * Component to render a text node and all its leaves.
 */
const TextRenderer = React.memo(function TextRenderer(
    props: TextRendererProps
): React.Node {
    const { block, decorations, editor, node, ancestors } = props;
    const { value } = editor;
    const { document } = value;
    const { key } = node;

    const decs = decorations.filter(d => {
        const { startKey, endKey } = d;
        if (startKey === key || endKey === key) {
            return true;
        }
        if (startKey === endKey) {
            return false;
        }
        const startsBefore = document.areDescendantsSorted(startKey, key);
        if (!startsBefore) {
            return false;
        }
        const endsAfter = document.areDescendantsSorted(key, endKey);
        return endsAfter;
    });

    // PERF: Take advantage of cache by avoiding arguments
    const leaves = decs.size === 0 ? node.getLeaves() : node.getLeaves(decs);
    let offset = 0;

    const children = leaves.map((leaf, index) => {
        const child = (
            <LeafRenderer
                key={`${node.key}-${index}`}
                block={block}
                editor={editor}
                index={index}
                marks={leaf.marks}
                node={node}
                offset={offset}
                ancestors={ancestors}
                leaves={leaves}
                text={leaf.text}
            />
        );

        offset += leaf.text.length;
        return child;
    });

    return <span data-key={key}>{children}</span>;
},
shouldComponentUpdate);

function shouldComponentUpdate(
    p: TextRendererProps,
    n: TextRendererProps
): boolean {
    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (n.node !== p.node) {
        return true;
    }

    // If the node parent is a block node, and it was the last child of the
    // block, re-render to cleanup extra `\n`.
    const nParent = n.ancestors[n.ancestors.length - 1];
    if (nParent.object === 'block') {
        const pParent = p.ancestors[p.ancestors.length - 1];

        const pLast = pParent.nodes.last();
        const nLast = nParent.nodes.last();
        if (p.node === pLast && n.node !== nLast) {
            return true;
        }
    }

    // Re-render if the current decorations have changed.
    if (!n.decorations.equals(p.decorations)) {
        return true;
    }

    // Otherwise, don't update.
    return false;
}

export default TextRenderer;
