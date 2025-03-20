declare module 'tape-six' {
  /**
   * Test interface
   */
  interface Test {
    /**
     * Asserts that `value` is truthy.
     * @param value - The value to test
     * @param message - Optional message to display if the assertion fails
     */
    ok(value: unknown, message?: string): void;
    /**
     * Asserts that `value` is not truthy.
     * @param value - The value to test
     * @param message - Optional message to display if the assertion fails
     */
    notOk(value: unknown, message?: string): void;
    /**
     * Asserts that `actual` is deeply equal to `expected`.
     * @param actual - The actual value
     * @param expected - The expected value
     * @param message - Optional message to display if the assertion fails
     */
    equal(actual: unknown, expected: unknown, message?: string): void;
    /**
     * Asserts that `actual` is deeply equal to `expected`.
     * @param actual - The actual value
     * @param expected - The expected value
     * @param message - Optional message to display if the assertion fails
     */
    deepEqual(actual: unknown, expected: unknown, message?: string): void;
    /**
     * Asserts that `actual` is not deeply equal to `expected`.
     * @param actual - The actual value
     * @param expected - The expected value
     * @param message - Optional message to display if the assertion fails
     */
    notDeepEqual(actual: unknown, expected: unknown, message?: string): void;
    /**
     * Asserts that `actual` is not equal to `expected`.
     * @param actual - The actual value
     * @param expected - The expected value
     * @param message - Optional message to display if the assertion fails
     */
    notEqual(actual: unknown, expected: unknown, message?: string): void;
    /**
     * Asserts that `actual` is not strictly equal to `expected`.
     * @param actual - The actual value
     * @param expected - The expected value
     * @param message - Optional message to display if the assertion fails
     */
    notStrictEqual(actual: unknown, expected: unknown, message?: string): void;
    /**
     * Asserts that `actual` is strictly equal to `expected`.
     * @param actual - The actual value
     * @param expected - The expected value
     * @param message - Optional message to display if the assertion fails
     */
    strictEqual(actual: unknown, expected: unknown, message?: string): void;
    /**
     * Asserts that `fn` throws an error.
     * @param fn - The function to test
     * @param message - Optional message to display if the assertion fails
     */
    throws(fn: () => void, message?: string): void;
  }
  /**
   * Creates a new test with the given name and function.
   * @param name - The name of the test
   * @param fn - The test function
   */
  function test(name: string, fn: (t: Test) => void | Promise<void>): void;
  export default test;
}
