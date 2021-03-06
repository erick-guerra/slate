import { Editor } from '@gitbook/slate-react';

import * as React from 'react';
import { Button, Toolbar } from '../components';

import PluginEditBlockquote from '@gitbook/slate-edit-blockquote';

import INITIAL_VALUE from './value';

const blockquote = PluginEditBlockquote();
const plugins = [blockquote.plugin];

function renderNode(props) {
    const { node, children, attributes } = props;

    switch (node.type) {
        case 'blockquote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case 'paragraph':
            return <p {...attributes}>{children}</p>;
        case 'heading':
            return <h1 {...attributes}>{children}</h1>;
        default:
            return null;
    }
}

class BlockquoteExample extends React.Component {
    public state = {
        value: INITIAL_VALUE.setSchema(blockquote.schema)
    };

    public onChange = ({ value }) => {
        this.setState({
            value
        });
    };

    public onWrapInBlockquote = e => {
        const { value } = this.state;

        this.onChange(blockquote.changes.wrapInBlockquote(value.change()));
    };

    public onUnwrapBlockquote = e => {
        const { value } = this.state;

        this.onChange(blockquote.changes.unwrapBlockquote(value.change()));
    };

    public render() {
        const { value } = this.state;
        const inBlockquote = blockquote.utils.isSelectionInBlockquote(value);

        return (
            <div>
                <Toolbar>
                    <Button onClick={this.onWrapInBlockquote}>
                        Blockquote
                    </Button>
                    <Button
                        onClick={this.onUnwrapBlockquote}
                        active={inBlockquote}
                    >
                        Unwrap
                    </Button>
                </Toolbar>
                <Editor
                    plugins={plugins}
                    value={value}
                    onChange={this.onChange}
                    renderNode={renderNode}
                />
            </div>
        );
    }
}

export default BlockquoteExample;
