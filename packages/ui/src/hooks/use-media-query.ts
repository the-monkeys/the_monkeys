/**
MIT License

Copyright (c) 2021 Vitaly Rtishchev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { useEffect, useState } from "react";

export interface UseMediaQueryOptions {
	getInitialValueInEffect: boolean;
}

function getInitialValue(query: string, initialValue?: boolean) {
	if (typeof initialValue === "boolean") {
		return initialValue;
	}

	if (typeof window !== "undefined" && "matchMedia" in window) {
		return window.matchMedia(query).matches;
	}

	return false;
}

export function useMediaQuery(
	query: string,
	initialValue?: boolean,
	{ getInitialValueInEffect }: UseMediaQueryOptions = {
		getInitialValueInEffect: true,
	},
): boolean {
	const [matches, setMatches] = useState(
		getInitialValueInEffect ? initialValue : getInitialValue(query),
	);
	useEffect(() => {
		try {
			if ("matchMedia" in window) {
				const mediaQuery = window.matchMedia(query);
				setMatches(mediaQuery.matches);
				const callback = (event: MediaQueryListEvent) =>
					setMatches(event.matches);
				mediaQuery.addEventListener("change", callback);
				return () => {
					mediaQuery.removeEventListener("change", callback);
				};
			}
		} catch (e) {
			// Safari iframe compatibility issue
			return undefined;
		}
	}, [query]);

	return matches || false;
}

export namespace useMediaQuery {
	export type Options = UseMediaQueryOptions;
}
