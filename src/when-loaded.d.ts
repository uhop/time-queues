/**
 * Adds a function to the list of functions to be called when the document is loaded.
 * If the document is already loaded, the function is called immediately.
 *
 * @param fn The function to add.
 */
export declare function whenLoaded(fn: () => void): void;

/**
 * Removes a function from the list of functions to be called when the document is loaded.
 *
 * @param fn The function to remove.
 * @returns `true` if the function was removed, `false` otherwise.
 */
export declare function remove(fn: () => void): boolean;

export default whenLoaded;
