/* @jsx h */

import { Set } from 'immutable';
import h from '../../../../helpers/h';

export const input = (() => <text> Cat is Cute </text>)()[0];

export default function(t) {
    return t.getMarks();
}

export const output = Set();
