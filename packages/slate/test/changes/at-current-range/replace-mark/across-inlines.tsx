/* @jsx h */

import h from '../../../helpers/h';

export default function(change) {
    change.replaceMark('italic', 'bold');
}

export const input = (
    <value>
        <document>
            <paragraph>
                <link>
                    wo
                    <anchor />
                    <i>rd</i>
                </link>
                <i />
            </paragraph>
            <paragraph>
                <i />
                <link>
                    <i>an</i>
                    <focus />
                    other
                </link>
            </paragraph>
        </document>
    </value>
);

export const output = (
    <value>
        <document>
            <paragraph>
                <link>
                    wo
                    <anchor />
                    <b>rd</b>
                </link>
                <b />
            </paragraph>
            <paragraph>
                <b />
                <link>
                    <b>an</b>
                    <focus />
                    other
                </link>
            </paragraph>
        </document>
    </value>
);
