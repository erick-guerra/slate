/* @jsx h */

import { Mark } from '@gitbook/slate';
import h from '../../../../helpers/h';

export const input = (
    <text>
        Cat<b> is Cute</b>
    </text>
)[0];

export default function(t) {
    return t.addMark(3, 4, Mark.create('bold'));
}

export const output = (
    <text>
        Cat<b> is Cute</b>
    </text>
)[0];
