export type Label = string;
export type Context = { [k: string]: any };
export type Runnable = (ctx: Context) => void | Promise<void>;
export type Test = { label: Label; run: Runnable };
