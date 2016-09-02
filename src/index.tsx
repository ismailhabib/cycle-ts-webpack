import xs, {Stream, MemoryStream} from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, input, p, makeDOMDriver, VNode, button, h1, h4, a} from '@cycle/dom';
import {DOMSource} from "@cycle/dom/xstream-typings";
import {makeHTTPDriver} from "@cycle/http";
import {HTTPSource} from "@cycle/http/xstream-typings";

export type Sources = {
    DOM: DOMSource,
    HTTP: HTTPSource
};
export type Sinks = {
    DOM: Stream<VNode>,
    HTTP: Stream<VNode>
}

interface User {
    name: string,
    email: string,
    website: string
}

function main(sources: Sources): Sinks {
    const getRandomUser$ = sources.DOM.select('.get-random').events('click')
        .map(() => {
            const randomNum = Math.round(Math.random() * 9) + 1;
            return {
                url: 'http://jsonplaceholder.typicode.com/users/' + String(randomNum),
                category: 'users',
                method: 'GET'
            };
        });

    const user$: MemoryStream<User> = sources.HTTP.select('users')
        .flatten()
        .map(res => res.body as User)
        .startWith(null);

    const vdom$ = user$.map(user =>
        div('.users', [
            button('.get-random', 'Get random user'),
            user === null ? null : div('.user-details', [
                h1('.user-name', user.name),
                h4('.user-email', user.email),
                a('.user-website', {attrs: {href: user.website}}, user.website)
            ])
        ])
    );

    return {
        DOM: vdom$,
        HTTP: getRandomUser$
    };
}

run(main, {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver()
});