type Label = string
type Context = { [k: string]: any }
type Runnable = (this: Context) => void | Promise<void>
type Test = { label: Label, run: Runnable }