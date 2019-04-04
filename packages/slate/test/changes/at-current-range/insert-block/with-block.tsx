/* @jsx h */

import { Block } from '@gitbook/slate';
import h from '../../../helpers/h';

export default function(change) {
    change.insertBlock(Block.create({ type: 'quote' }));
}

export const input = (
    <value>
        <document>
            <paragraph>
                <cursor />
                word
            </paragraph>
        </document>
    </value>
);

export const output = (
    <value>
        <document>
            <quote>
                <cursor />
            </quote>
            <paragraph>word</paragraph>
        </document>
    </value>
);