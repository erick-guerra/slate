/* @flow */
import * as React from 'react'
import type { List } from 'immutable'
import type { Block, Inline, Range } from '@gitbook/slate'
import logger from '@gitbook/slate-dev-logger'

import VoidWrapper from './VoidWrapper'
import Text from './text'
import getChildrenDecorations from '../utils/get-children-decorations'

type NodeRendererProps = {
    block: Block,
    decorations: List<Range>,
    editor: *,
    isFocused: boolean,
    isSelected: boolean,
    readOnly: boolean,
    node: Block | Inline,
    ancestors: Block[]
}

/*
 * Should the node update?
 */
function shouldComponentUpdate(props: NodeRendererProps, nextProps: NodeRendererProps): boolean {
    const { stack } = props.editor
    const shouldUpdate = stack.find(
        'shouldNodeComponentUpdate',
        props,
        nextProps
    )
    const n = nextProps
    const p = props

    // If the `Component` has a custom logic to determine whether the component
    // needs to be updated or not, return true if it returns true. If it returns
    // false, we need to ignore it, because it shouldn't be allowed it.
    if (shouldUpdate != null) {
        if (shouldUpdate) {
            return true
        }

        if (shouldUpdate === false) {
            logger.warn(
                "Returning false in `shouldNodeComponentUpdate` does not disable Slate's internal `shouldComponentUpdate` logic. If you want to prevent updates, use React's `shouldComponentUpdate` instead."
            )
        }
    }

    // If the `readOnly` status has changed, re-render in case there is any
    // user-land logic that depends on it, like nested editable contents.
    if (n.readOnly != p.readOnly) return true

    // If the node has changed, update. PERF: There are cases where it will have
    // changed, but it's properties will be exactly the same (eg. copy-paste)
    // which this won't catch. But that's rare and not a drag on performance, so
    // for simplicity we just let them through.
    if (n.node != p.node) return true

    // If the selection value of the node or of some of its children has changed,
    // re-render in case there is any user-land logic depends on it to render.
    // if the node is selected update it, even if it was already selected: the
    // selection value of some of its children could have been changed and they
    // need to be rendered again.
    if (n.isSelected || p.isSelected) return true
    if (n.isFocused || p.isFocused) return true

    // If the decorations have changed, update.
    if (!n.decorations.equals(p.decorations)) return true

    // Otherwise, don't update.
    return false
}

/*
 * Component to render a node (block or inline).
 */
const NodeRenderer = React.memo(function NodeRenderer(props: NodeRendererProps): React.Node {
    const {
        editor,
        isSelected,
        isFocused,
        block,
        node,
        decorations,
        ancestors,
        readOnly,
    } = props
    const { value } = editor
    const { selection } = value
    const { stack } = editor
    const indexes = node.getSelectionIndexes(selection, isSelected)
    const decs = decorations.concat(node.getDecorations(stack))
    const childrenDecorations = getChildrenDecorations(node, decs)

    const children = node.nodes.map((child, i) => {
        const isChildSelected = !!indexes && indexes.start <= i && i < indexes.end

        const Component = child.object == 'text' ? Text : Node

        return (
            <Component
                key={child.key}
                block={node.object == 'block' ? node : block}
                decorations={childrenDecorations[i]}
                editor={editor}
                isSelected={isChildSelected}
                isFocused={isFocused && isChildSelected}
                node={child}
                ancestors={ancestors.concat([node])}
                readOnly={readOnly}
            />)
    })

    // Attributes that the developer must mix into the element in their
    // custom node renderer component.
    const attributes = { 'data-key': node.key }

    // If it's a block node with inline children, add the proper `dir` attribute
    // for text direction.
    if (node.object == 'block' && node.nodes.first().object != 'block') {
        const direction = node.getTextDirection()
        if (direction == 'rtl') attributes.dir = 'rtl'
    }

    const props = {
        key: node.key,
        editor,
        isFocused,
        isSelected,
        node,
        parent: ancestors[ancestors.length - 1], // deprecated
        ancestors,
        readOnly,
    }

    const element = stack.find('renderNode', {
        ...props,
        attributes,
        children,
    })

    return node.isVoid ? <VoidWrapper {...props}>{element}</VoidWrapper> : element
}, shouldComponentUpdate)


export default NodeRenderer
