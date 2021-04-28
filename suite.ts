import type { Context, Label, Runnable } from "./types.d.ts";

export class Suite {
  private pre: Runnable[] = [];
  private post: Runnable[] = [];
  private preAll: Runnable[] = [];
  private postAll: Runnable[] = [];
  private suites: Suite[] = [];
  private tests: Test[] = [];

  constructor(
    readonly label: Label = "",
    readonly ctx: Context = {},
  ) {}

  static clone(suite: Suite, label?: Label, ctx?: Context): Suite {
    const nextLabel = label ?? suite.label;
    const nextCtx = ctx ??
      Object.entries(suite.ctx).reduce((o, [k, v]) => ({ ...o, [k]: v }), {});

    const next = new Suite(nextLabel, nextCtx);
    next.beforeAll(...suite.preAll);
    next.afterAll(...suite.postAll);
    next.beforeEach(...suite.pre);
    next.afterEach(...suite.post);

    return next;
  }

  beforeAll(...runs: Runnable[]) {
    this.preAll = this.preAll.concat(runs);
    return this;
  }

  afterAll(...runs: Runnable[]) {
    this.postAll = this.postAll.concat(runs);
    return this;
  }

  beforeEach(...runs: Runnable[]) {
    this.pre = this.pre.concat(runs);
    return this;
  }

  afterEach(...runs: Runnable[]) {
    this.post = this.post.concat(runs);
    return this;
  }

  suite(label: Label): Suite {
    const nextLabel = this.label.length ? join(this.label, label) : label;
    const next = Suite.clone(this, nextLabel);
    this.suites.push(next);
    return next;
  }

  test(label: Label, run: Runnable) {
    this.tests.push({ label: join(this.label, label), run });
    return this;
  }

  async run() {
    await runSeries(this.preAll, this.ctx);
    await Promise.all(this.tests.map(async (t) => {
      await runSeries(this.pre, this.ctx);
      Deno.test(t.label, t.run.bind(null, this.ctx));
      await runSeries(this.post, this.ctx);
    }));
    await runSeries(this.suites.map((s) => s.run.bind(s)));
    await runSeries(this.postAll, this.ctx);
  }
}

const voidP = Promise.resolve();

function runSeries(ps: Runnable[], ctx: Context = {}): Promise<void> {
  return ps.reduce<Promise<void>>((a, p) => a.then(p.bind(null, ctx)), voidP);
}

function join(p: Label, c: Label): Label {
  return `${p} / ${c}`;
}
