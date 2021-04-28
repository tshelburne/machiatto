import type { Runnable, Test } from "./types.d.ts";
import { Suite } from "./suite.ts";

const root = new Suite();
let suite: Suite = root;

export function before(run: Runnable) {
  suite.beforeAll(run);
}

export function after(run: Runnable) {
  suite.afterAll(run);
}

export function beforeEach(run: Runnable) {
  suite.beforeEach(run);
}

export function afterEach(run: Runnable) {
  suite.afterEach(run);
}

export function describe(label: Suite["label"], def: () => void) {
  const prev = suite;
  const next = prev.suite(label);

  suite = next;
  def();
  suite = prev;
}

export function it(label: Test["label"], run: Runnable) {
  suite.test(label, run);
}

export async function run() {
  await root.run();
}
