/* @jsx h */

import { Range } from '@gitbook/slate';
import h from '../../../helpers/h';

export default function(simulator) {
    const { value } = simulator;
    const text = value.document.getTexts().first();
    const selection = Range.create()
        .collapseToStartOf(text)
        .move(1)
        .focus();
    simulator.select(null, { selection });
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
            <paragraph>
                w<cursor />
                ord
            </paragraph>
        </document>
    </value>
);
