import { expect } from 'chai';
import { List, Map } from 'immutable';

import { setEntries, next, vote } from '../src/core';

describe('application logic', () => {

    describe('setEntries', () => {
        it('adds the entries to the state', () => {
            const state = Map();
            const entries = List.of('Trainspotting', '28 Days Later');
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({
                entries: List.of('Trainspotting', '28 Days Later')
            }));
        });
        it('converts to immutable', () => {
            const state = Map();
            const entries = ['Trainspotting', '28 Days Later'];
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({
                entries: List.of('Trainspotting', '28 Days Later')
            }));
        });
    });

    describe('next', () => {
        it('takes the next two entries', () => {
            var state = Map({
                entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later')
                }),
                entries: List.of('Sunshine')
            }));
        });
        it('puts winner of the current vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: List.of('Sunshine', 'Millions', '127 Hours')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Sunshine', 'Millions')
                }),
                entries: List.of('127 Hours', 'Trainspotting')
            }));
        });
        it('puts both from tied vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 3,
                        '28 Days Later': 3
                    })
                }),
                entries: List.of('Sunshine', 'Millions', '127 Hours')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Sunshine', 'Millions')
                }),
                entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
            }));
        });
        it('marks winner when just one entry left', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: List()
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                winner: 'Trainspotting'
            }));
        });
    });

    describe('vote', () => {
        it('create a tally for the voted entry', () => {
            var state = Map({
                pair: List.of('Trainspotting', '28 Days Later')
            });
            var nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                    'Trainspotting': 1
                })
            }));
        });
        it('increments existing tally for the voted entry', () => {
            var state = Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                    'Trainspotting': 3,
                    '28 Days Later': 2
                })
            });
            var nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                    'Trainspotting': 4,
                    '28 Days Later': 2
                })
            }));
        });
    });
});
