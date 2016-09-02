/// <reference path="../typings/index.d.ts" />

import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, h1} from '@cycle/dom';

function main() {
    const sinks = {
        DOM: xs.periodic(1000).map(i =>
            h1('' + i + ' seconds elapsed')
        )
    };
    return sinks;
}

const drivers:any = {
    DOM: makeDOMDriver('#app')
};

run(main, drivers);