/* @jsx h */

import { Leaf } from '@gitbook/slate';
import { List } from 'immutable';

export const input = List([
    Leaf.create({
        text: 'Cat'
    }),
    Leaf.create({
        text: 'is'
    }),
    Leaf.create({
        text: 'Cute'
    })
]);

export default function(leaves) {
    return List(Leaf.splitLeaves(leaves, 'CatisCute'.length));
}

export const output = List([
    List([
        Leaf.create({
            text: 'Cat'
        }),
        Leaf.create({
            text: 'is'
        }),
        Leaf.create({
            text: 'Cute'
        })
    ]),
    List([
        Leaf.create({
            text: ''
        })
    ])
]);
