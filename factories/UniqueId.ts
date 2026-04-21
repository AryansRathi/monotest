/*
This is to ensure that test data is unique
across all workers and test cases.

The id is a combination of the worker index and a counter.
The worker index is the index of the worker running the test.
The counter is a counter that is incremented for each test case.
*/

let counter = 0;

// Get the worker index from the environment variable.
function getWorkerIndex(): number {
    return Number(process.env.TEST_WORKER_INDEX ?? 0);
}

// Get the next unique id for the current worker.
export function getNextUniqueId(): string {
    counter += 1;
    return `w${getWorkerIndex()}t${counter}`;
}
