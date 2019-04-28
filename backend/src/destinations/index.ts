export interface IDestination<T> {
  execute(config: T): Promise<void>;
}
