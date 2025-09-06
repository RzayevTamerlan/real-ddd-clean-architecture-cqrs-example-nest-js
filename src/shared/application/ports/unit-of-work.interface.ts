export const IUnitOfWork = Symbol('IUnitOfWork');

export interface IUnitOfWork {
  commitChanges(): Promise<void>;
}
