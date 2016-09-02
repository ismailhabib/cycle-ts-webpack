import xs, {Stream} from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, input, p, makeDOMDriver, VNode} from '@cycle/dom';
import {DOMSource} from "@cycle/dom/xstream-typings";

export type Sources = {
    DOM: DOMSource,
};
export type Sinks = {
    DOM: Stream<VNode>,
}

function main(sources:Sources): Sinks {
    const sinks = {
        DOM: sources.DOM.select('input').events('change')
            .map((ev: Event) => {
                console.log(ev)
                return ev.target.checked
            })
            .startWith(false)
            .map((toggled:boolean) =>
                div([
                    input({attrs: {type: 'checkbox'}}), 'Toggle me',
                    p(toggled ? 'ON' : 'off')
                ])
            )
    }
    return sinks;
}

run(main, {
    DOM: makeDOMDriver('#app')
});