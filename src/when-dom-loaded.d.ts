/**
 * Adds a function to the list of functions to be called when the DOM is loaded.
 * If the DOM is already loaded, the function is called immediately.
 *
 * @param fn The function to add.
 */
export declare function whenDomLoaded(fn: () => void): void;

/**
 * Removes a function from the list of functions to be called when the DOM is loaded.
 *
 * @param fn The function to remove.
 * @returns `true` if the function was removed, `false` otherwise.
 */
export declare function remove(fn: () => void): boolean;

export default whenDomLoaded;
