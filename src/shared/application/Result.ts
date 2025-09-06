export class Result<TValue, TError> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: TValue;
  private readonly _error?: TError;

  private constructor(isSuccess: boolean, value?: TValue, error?: TError) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;
    Object.freeze(this);
  }

  public get value(): TValue {
    if (this.isFailure) {
      throw new Error('Cannot retrieve value from a failed result.');
    }
    return this._value as TValue;
  }

  public get error(): TError {
    if (this.isSuccess) {
      throw new Error('Cannot retrieve error from a successful result.');
    }
    return this._error as TError;
  }

  public static success<_U, E>(): Result<void, E>;
  public static success<U, E>(value: U): Result<U, E>;
  public static success<U, E>(value?: U): Result<U | void, E> {
    return new Result(true, value);
  }

  public static failure<U, E>(error: E): Result<U, E> {
    return new Result(false, undefined, error) as Result<U, E>;
  }
}
