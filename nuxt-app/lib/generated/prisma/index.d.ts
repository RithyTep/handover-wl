
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model TicketData
 * 
 */
export type TicketData = $Result.DefaultSelection<Prisma.$TicketDataPayload>
/**
 * Model AppSetting
 * 
 */
export type AppSetting = $Result.DefaultSelection<Prisma.$AppSettingPayload>
/**
 * Model ScheduledComment
 * 
 */
export type ScheduledComment = $Result.DefaultSelection<Prisma.$ScheduledCommentPayload>
/**
 * Model Backup
 * 
 */
export type Backup = $Result.DefaultSelection<Prisma.$BackupPayload>
/**
 * Model Feedback
 * 
 */
export type Feedback = $Result.DefaultSelection<Prisma.$FeedbackPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more TicketData
 * const ticketData = await prisma.ticketData.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more TicketData
   * const ticketData = await prisma.ticketData.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.ticketData`: Exposes CRUD operations for the **TicketData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TicketData
    * const ticketData = await prisma.ticketData.findMany()
    * ```
    */
  get ticketData(): Prisma.TicketDataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appSetting`: Exposes CRUD operations for the **AppSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AppSettings
    * const appSettings = await prisma.appSetting.findMany()
    * ```
    */
  get appSetting(): Prisma.AppSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scheduledComment`: Exposes CRUD operations for the **ScheduledComment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScheduledComments
    * const scheduledComments = await prisma.scheduledComment.findMany()
    * ```
    */
  get scheduledComment(): Prisma.ScheduledCommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.backup`: Exposes CRUD operations for the **Backup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Backups
    * const backups = await prisma.backup.findMany()
    * ```
    */
  get backup(): Prisma.BackupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feedback`: Exposes CRUD operations for the **Feedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feedbacks
    * const feedbacks = await prisma.feedback.findMany()
    * ```
    */
  get feedback(): Prisma.FeedbackDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.1
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    TicketData: 'TicketData',
    AppSetting: 'AppSetting',
    ScheduledComment: 'ScheduledComment',
    Backup: 'Backup',
    Feedback: 'Feedback'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "ticketData" | "appSetting" | "scheduledComment" | "backup" | "feedback"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      TicketData: {
        payload: Prisma.$TicketDataPayload<ExtArgs>
        fields: Prisma.TicketDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload>
          }
          findFirst: {
            args: Prisma.TicketDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload>
          }
          findMany: {
            args: Prisma.TicketDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload>[]
          }
          create: {
            args: Prisma.TicketDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload>
          }
          createMany: {
            args: Prisma.TicketDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketDataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload>[]
          }
          delete: {
            args: Prisma.TicketDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload>
          }
          update: {
            args: Prisma.TicketDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload>
          }
          deleteMany: {
            args: Prisma.TicketDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketDataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload>[]
          }
          upsert: {
            args: Prisma.TicketDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketDataPayload>
          }
          aggregate: {
            args: Prisma.TicketDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicketData>
          }
          groupBy: {
            args: Prisma.TicketDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketDataGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketDataCountArgs<ExtArgs>
            result: $Utils.Optional<TicketDataCountAggregateOutputType> | number
          }
        }
      }
      AppSetting: {
        payload: Prisma.$AppSettingPayload<ExtArgs>
        fields: Prisma.AppSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          findFirst: {
            args: Prisma.AppSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          findMany: {
            args: Prisma.AppSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>[]
          }
          create: {
            args: Prisma.AppSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          createMany: {
            args: Prisma.AppSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>[]
          }
          delete: {
            args: Prisma.AppSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          update: {
            args: Prisma.AppSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          deleteMany: {
            args: Prisma.AppSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppSettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>[]
          }
          upsert: {
            args: Prisma.AppSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppSettingPayload>
          }
          aggregate: {
            args: Prisma.AppSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppSetting>
          }
          groupBy: {
            args: Prisma.AppSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppSettingCountArgs<ExtArgs>
            result: $Utils.Optional<AppSettingCountAggregateOutputType> | number
          }
        }
      }
      ScheduledComment: {
        payload: Prisma.$ScheduledCommentPayload<ExtArgs>
        fields: Prisma.ScheduledCommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScheduledCommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScheduledCommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload>
          }
          findFirst: {
            args: Prisma.ScheduledCommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScheduledCommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload>
          }
          findMany: {
            args: Prisma.ScheduledCommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload>[]
          }
          create: {
            args: Prisma.ScheduledCommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload>
          }
          createMany: {
            args: Prisma.ScheduledCommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScheduledCommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload>[]
          }
          delete: {
            args: Prisma.ScheduledCommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload>
          }
          update: {
            args: Prisma.ScheduledCommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload>
          }
          deleteMany: {
            args: Prisma.ScheduledCommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScheduledCommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScheduledCommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload>[]
          }
          upsert: {
            args: Prisma.ScheduledCommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScheduledCommentPayload>
          }
          aggregate: {
            args: Prisma.ScheduledCommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScheduledComment>
          }
          groupBy: {
            args: Prisma.ScheduledCommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScheduledCommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScheduledCommentCountArgs<ExtArgs>
            result: $Utils.Optional<ScheduledCommentCountAggregateOutputType> | number
          }
        }
      }
      Backup: {
        payload: Prisma.$BackupPayload<ExtArgs>
        fields: Prisma.BackupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          findFirst: {
            args: Prisma.BackupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          findMany: {
            args: Prisma.BackupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>[]
          }
          create: {
            args: Prisma.BackupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          createMany: {
            args: Prisma.BackupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BackupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>[]
          }
          delete: {
            args: Prisma.BackupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          update: {
            args: Prisma.BackupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          deleteMany: {
            args: Prisma.BackupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BackupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>[]
          }
          upsert: {
            args: Prisma.BackupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          aggregate: {
            args: Prisma.BackupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackup>
          }
          groupBy: {
            args: Prisma.BackupGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackupGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackupCountArgs<ExtArgs>
            result: $Utils.Optional<BackupCountAggregateOutputType> | number
          }
        }
      }
      Feedback: {
        payload: Prisma.$FeedbackPayload<ExtArgs>
        fields: Prisma.FeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findFirst: {
            args: Prisma.FeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findMany: {
            args: Prisma.FeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          create: {
            args: Prisma.FeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          createMany: {
            args: Prisma.FeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          delete: {
            args: Prisma.FeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          update: {
            args: Prisma.FeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          deleteMany: {
            args: Prisma.FeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FeedbackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          upsert: {
            args: Prisma.FeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          aggregate: {
            args: Prisma.FeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeedback>
          }
          groupBy: {
            args: Prisma.FeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<FeedbackCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    ticketData?: TicketDataOmit
    appSetting?: AppSettingOmit
    scheduledComment?: ScheduledCommentOmit
    backup?: BackupOmit
    feedback?: FeedbackOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model TicketData
   */

  export type AggregateTicketData = {
    _count: TicketDataCountAggregateOutputType | null
    _min: TicketDataMinAggregateOutputType | null
    _max: TicketDataMaxAggregateOutputType | null
  }

  export type TicketDataMinAggregateOutputType = {
    ticketKey: string | null
    status: string | null
    action: string | null
    updatedAt: Date | null
  }

  export type TicketDataMaxAggregateOutputType = {
    ticketKey: string | null
    status: string | null
    action: string | null
    updatedAt: Date | null
  }

  export type TicketDataCountAggregateOutputType = {
    ticketKey: number
    status: number
    action: number
    updatedAt: number
    _all: number
  }


  export type TicketDataMinAggregateInputType = {
    ticketKey?: true
    status?: true
    action?: true
    updatedAt?: true
  }

  export type TicketDataMaxAggregateInputType = {
    ticketKey?: true
    status?: true
    action?: true
    updatedAt?: true
  }

  export type TicketDataCountAggregateInputType = {
    ticketKey?: true
    status?: true
    action?: true
    updatedAt?: true
    _all?: true
  }

  export type TicketDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketData to aggregate.
     */
    where?: TicketDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketData to fetch.
     */
    orderBy?: TicketDataOrderByWithRelationInput | TicketDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TicketData
    **/
    _count?: true | TicketDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketDataMaxAggregateInputType
  }

  export type GetTicketDataAggregateType<T extends TicketDataAggregateArgs> = {
        [P in keyof T & keyof AggregateTicketData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicketData[P]>
      : GetScalarType<T[P], AggregateTicketData[P]>
  }




  export type TicketDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketDataWhereInput
    orderBy?: TicketDataOrderByWithAggregationInput | TicketDataOrderByWithAggregationInput[]
    by: TicketDataScalarFieldEnum[] | TicketDataScalarFieldEnum
    having?: TicketDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketDataCountAggregateInputType | true
    _min?: TicketDataMinAggregateInputType
    _max?: TicketDataMaxAggregateInputType
  }

  export type TicketDataGroupByOutputType = {
    ticketKey: string
    status: string
    action: string
    updatedAt: Date
    _count: TicketDataCountAggregateOutputType | null
    _min: TicketDataMinAggregateOutputType | null
    _max: TicketDataMaxAggregateOutputType | null
  }

  type GetTicketDataGroupByPayload<T extends TicketDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketDataGroupByOutputType[P]>
            : GetScalarType<T[P], TicketDataGroupByOutputType[P]>
        }
      >
    >


  export type TicketDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ticketKey?: boolean
    status?: boolean
    action?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ticketData"]>

  export type TicketDataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ticketKey?: boolean
    status?: boolean
    action?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ticketData"]>

  export type TicketDataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ticketKey?: boolean
    status?: boolean
    action?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ticketData"]>

  export type TicketDataSelectScalar = {
    ticketKey?: boolean
    status?: boolean
    action?: boolean
    updatedAt?: boolean
  }

  export type TicketDataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"ticketKey" | "status" | "action" | "updatedAt", ExtArgs["result"]["ticketData"]>

  export type $TicketDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TicketData"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      ticketKey: string
      status: string
      action: string
      updatedAt: Date
    }, ExtArgs["result"]["ticketData"]>
    composites: {}
  }

  type TicketDataGetPayload<S extends boolean | null | undefined | TicketDataDefaultArgs> = $Result.GetResult<Prisma.$TicketDataPayload, S>

  type TicketDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketDataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketDataCountAggregateInputType | true
    }

  export interface TicketDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TicketData'], meta: { name: 'TicketData' } }
    /**
     * Find zero or one TicketData that matches the filter.
     * @param {TicketDataFindUniqueArgs} args - Arguments to find a TicketData
     * @example
     * // Get one TicketData
     * const ticketData = await prisma.ticketData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketDataFindUniqueArgs>(args: SelectSubset<T, TicketDataFindUniqueArgs<ExtArgs>>): Prisma__TicketDataClient<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TicketData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketDataFindUniqueOrThrowArgs} args - Arguments to find a TicketData
     * @example
     * // Get one TicketData
     * const ticketData = await prisma.ticketData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketDataFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketDataClient<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketDataFindFirstArgs} args - Arguments to find a TicketData
     * @example
     * // Get one TicketData
     * const ticketData = await prisma.ticketData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketDataFindFirstArgs>(args?: SelectSubset<T, TicketDataFindFirstArgs<ExtArgs>>): Prisma__TicketDataClient<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketDataFindFirstOrThrowArgs} args - Arguments to find a TicketData
     * @example
     * // Get one TicketData
     * const ticketData = await prisma.ticketData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketDataFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketDataClient<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TicketData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TicketData
     * const ticketData = await prisma.ticketData.findMany()
     * 
     * // Get first 10 TicketData
     * const ticketData = await prisma.ticketData.findMany({ take: 10 })
     * 
     * // Only select the `ticketKey`
     * const ticketDataWithTicketKeyOnly = await prisma.ticketData.findMany({ select: { ticketKey: true } })
     * 
     */
    findMany<T extends TicketDataFindManyArgs>(args?: SelectSubset<T, TicketDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TicketData.
     * @param {TicketDataCreateArgs} args - Arguments to create a TicketData.
     * @example
     * // Create one TicketData
     * const TicketData = await prisma.ticketData.create({
     *   data: {
     *     // ... data to create a TicketData
     *   }
     * })
     * 
     */
    create<T extends TicketDataCreateArgs>(args: SelectSubset<T, TicketDataCreateArgs<ExtArgs>>): Prisma__TicketDataClient<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TicketData.
     * @param {TicketDataCreateManyArgs} args - Arguments to create many TicketData.
     * @example
     * // Create many TicketData
     * const ticketData = await prisma.ticketData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketDataCreateManyArgs>(args?: SelectSubset<T, TicketDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TicketData and returns the data saved in the database.
     * @param {TicketDataCreateManyAndReturnArgs} args - Arguments to create many TicketData.
     * @example
     * // Create many TicketData
     * const ticketData = await prisma.ticketData.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TicketData and only return the `ticketKey`
     * const ticketDataWithTicketKeyOnly = await prisma.ticketData.createManyAndReturn({
     *   select: { ticketKey: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketDataCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketDataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TicketData.
     * @param {TicketDataDeleteArgs} args - Arguments to delete one TicketData.
     * @example
     * // Delete one TicketData
     * const TicketData = await prisma.ticketData.delete({
     *   where: {
     *     // ... filter to delete one TicketData
     *   }
     * })
     * 
     */
    delete<T extends TicketDataDeleteArgs>(args: SelectSubset<T, TicketDataDeleteArgs<ExtArgs>>): Prisma__TicketDataClient<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TicketData.
     * @param {TicketDataUpdateArgs} args - Arguments to update one TicketData.
     * @example
     * // Update one TicketData
     * const ticketData = await prisma.ticketData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketDataUpdateArgs>(args: SelectSubset<T, TicketDataUpdateArgs<ExtArgs>>): Prisma__TicketDataClient<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TicketData.
     * @param {TicketDataDeleteManyArgs} args - Arguments to filter TicketData to delete.
     * @example
     * // Delete a few TicketData
     * const { count } = await prisma.ticketData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketDataDeleteManyArgs>(args?: SelectSubset<T, TicketDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TicketData
     * const ticketData = await prisma.ticketData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketDataUpdateManyArgs>(args: SelectSubset<T, TicketDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketData and returns the data updated in the database.
     * @param {TicketDataUpdateManyAndReturnArgs} args - Arguments to update many TicketData.
     * @example
     * // Update many TicketData
     * const ticketData = await prisma.ticketData.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TicketData and only return the `ticketKey`
     * const ticketDataWithTicketKeyOnly = await prisma.ticketData.updateManyAndReturn({
     *   select: { ticketKey: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TicketDataUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketDataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TicketData.
     * @param {TicketDataUpsertArgs} args - Arguments to update or create a TicketData.
     * @example
     * // Update or create a TicketData
     * const ticketData = await prisma.ticketData.upsert({
     *   create: {
     *     // ... data to create a TicketData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TicketData we want to update
     *   }
     * })
     */
    upsert<T extends TicketDataUpsertArgs>(args: SelectSubset<T, TicketDataUpsertArgs<ExtArgs>>): Prisma__TicketDataClient<$Result.GetResult<Prisma.$TicketDataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TicketData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketDataCountArgs} args - Arguments to filter TicketData to count.
     * @example
     * // Count the number of TicketData
     * const count = await prisma.ticketData.count({
     *   where: {
     *     // ... the filter for the TicketData we want to count
     *   }
     * })
    **/
    count<T extends TicketDataCountArgs>(
      args?: Subset<T, TicketDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TicketData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TicketDataAggregateArgs>(args: Subset<T, TicketDataAggregateArgs>): Prisma.PrismaPromise<GetTicketDataAggregateType<T>>

    /**
     * Group by TicketData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TicketDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketDataGroupByArgs['orderBy'] }
        : { orderBy?: TicketDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TicketDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TicketData model
   */
  readonly fields: TicketDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TicketData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TicketData model
   */
  interface TicketDataFieldRefs {
    readonly ticketKey: FieldRef<"TicketData", 'String'>
    readonly status: FieldRef<"TicketData", 'String'>
    readonly action: FieldRef<"TicketData", 'String'>
    readonly updatedAt: FieldRef<"TicketData", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TicketData findUnique
   */
  export type TicketDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * Filter, which TicketData to fetch.
     */
    where: TicketDataWhereUniqueInput
  }

  /**
   * TicketData findUniqueOrThrow
   */
  export type TicketDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * Filter, which TicketData to fetch.
     */
    where: TicketDataWhereUniqueInput
  }

  /**
   * TicketData findFirst
   */
  export type TicketDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * Filter, which TicketData to fetch.
     */
    where?: TicketDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketData to fetch.
     */
    orderBy?: TicketDataOrderByWithRelationInput | TicketDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketData.
     */
    cursor?: TicketDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketData.
     */
    distinct?: TicketDataScalarFieldEnum | TicketDataScalarFieldEnum[]
  }

  /**
   * TicketData findFirstOrThrow
   */
  export type TicketDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * Filter, which TicketData to fetch.
     */
    where?: TicketDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketData to fetch.
     */
    orderBy?: TicketDataOrderByWithRelationInput | TicketDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketData.
     */
    cursor?: TicketDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketData.
     */
    distinct?: TicketDataScalarFieldEnum | TicketDataScalarFieldEnum[]
  }

  /**
   * TicketData findMany
   */
  export type TicketDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * Filter, which TicketData to fetch.
     */
    where?: TicketDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketData to fetch.
     */
    orderBy?: TicketDataOrderByWithRelationInput | TicketDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TicketData.
     */
    cursor?: TicketDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketData.
     */
    skip?: number
    distinct?: TicketDataScalarFieldEnum | TicketDataScalarFieldEnum[]
  }

  /**
   * TicketData create
   */
  export type TicketDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * The data needed to create a TicketData.
     */
    data: XOR<TicketDataCreateInput, TicketDataUncheckedCreateInput>
  }

  /**
   * TicketData createMany
   */
  export type TicketDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TicketData.
     */
    data: TicketDataCreateManyInput | TicketDataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TicketData createManyAndReturn
   */
  export type TicketDataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * The data used to create many TicketData.
     */
    data: TicketDataCreateManyInput | TicketDataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TicketData update
   */
  export type TicketDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * The data needed to update a TicketData.
     */
    data: XOR<TicketDataUpdateInput, TicketDataUncheckedUpdateInput>
    /**
     * Choose, which TicketData to update.
     */
    where: TicketDataWhereUniqueInput
  }

  /**
   * TicketData updateMany
   */
  export type TicketDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TicketData.
     */
    data: XOR<TicketDataUpdateManyMutationInput, TicketDataUncheckedUpdateManyInput>
    /**
     * Filter which TicketData to update
     */
    where?: TicketDataWhereInput
    /**
     * Limit how many TicketData to update.
     */
    limit?: number
  }

  /**
   * TicketData updateManyAndReturn
   */
  export type TicketDataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * The data used to update TicketData.
     */
    data: XOR<TicketDataUpdateManyMutationInput, TicketDataUncheckedUpdateManyInput>
    /**
     * Filter which TicketData to update
     */
    where?: TicketDataWhereInput
    /**
     * Limit how many TicketData to update.
     */
    limit?: number
  }

  /**
   * TicketData upsert
   */
  export type TicketDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * The filter to search for the TicketData to update in case it exists.
     */
    where: TicketDataWhereUniqueInput
    /**
     * In case the TicketData found by the `where` argument doesn't exist, create a new TicketData with this data.
     */
    create: XOR<TicketDataCreateInput, TicketDataUncheckedCreateInput>
    /**
     * In case the TicketData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketDataUpdateInput, TicketDataUncheckedUpdateInput>
  }

  /**
   * TicketData delete
   */
  export type TicketDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
    /**
     * Filter which TicketData to delete.
     */
    where: TicketDataWhereUniqueInput
  }

  /**
   * TicketData deleteMany
   */
  export type TicketDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketData to delete
     */
    where?: TicketDataWhereInput
    /**
     * Limit how many TicketData to delete.
     */
    limit?: number
  }

  /**
   * TicketData without action
   */
  export type TicketDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketData
     */
    select?: TicketDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketData
     */
    omit?: TicketDataOmit<ExtArgs> | null
  }


  /**
   * Model AppSetting
   */

  export type AggregateAppSetting = {
    _count: AppSettingCountAggregateOutputType | null
    _min: AppSettingMinAggregateOutputType | null
    _max: AppSettingMaxAggregateOutputType | null
  }

  export type AppSettingMinAggregateOutputType = {
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type AppSettingMaxAggregateOutputType = {
    key: string | null
    value: string | null
    updatedAt: Date | null
  }

  export type AppSettingCountAggregateOutputType = {
    key: number
    value: number
    updatedAt: number
    _all: number
  }


  export type AppSettingMinAggregateInputType = {
    key?: true
    value?: true
    updatedAt?: true
  }

  export type AppSettingMaxAggregateInputType = {
    key?: true
    value?: true
    updatedAt?: true
  }

  export type AppSettingCountAggregateInputType = {
    key?: true
    value?: true
    updatedAt?: true
    _all?: true
  }

  export type AppSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppSetting to aggregate.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AppSettings
    **/
    _count?: true | AppSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppSettingMaxAggregateInputType
  }

  export type GetAppSettingAggregateType<T extends AppSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateAppSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppSetting[P]>
      : GetScalarType<T[P], AggregateAppSetting[P]>
  }




  export type AppSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppSettingWhereInput
    orderBy?: AppSettingOrderByWithAggregationInput | AppSettingOrderByWithAggregationInput[]
    by: AppSettingScalarFieldEnum[] | AppSettingScalarFieldEnum
    having?: AppSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppSettingCountAggregateInputType | true
    _min?: AppSettingMinAggregateInputType
    _max?: AppSettingMaxAggregateInputType
  }

  export type AppSettingGroupByOutputType = {
    key: string
    value: string
    updatedAt: Date
    _count: AppSettingCountAggregateOutputType | null
    _min: AppSettingMinAggregateOutputType | null
    _max: AppSettingMaxAggregateOutputType | null
  }

  type GetAppSettingGroupByPayload<T extends AppSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppSettingGroupByOutputType[P]>
            : GetScalarType<T[P], AppSettingGroupByOutputType[P]>
        }
      >
    >


  export type AppSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["appSetting"]>

  export type AppSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["appSetting"]>

  export type AppSettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["appSetting"]>

  export type AppSettingSelectScalar = {
    key?: boolean
    value?: boolean
    updatedAt?: boolean
  }

  export type AppSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"key" | "value" | "updatedAt", ExtArgs["result"]["appSetting"]>

  export type $AppSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AppSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      key: string
      value: string
      updatedAt: Date
    }, ExtArgs["result"]["appSetting"]>
    composites: {}
  }

  type AppSettingGetPayload<S extends boolean | null | undefined | AppSettingDefaultArgs> = $Result.GetResult<Prisma.$AppSettingPayload, S>

  type AppSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppSettingCountAggregateInputType | true
    }

  export interface AppSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AppSetting'], meta: { name: 'AppSetting' } }
    /**
     * Find zero or one AppSetting that matches the filter.
     * @param {AppSettingFindUniqueArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppSettingFindUniqueArgs>(args: SelectSubset<T, AppSettingFindUniqueArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AppSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppSettingFindUniqueOrThrowArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, AppSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingFindFirstArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppSettingFindFirstArgs>(args?: SelectSubset<T, AppSettingFindFirstArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingFindFirstOrThrowArgs} args - Arguments to find a AppSetting
     * @example
     * // Get one AppSetting
     * const appSetting = await prisma.appSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, AppSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AppSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AppSettings
     * const appSettings = await prisma.appSetting.findMany()
     * 
     * // Get first 10 AppSettings
     * const appSettings = await prisma.appSetting.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const appSettingWithKeyOnly = await prisma.appSetting.findMany({ select: { key: true } })
     * 
     */
    findMany<T extends AppSettingFindManyArgs>(args?: SelectSubset<T, AppSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AppSetting.
     * @param {AppSettingCreateArgs} args - Arguments to create a AppSetting.
     * @example
     * // Create one AppSetting
     * const AppSetting = await prisma.appSetting.create({
     *   data: {
     *     // ... data to create a AppSetting
     *   }
     * })
     * 
     */
    create<T extends AppSettingCreateArgs>(args: SelectSubset<T, AppSettingCreateArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AppSettings.
     * @param {AppSettingCreateManyArgs} args - Arguments to create many AppSettings.
     * @example
     * // Create many AppSettings
     * const appSetting = await prisma.appSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppSettingCreateManyArgs>(args?: SelectSubset<T, AppSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AppSettings and returns the data saved in the database.
     * @param {AppSettingCreateManyAndReturnArgs} args - Arguments to create many AppSettings.
     * @example
     * // Create many AppSettings
     * const appSetting = await prisma.appSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AppSettings and only return the `key`
     * const appSettingWithKeyOnly = await prisma.appSetting.createManyAndReturn({
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, AppSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AppSetting.
     * @param {AppSettingDeleteArgs} args - Arguments to delete one AppSetting.
     * @example
     * // Delete one AppSetting
     * const AppSetting = await prisma.appSetting.delete({
     *   where: {
     *     // ... filter to delete one AppSetting
     *   }
     * })
     * 
     */
    delete<T extends AppSettingDeleteArgs>(args: SelectSubset<T, AppSettingDeleteArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AppSetting.
     * @param {AppSettingUpdateArgs} args - Arguments to update one AppSetting.
     * @example
     * // Update one AppSetting
     * const appSetting = await prisma.appSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppSettingUpdateArgs>(args: SelectSubset<T, AppSettingUpdateArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AppSettings.
     * @param {AppSettingDeleteManyArgs} args - Arguments to filter AppSettings to delete.
     * @example
     * // Delete a few AppSettings
     * const { count } = await prisma.appSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppSettingDeleteManyArgs>(args?: SelectSubset<T, AppSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AppSettings
     * const appSetting = await prisma.appSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppSettingUpdateManyArgs>(args: SelectSubset<T, AppSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppSettings and returns the data updated in the database.
     * @param {AppSettingUpdateManyAndReturnArgs} args - Arguments to update many AppSettings.
     * @example
     * // Update many AppSettings
     * const appSetting = await prisma.appSetting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AppSettings and only return the `key`
     * const appSettingWithKeyOnly = await prisma.appSetting.updateManyAndReturn({
     *   select: { key: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppSettingUpdateManyAndReturnArgs>(args: SelectSubset<T, AppSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AppSetting.
     * @param {AppSettingUpsertArgs} args - Arguments to update or create a AppSetting.
     * @example
     * // Update or create a AppSetting
     * const appSetting = await prisma.appSetting.upsert({
     *   create: {
     *     // ... data to create a AppSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AppSetting we want to update
     *   }
     * })
     */
    upsert<T extends AppSettingUpsertArgs>(args: SelectSubset<T, AppSettingUpsertArgs<ExtArgs>>): Prisma__AppSettingClient<$Result.GetResult<Prisma.$AppSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AppSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingCountArgs} args - Arguments to filter AppSettings to count.
     * @example
     * // Count the number of AppSettings
     * const count = await prisma.appSetting.count({
     *   where: {
     *     // ... the filter for the AppSettings we want to count
     *   }
     * })
    **/
    count<T extends AppSettingCountArgs>(
      args?: Subset<T, AppSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AppSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppSettingAggregateArgs>(args: Subset<T, AppSettingAggregateArgs>): Prisma.PrismaPromise<GetAppSettingAggregateType<T>>

    /**
     * Group by AppSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppSettingGroupByArgs['orderBy'] }
        : { orderBy?: AppSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AppSetting model
   */
  readonly fields: AppSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AppSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AppSetting model
   */
  interface AppSettingFieldRefs {
    readonly key: FieldRef<"AppSetting", 'String'>
    readonly value: FieldRef<"AppSetting", 'String'>
    readonly updatedAt: FieldRef<"AppSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AppSetting findUnique
   */
  export type AppSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting findUniqueOrThrow
   */
  export type AppSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting findFirst
   */
  export type AppSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppSettings.
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppSettings.
     */
    distinct?: AppSettingScalarFieldEnum | AppSettingScalarFieldEnum[]
  }

  /**
   * AppSetting findFirstOrThrow
   */
  export type AppSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSetting to fetch.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppSettings.
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppSettings.
     */
    distinct?: AppSettingScalarFieldEnum | AppSettingScalarFieldEnum[]
  }

  /**
   * AppSetting findMany
   */
  export type AppSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter, which AppSettings to fetch.
     */
    where?: AppSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppSettings to fetch.
     */
    orderBy?: AppSettingOrderByWithRelationInput | AppSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AppSettings.
     */
    cursor?: AppSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppSettings.
     */
    skip?: number
    distinct?: AppSettingScalarFieldEnum | AppSettingScalarFieldEnum[]
  }

  /**
   * AppSetting create
   */
  export type AppSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The data needed to create a AppSetting.
     */
    data: XOR<AppSettingCreateInput, AppSettingUncheckedCreateInput>
  }

  /**
   * AppSetting createMany
   */
  export type AppSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AppSettings.
     */
    data: AppSettingCreateManyInput | AppSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppSetting createManyAndReturn
   */
  export type AppSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The data used to create many AppSettings.
     */
    data: AppSettingCreateManyInput | AppSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppSetting update
   */
  export type AppSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The data needed to update a AppSetting.
     */
    data: XOR<AppSettingUpdateInput, AppSettingUncheckedUpdateInput>
    /**
     * Choose, which AppSetting to update.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting updateMany
   */
  export type AppSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AppSettings.
     */
    data: XOR<AppSettingUpdateManyMutationInput, AppSettingUncheckedUpdateManyInput>
    /**
     * Filter which AppSettings to update
     */
    where?: AppSettingWhereInput
    /**
     * Limit how many AppSettings to update.
     */
    limit?: number
  }

  /**
   * AppSetting updateManyAndReturn
   */
  export type AppSettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The data used to update AppSettings.
     */
    data: XOR<AppSettingUpdateManyMutationInput, AppSettingUncheckedUpdateManyInput>
    /**
     * Filter which AppSettings to update
     */
    where?: AppSettingWhereInput
    /**
     * Limit how many AppSettings to update.
     */
    limit?: number
  }

  /**
   * AppSetting upsert
   */
  export type AppSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * The filter to search for the AppSetting to update in case it exists.
     */
    where: AppSettingWhereUniqueInput
    /**
     * In case the AppSetting found by the `where` argument doesn't exist, create a new AppSetting with this data.
     */
    create: XOR<AppSettingCreateInput, AppSettingUncheckedCreateInput>
    /**
     * In case the AppSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppSettingUpdateInput, AppSettingUncheckedUpdateInput>
  }

  /**
   * AppSetting delete
   */
  export type AppSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
    /**
     * Filter which AppSetting to delete.
     */
    where: AppSettingWhereUniqueInput
  }

  /**
   * AppSetting deleteMany
   */
  export type AppSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppSettings to delete
     */
    where?: AppSettingWhereInput
    /**
     * Limit how many AppSettings to delete.
     */
    limit?: number
  }

  /**
   * AppSetting without action
   */
  export type AppSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppSetting
     */
    select?: AppSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppSetting
     */
    omit?: AppSettingOmit<ExtArgs> | null
  }


  /**
   * Model ScheduledComment
   */

  export type AggregateScheduledComment = {
    _count: ScheduledCommentCountAggregateOutputType | null
    _avg: ScheduledCommentAvgAggregateOutputType | null
    _sum: ScheduledCommentSumAggregateOutputType | null
    _min: ScheduledCommentMinAggregateOutputType | null
    _max: ScheduledCommentMaxAggregateOutputType | null
  }

  export type ScheduledCommentAvgAggregateOutputType = {
    id: number | null
  }

  export type ScheduledCommentSumAggregateOutputType = {
    id: number | null
  }

  export type ScheduledCommentMinAggregateOutputType = {
    id: number | null
    commentType: string | null
    ticketKey: string | null
    commentText: string | null
    cronSchedule: string | null
    enabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastPostedAt: Date | null
  }

  export type ScheduledCommentMaxAggregateOutputType = {
    id: number | null
    commentType: string | null
    ticketKey: string | null
    commentText: string | null
    cronSchedule: string | null
    enabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    lastPostedAt: Date | null
  }

  export type ScheduledCommentCountAggregateOutputType = {
    id: number
    commentType: number
    ticketKey: number
    commentText: number
    cronSchedule: number
    enabled: number
    createdAt: number
    updatedAt: number
    lastPostedAt: number
    _all: number
  }


  export type ScheduledCommentAvgAggregateInputType = {
    id?: true
  }

  export type ScheduledCommentSumAggregateInputType = {
    id?: true
  }

  export type ScheduledCommentMinAggregateInputType = {
    id?: true
    commentType?: true
    ticketKey?: true
    commentText?: true
    cronSchedule?: true
    enabled?: true
    createdAt?: true
    updatedAt?: true
    lastPostedAt?: true
  }

  export type ScheduledCommentMaxAggregateInputType = {
    id?: true
    commentType?: true
    ticketKey?: true
    commentText?: true
    cronSchedule?: true
    enabled?: true
    createdAt?: true
    updatedAt?: true
    lastPostedAt?: true
  }

  export type ScheduledCommentCountAggregateInputType = {
    id?: true
    commentType?: true
    ticketKey?: true
    commentText?: true
    cronSchedule?: true
    enabled?: true
    createdAt?: true
    updatedAt?: true
    lastPostedAt?: true
    _all?: true
  }

  export type ScheduledCommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScheduledComment to aggregate.
     */
    where?: ScheduledCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduledComments to fetch.
     */
    orderBy?: ScheduledCommentOrderByWithRelationInput | ScheduledCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScheduledCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduledComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduledComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScheduledComments
    **/
    _count?: true | ScheduledCommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScheduledCommentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScheduledCommentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScheduledCommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScheduledCommentMaxAggregateInputType
  }

  export type GetScheduledCommentAggregateType<T extends ScheduledCommentAggregateArgs> = {
        [P in keyof T & keyof AggregateScheduledComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScheduledComment[P]>
      : GetScalarType<T[P], AggregateScheduledComment[P]>
  }




  export type ScheduledCommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduledCommentWhereInput
    orderBy?: ScheduledCommentOrderByWithAggregationInput | ScheduledCommentOrderByWithAggregationInput[]
    by: ScheduledCommentScalarFieldEnum[] | ScheduledCommentScalarFieldEnum
    having?: ScheduledCommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScheduledCommentCountAggregateInputType | true
    _avg?: ScheduledCommentAvgAggregateInputType
    _sum?: ScheduledCommentSumAggregateInputType
    _min?: ScheduledCommentMinAggregateInputType
    _max?: ScheduledCommentMaxAggregateInputType
  }

  export type ScheduledCommentGroupByOutputType = {
    id: number
    commentType: string
    ticketKey: string | null
    commentText: string
    cronSchedule: string
    enabled: boolean
    createdAt: Date
    updatedAt: Date
    lastPostedAt: Date | null
    _count: ScheduledCommentCountAggregateOutputType | null
    _avg: ScheduledCommentAvgAggregateOutputType | null
    _sum: ScheduledCommentSumAggregateOutputType | null
    _min: ScheduledCommentMinAggregateOutputType | null
    _max: ScheduledCommentMaxAggregateOutputType | null
  }

  type GetScheduledCommentGroupByPayload<T extends ScheduledCommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScheduledCommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScheduledCommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScheduledCommentGroupByOutputType[P]>
            : GetScalarType<T[P], ScheduledCommentGroupByOutputType[P]>
        }
      >
    >


  export type ScheduledCommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commentType?: boolean
    ticketKey?: boolean
    commentText?: boolean
    cronSchedule?: boolean
    enabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastPostedAt?: boolean
  }, ExtArgs["result"]["scheduledComment"]>

  export type ScheduledCommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commentType?: boolean
    ticketKey?: boolean
    commentText?: boolean
    cronSchedule?: boolean
    enabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastPostedAt?: boolean
  }, ExtArgs["result"]["scheduledComment"]>

  export type ScheduledCommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    commentType?: boolean
    ticketKey?: boolean
    commentText?: boolean
    cronSchedule?: boolean
    enabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastPostedAt?: boolean
  }, ExtArgs["result"]["scheduledComment"]>

  export type ScheduledCommentSelectScalar = {
    id?: boolean
    commentType?: boolean
    ticketKey?: boolean
    commentText?: boolean
    cronSchedule?: boolean
    enabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastPostedAt?: boolean
  }

  export type ScheduledCommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "commentType" | "ticketKey" | "commentText" | "cronSchedule" | "enabled" | "createdAt" | "updatedAt" | "lastPostedAt", ExtArgs["result"]["scheduledComment"]>

  export type $ScheduledCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScheduledComment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      commentType: string
      ticketKey: string | null
      commentText: string
      cronSchedule: string
      enabled: boolean
      createdAt: Date
      updatedAt: Date
      lastPostedAt: Date | null
    }, ExtArgs["result"]["scheduledComment"]>
    composites: {}
  }

  type ScheduledCommentGetPayload<S extends boolean | null | undefined | ScheduledCommentDefaultArgs> = $Result.GetResult<Prisma.$ScheduledCommentPayload, S>

  type ScheduledCommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScheduledCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScheduledCommentCountAggregateInputType | true
    }

  export interface ScheduledCommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScheduledComment'], meta: { name: 'ScheduledComment' } }
    /**
     * Find zero or one ScheduledComment that matches the filter.
     * @param {ScheduledCommentFindUniqueArgs} args - Arguments to find a ScheduledComment
     * @example
     * // Get one ScheduledComment
     * const scheduledComment = await prisma.scheduledComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScheduledCommentFindUniqueArgs>(args: SelectSubset<T, ScheduledCommentFindUniqueArgs<ExtArgs>>): Prisma__ScheduledCommentClient<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScheduledComment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScheduledCommentFindUniqueOrThrowArgs} args - Arguments to find a ScheduledComment
     * @example
     * // Get one ScheduledComment
     * const scheduledComment = await prisma.scheduledComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScheduledCommentFindUniqueOrThrowArgs>(args: SelectSubset<T, ScheduledCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScheduledCommentClient<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScheduledComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledCommentFindFirstArgs} args - Arguments to find a ScheduledComment
     * @example
     * // Get one ScheduledComment
     * const scheduledComment = await prisma.scheduledComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScheduledCommentFindFirstArgs>(args?: SelectSubset<T, ScheduledCommentFindFirstArgs<ExtArgs>>): Prisma__ScheduledCommentClient<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScheduledComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledCommentFindFirstOrThrowArgs} args - Arguments to find a ScheduledComment
     * @example
     * // Get one ScheduledComment
     * const scheduledComment = await prisma.scheduledComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScheduledCommentFindFirstOrThrowArgs>(args?: SelectSubset<T, ScheduledCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScheduledCommentClient<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScheduledComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScheduledComments
     * const scheduledComments = await prisma.scheduledComment.findMany()
     * 
     * // Get first 10 ScheduledComments
     * const scheduledComments = await prisma.scheduledComment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scheduledCommentWithIdOnly = await prisma.scheduledComment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScheduledCommentFindManyArgs>(args?: SelectSubset<T, ScheduledCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScheduledComment.
     * @param {ScheduledCommentCreateArgs} args - Arguments to create a ScheduledComment.
     * @example
     * // Create one ScheduledComment
     * const ScheduledComment = await prisma.scheduledComment.create({
     *   data: {
     *     // ... data to create a ScheduledComment
     *   }
     * })
     * 
     */
    create<T extends ScheduledCommentCreateArgs>(args: SelectSubset<T, ScheduledCommentCreateArgs<ExtArgs>>): Prisma__ScheduledCommentClient<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScheduledComments.
     * @param {ScheduledCommentCreateManyArgs} args - Arguments to create many ScheduledComments.
     * @example
     * // Create many ScheduledComments
     * const scheduledComment = await prisma.scheduledComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScheduledCommentCreateManyArgs>(args?: SelectSubset<T, ScheduledCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScheduledComments and returns the data saved in the database.
     * @param {ScheduledCommentCreateManyAndReturnArgs} args - Arguments to create many ScheduledComments.
     * @example
     * // Create many ScheduledComments
     * const scheduledComment = await prisma.scheduledComment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScheduledComments and only return the `id`
     * const scheduledCommentWithIdOnly = await prisma.scheduledComment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScheduledCommentCreateManyAndReturnArgs>(args?: SelectSubset<T, ScheduledCommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScheduledComment.
     * @param {ScheduledCommentDeleteArgs} args - Arguments to delete one ScheduledComment.
     * @example
     * // Delete one ScheduledComment
     * const ScheduledComment = await prisma.scheduledComment.delete({
     *   where: {
     *     // ... filter to delete one ScheduledComment
     *   }
     * })
     * 
     */
    delete<T extends ScheduledCommentDeleteArgs>(args: SelectSubset<T, ScheduledCommentDeleteArgs<ExtArgs>>): Prisma__ScheduledCommentClient<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScheduledComment.
     * @param {ScheduledCommentUpdateArgs} args - Arguments to update one ScheduledComment.
     * @example
     * // Update one ScheduledComment
     * const scheduledComment = await prisma.scheduledComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScheduledCommentUpdateArgs>(args: SelectSubset<T, ScheduledCommentUpdateArgs<ExtArgs>>): Prisma__ScheduledCommentClient<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScheduledComments.
     * @param {ScheduledCommentDeleteManyArgs} args - Arguments to filter ScheduledComments to delete.
     * @example
     * // Delete a few ScheduledComments
     * const { count } = await prisma.scheduledComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScheduledCommentDeleteManyArgs>(args?: SelectSubset<T, ScheduledCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScheduledComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScheduledComments
     * const scheduledComment = await prisma.scheduledComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScheduledCommentUpdateManyArgs>(args: SelectSubset<T, ScheduledCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScheduledComments and returns the data updated in the database.
     * @param {ScheduledCommentUpdateManyAndReturnArgs} args - Arguments to update many ScheduledComments.
     * @example
     * // Update many ScheduledComments
     * const scheduledComment = await prisma.scheduledComment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScheduledComments and only return the `id`
     * const scheduledCommentWithIdOnly = await prisma.scheduledComment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ScheduledCommentUpdateManyAndReturnArgs>(args: SelectSubset<T, ScheduledCommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScheduledComment.
     * @param {ScheduledCommentUpsertArgs} args - Arguments to update or create a ScheduledComment.
     * @example
     * // Update or create a ScheduledComment
     * const scheduledComment = await prisma.scheduledComment.upsert({
     *   create: {
     *     // ... data to create a ScheduledComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScheduledComment we want to update
     *   }
     * })
     */
    upsert<T extends ScheduledCommentUpsertArgs>(args: SelectSubset<T, ScheduledCommentUpsertArgs<ExtArgs>>): Prisma__ScheduledCommentClient<$Result.GetResult<Prisma.$ScheduledCommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScheduledComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledCommentCountArgs} args - Arguments to filter ScheduledComments to count.
     * @example
     * // Count the number of ScheduledComments
     * const count = await prisma.scheduledComment.count({
     *   where: {
     *     // ... the filter for the ScheduledComments we want to count
     *   }
     * })
    **/
    count<T extends ScheduledCommentCountArgs>(
      args?: Subset<T, ScheduledCommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScheduledCommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScheduledComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScheduledCommentAggregateArgs>(args: Subset<T, ScheduledCommentAggregateArgs>): Prisma.PrismaPromise<GetScheduledCommentAggregateType<T>>

    /**
     * Group by ScheduledComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduledCommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScheduledCommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScheduledCommentGroupByArgs['orderBy'] }
        : { orderBy?: ScheduledCommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScheduledCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScheduledCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScheduledComment model
   */
  readonly fields: ScheduledCommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScheduledComment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScheduledCommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ScheduledComment model
   */
  interface ScheduledCommentFieldRefs {
    readonly id: FieldRef<"ScheduledComment", 'Int'>
    readonly commentType: FieldRef<"ScheduledComment", 'String'>
    readonly ticketKey: FieldRef<"ScheduledComment", 'String'>
    readonly commentText: FieldRef<"ScheduledComment", 'String'>
    readonly cronSchedule: FieldRef<"ScheduledComment", 'String'>
    readonly enabled: FieldRef<"ScheduledComment", 'Boolean'>
    readonly createdAt: FieldRef<"ScheduledComment", 'DateTime'>
    readonly updatedAt: FieldRef<"ScheduledComment", 'DateTime'>
    readonly lastPostedAt: FieldRef<"ScheduledComment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScheduledComment findUnique
   */
  export type ScheduledCommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledComment to fetch.
     */
    where: ScheduledCommentWhereUniqueInput
  }

  /**
   * ScheduledComment findUniqueOrThrow
   */
  export type ScheduledCommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledComment to fetch.
     */
    where: ScheduledCommentWhereUniqueInput
  }

  /**
   * ScheduledComment findFirst
   */
  export type ScheduledCommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledComment to fetch.
     */
    where?: ScheduledCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduledComments to fetch.
     */
    orderBy?: ScheduledCommentOrderByWithRelationInput | ScheduledCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScheduledComments.
     */
    cursor?: ScheduledCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduledComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduledComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScheduledComments.
     */
    distinct?: ScheduledCommentScalarFieldEnum | ScheduledCommentScalarFieldEnum[]
  }

  /**
   * ScheduledComment findFirstOrThrow
   */
  export type ScheduledCommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledComment to fetch.
     */
    where?: ScheduledCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduledComments to fetch.
     */
    orderBy?: ScheduledCommentOrderByWithRelationInput | ScheduledCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScheduledComments.
     */
    cursor?: ScheduledCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduledComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduledComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScheduledComments.
     */
    distinct?: ScheduledCommentScalarFieldEnum | ScheduledCommentScalarFieldEnum[]
  }

  /**
   * ScheduledComment findMany
   */
  export type ScheduledCommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * Filter, which ScheduledComments to fetch.
     */
    where?: ScheduledCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScheduledComments to fetch.
     */
    orderBy?: ScheduledCommentOrderByWithRelationInput | ScheduledCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScheduledComments.
     */
    cursor?: ScheduledCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScheduledComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScheduledComments.
     */
    skip?: number
    distinct?: ScheduledCommentScalarFieldEnum | ScheduledCommentScalarFieldEnum[]
  }

  /**
   * ScheduledComment create
   */
  export type ScheduledCommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * The data needed to create a ScheduledComment.
     */
    data: XOR<ScheduledCommentCreateInput, ScheduledCommentUncheckedCreateInput>
  }

  /**
   * ScheduledComment createMany
   */
  export type ScheduledCommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScheduledComments.
     */
    data: ScheduledCommentCreateManyInput | ScheduledCommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScheduledComment createManyAndReturn
   */
  export type ScheduledCommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * The data used to create many ScheduledComments.
     */
    data: ScheduledCommentCreateManyInput | ScheduledCommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScheduledComment update
   */
  export type ScheduledCommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * The data needed to update a ScheduledComment.
     */
    data: XOR<ScheduledCommentUpdateInput, ScheduledCommentUncheckedUpdateInput>
    /**
     * Choose, which ScheduledComment to update.
     */
    where: ScheduledCommentWhereUniqueInput
  }

  /**
   * ScheduledComment updateMany
   */
  export type ScheduledCommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScheduledComments.
     */
    data: XOR<ScheduledCommentUpdateManyMutationInput, ScheduledCommentUncheckedUpdateManyInput>
    /**
     * Filter which ScheduledComments to update
     */
    where?: ScheduledCommentWhereInput
    /**
     * Limit how many ScheduledComments to update.
     */
    limit?: number
  }

  /**
   * ScheduledComment updateManyAndReturn
   */
  export type ScheduledCommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * The data used to update ScheduledComments.
     */
    data: XOR<ScheduledCommentUpdateManyMutationInput, ScheduledCommentUncheckedUpdateManyInput>
    /**
     * Filter which ScheduledComments to update
     */
    where?: ScheduledCommentWhereInput
    /**
     * Limit how many ScheduledComments to update.
     */
    limit?: number
  }

  /**
   * ScheduledComment upsert
   */
  export type ScheduledCommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * The filter to search for the ScheduledComment to update in case it exists.
     */
    where: ScheduledCommentWhereUniqueInput
    /**
     * In case the ScheduledComment found by the `where` argument doesn't exist, create a new ScheduledComment with this data.
     */
    create: XOR<ScheduledCommentCreateInput, ScheduledCommentUncheckedCreateInput>
    /**
     * In case the ScheduledComment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScheduledCommentUpdateInput, ScheduledCommentUncheckedUpdateInput>
  }

  /**
   * ScheduledComment delete
   */
  export type ScheduledCommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
    /**
     * Filter which ScheduledComment to delete.
     */
    where: ScheduledCommentWhereUniqueInput
  }

  /**
   * ScheduledComment deleteMany
   */
  export type ScheduledCommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScheduledComments to delete
     */
    where?: ScheduledCommentWhereInput
    /**
     * Limit how many ScheduledComments to delete.
     */
    limit?: number
  }

  /**
   * ScheduledComment without action
   */
  export type ScheduledCommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduledComment
     */
    select?: ScheduledCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScheduledComment
     */
    omit?: ScheduledCommentOmit<ExtArgs> | null
  }


  /**
   * Model Backup
   */

  export type AggregateBackup = {
    _count: BackupCountAggregateOutputType | null
    _avg: BackupAvgAggregateOutputType | null
    _sum: BackupSumAggregateOutputType | null
    _min: BackupMinAggregateOutputType | null
    _max: BackupMaxAggregateOutputType | null
  }

  export type BackupAvgAggregateOutputType = {
    id: number | null
  }

  export type BackupSumAggregateOutputType = {
    id: number | null
  }

  export type BackupMinAggregateOutputType = {
    id: number | null
    backupType: string | null
    createdAt: Date | null
    description: string | null
  }

  export type BackupMaxAggregateOutputType = {
    id: number | null
    backupType: string | null
    createdAt: Date | null
    description: string | null
  }

  export type BackupCountAggregateOutputType = {
    id: number
    backupType: number
    ticketData: number
    appSettings: number
    scheduledComments: number
    createdAt: number
    description: number
    _all: number
  }


  export type BackupAvgAggregateInputType = {
    id?: true
  }

  export type BackupSumAggregateInputType = {
    id?: true
  }

  export type BackupMinAggregateInputType = {
    id?: true
    backupType?: true
    createdAt?: true
    description?: true
  }

  export type BackupMaxAggregateInputType = {
    id?: true
    backupType?: true
    createdAt?: true
    description?: true
  }

  export type BackupCountAggregateInputType = {
    id?: true
    backupType?: true
    ticketData?: true
    appSettings?: true
    scheduledComments?: true
    createdAt?: true
    description?: true
    _all?: true
  }

  export type BackupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Backup to aggregate.
     */
    where?: BackupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Backups to fetch.
     */
    orderBy?: BackupOrderByWithRelationInput | BackupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Backups
    **/
    _count?: true | BackupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BackupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BackupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackupMaxAggregateInputType
  }

  export type GetBackupAggregateType<T extends BackupAggregateArgs> = {
        [P in keyof T & keyof AggregateBackup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackup[P]>
      : GetScalarType<T[P], AggregateBackup[P]>
  }




  export type BackupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupWhereInput
    orderBy?: BackupOrderByWithAggregationInput | BackupOrderByWithAggregationInput[]
    by: BackupScalarFieldEnum[] | BackupScalarFieldEnum
    having?: BackupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackupCountAggregateInputType | true
    _avg?: BackupAvgAggregateInputType
    _sum?: BackupSumAggregateInputType
    _min?: BackupMinAggregateInputType
    _max?: BackupMaxAggregateInputType
  }

  export type BackupGroupByOutputType = {
    id: number
    backupType: string
    ticketData: JsonValue | null
    appSettings: JsonValue | null
    scheduledComments: JsonValue | null
    createdAt: Date
    description: string | null
    _count: BackupCountAggregateOutputType | null
    _avg: BackupAvgAggregateOutputType | null
    _sum: BackupSumAggregateOutputType | null
    _min: BackupMinAggregateOutputType | null
    _max: BackupMaxAggregateOutputType | null
  }

  type GetBackupGroupByPayload<T extends BackupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackupGroupByOutputType[P]>
            : GetScalarType<T[P], BackupGroupByOutputType[P]>
        }
      >
    >


  export type BackupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    backupType?: boolean
    ticketData?: boolean
    appSettings?: boolean
    scheduledComments?: boolean
    createdAt?: boolean
    description?: boolean
  }, ExtArgs["result"]["backup"]>

  export type BackupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    backupType?: boolean
    ticketData?: boolean
    appSettings?: boolean
    scheduledComments?: boolean
    createdAt?: boolean
    description?: boolean
  }, ExtArgs["result"]["backup"]>

  export type BackupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    backupType?: boolean
    ticketData?: boolean
    appSettings?: boolean
    scheduledComments?: boolean
    createdAt?: boolean
    description?: boolean
  }, ExtArgs["result"]["backup"]>

  export type BackupSelectScalar = {
    id?: boolean
    backupType?: boolean
    ticketData?: boolean
    appSettings?: boolean
    scheduledComments?: boolean
    createdAt?: boolean
    description?: boolean
  }

  export type BackupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "backupType" | "ticketData" | "appSettings" | "scheduledComments" | "createdAt" | "description", ExtArgs["result"]["backup"]>

  export type $BackupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Backup"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      backupType: string
      ticketData: Prisma.JsonValue | null
      appSettings: Prisma.JsonValue | null
      scheduledComments: Prisma.JsonValue | null
      createdAt: Date
      description: string | null
    }, ExtArgs["result"]["backup"]>
    composites: {}
  }

  type BackupGetPayload<S extends boolean | null | undefined | BackupDefaultArgs> = $Result.GetResult<Prisma.$BackupPayload, S>

  type BackupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BackupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BackupCountAggregateInputType | true
    }

  export interface BackupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Backup'], meta: { name: 'Backup' } }
    /**
     * Find zero or one Backup that matches the filter.
     * @param {BackupFindUniqueArgs} args - Arguments to find a Backup
     * @example
     * // Get one Backup
     * const backup = await prisma.backup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackupFindUniqueArgs>(args: SelectSubset<T, BackupFindUniqueArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Backup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BackupFindUniqueOrThrowArgs} args - Arguments to find a Backup
     * @example
     * // Get one Backup
     * const backup = await prisma.backup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackupFindUniqueOrThrowArgs>(args: SelectSubset<T, BackupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Backup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupFindFirstArgs} args - Arguments to find a Backup
     * @example
     * // Get one Backup
     * const backup = await prisma.backup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackupFindFirstArgs>(args?: SelectSubset<T, BackupFindFirstArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Backup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupFindFirstOrThrowArgs} args - Arguments to find a Backup
     * @example
     * // Get one Backup
     * const backup = await prisma.backup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackupFindFirstOrThrowArgs>(args?: SelectSubset<T, BackupFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Backups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Backups
     * const backups = await prisma.backup.findMany()
     * 
     * // Get first 10 Backups
     * const backups = await prisma.backup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const backupWithIdOnly = await prisma.backup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BackupFindManyArgs>(args?: SelectSubset<T, BackupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Backup.
     * @param {BackupCreateArgs} args - Arguments to create a Backup.
     * @example
     * // Create one Backup
     * const Backup = await prisma.backup.create({
     *   data: {
     *     // ... data to create a Backup
     *   }
     * })
     * 
     */
    create<T extends BackupCreateArgs>(args: SelectSubset<T, BackupCreateArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Backups.
     * @param {BackupCreateManyArgs} args - Arguments to create many Backups.
     * @example
     * // Create many Backups
     * const backup = await prisma.backup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackupCreateManyArgs>(args?: SelectSubset<T, BackupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Backups and returns the data saved in the database.
     * @param {BackupCreateManyAndReturnArgs} args - Arguments to create many Backups.
     * @example
     * // Create many Backups
     * const backup = await prisma.backup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Backups and only return the `id`
     * const backupWithIdOnly = await prisma.backup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BackupCreateManyAndReturnArgs>(args?: SelectSubset<T, BackupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Backup.
     * @param {BackupDeleteArgs} args - Arguments to delete one Backup.
     * @example
     * // Delete one Backup
     * const Backup = await prisma.backup.delete({
     *   where: {
     *     // ... filter to delete one Backup
     *   }
     * })
     * 
     */
    delete<T extends BackupDeleteArgs>(args: SelectSubset<T, BackupDeleteArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Backup.
     * @param {BackupUpdateArgs} args - Arguments to update one Backup.
     * @example
     * // Update one Backup
     * const backup = await prisma.backup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackupUpdateArgs>(args: SelectSubset<T, BackupUpdateArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Backups.
     * @param {BackupDeleteManyArgs} args - Arguments to filter Backups to delete.
     * @example
     * // Delete a few Backups
     * const { count } = await prisma.backup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackupDeleteManyArgs>(args?: SelectSubset<T, BackupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Backups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Backups
     * const backup = await prisma.backup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackupUpdateManyArgs>(args: SelectSubset<T, BackupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Backups and returns the data updated in the database.
     * @param {BackupUpdateManyAndReturnArgs} args - Arguments to update many Backups.
     * @example
     * // Update many Backups
     * const backup = await prisma.backup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Backups and only return the `id`
     * const backupWithIdOnly = await prisma.backup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BackupUpdateManyAndReturnArgs>(args: SelectSubset<T, BackupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Backup.
     * @param {BackupUpsertArgs} args - Arguments to update or create a Backup.
     * @example
     * // Update or create a Backup
     * const backup = await prisma.backup.upsert({
     *   create: {
     *     // ... data to create a Backup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Backup we want to update
     *   }
     * })
     */
    upsert<T extends BackupUpsertArgs>(args: SelectSubset<T, BackupUpsertArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Backups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCountArgs} args - Arguments to filter Backups to count.
     * @example
     * // Count the number of Backups
     * const count = await prisma.backup.count({
     *   where: {
     *     // ... the filter for the Backups we want to count
     *   }
     * })
    **/
    count<T extends BackupCountArgs>(
      args?: Subset<T, BackupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Backup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BackupAggregateArgs>(args: Subset<T, BackupAggregateArgs>): Prisma.PrismaPromise<GetBackupAggregateType<T>>

    /**
     * Group by Backup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BackupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackupGroupByArgs['orderBy'] }
        : { orderBy?: BackupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BackupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Backup model
   */
  readonly fields: BackupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Backup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Backup model
   */
  interface BackupFieldRefs {
    readonly id: FieldRef<"Backup", 'Int'>
    readonly backupType: FieldRef<"Backup", 'String'>
    readonly ticketData: FieldRef<"Backup", 'Json'>
    readonly appSettings: FieldRef<"Backup", 'Json'>
    readonly scheduledComments: FieldRef<"Backup", 'Json'>
    readonly createdAt: FieldRef<"Backup", 'DateTime'>
    readonly description: FieldRef<"Backup", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Backup findUnique
   */
  export type BackupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backup to fetch.
     */
    where: BackupWhereUniqueInput
  }

  /**
   * Backup findUniqueOrThrow
   */
  export type BackupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backup to fetch.
     */
    where: BackupWhereUniqueInput
  }

  /**
   * Backup findFirst
   */
  export type BackupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backup to fetch.
     */
    where?: BackupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Backups to fetch.
     */
    orderBy?: BackupOrderByWithRelationInput | BackupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Backups.
     */
    cursor?: BackupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Backups.
     */
    distinct?: BackupScalarFieldEnum | BackupScalarFieldEnum[]
  }

  /**
   * Backup findFirstOrThrow
   */
  export type BackupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backup to fetch.
     */
    where?: BackupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Backups to fetch.
     */
    orderBy?: BackupOrderByWithRelationInput | BackupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Backups.
     */
    cursor?: BackupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Backups.
     */
    distinct?: BackupScalarFieldEnum | BackupScalarFieldEnum[]
  }

  /**
   * Backup findMany
   */
  export type BackupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backups to fetch.
     */
    where?: BackupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Backups to fetch.
     */
    orderBy?: BackupOrderByWithRelationInput | BackupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Backups.
     */
    cursor?: BackupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Backups.
     */
    skip?: number
    distinct?: BackupScalarFieldEnum | BackupScalarFieldEnum[]
  }

  /**
   * Backup create
   */
  export type BackupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The data needed to create a Backup.
     */
    data?: XOR<BackupCreateInput, BackupUncheckedCreateInput>
  }

  /**
   * Backup createMany
   */
  export type BackupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Backups.
     */
    data: BackupCreateManyInput | BackupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Backup createManyAndReturn
   */
  export type BackupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The data used to create many Backups.
     */
    data: BackupCreateManyInput | BackupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Backup update
   */
  export type BackupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The data needed to update a Backup.
     */
    data: XOR<BackupUpdateInput, BackupUncheckedUpdateInput>
    /**
     * Choose, which Backup to update.
     */
    where: BackupWhereUniqueInput
  }

  /**
   * Backup updateMany
   */
  export type BackupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Backups.
     */
    data: XOR<BackupUpdateManyMutationInput, BackupUncheckedUpdateManyInput>
    /**
     * Filter which Backups to update
     */
    where?: BackupWhereInput
    /**
     * Limit how many Backups to update.
     */
    limit?: number
  }

  /**
   * Backup updateManyAndReturn
   */
  export type BackupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The data used to update Backups.
     */
    data: XOR<BackupUpdateManyMutationInput, BackupUncheckedUpdateManyInput>
    /**
     * Filter which Backups to update
     */
    where?: BackupWhereInput
    /**
     * Limit how many Backups to update.
     */
    limit?: number
  }

  /**
   * Backup upsert
   */
  export type BackupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The filter to search for the Backup to update in case it exists.
     */
    where: BackupWhereUniqueInput
    /**
     * In case the Backup found by the `where` argument doesn't exist, create a new Backup with this data.
     */
    create: XOR<BackupCreateInput, BackupUncheckedCreateInput>
    /**
     * In case the Backup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackupUpdateInput, BackupUncheckedUpdateInput>
  }

  /**
   * Backup delete
   */
  export type BackupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter which Backup to delete.
     */
    where: BackupWhereUniqueInput
  }

  /**
   * Backup deleteMany
   */
  export type BackupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Backups to delete
     */
    where?: BackupWhereInput
    /**
     * Limit how many Backups to delete.
     */
    limit?: number
  }

  /**
   * Backup without action
   */
  export type BackupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
  }


  /**
   * Model Feedback
   */

  export type AggregateFeedback = {
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  export type FeedbackAvgAggregateOutputType = {
    id: number | null
  }

  export type FeedbackSumAggregateOutputType = {
    id: number | null
  }

  export type FeedbackMinAggregateOutputType = {
    id: number | null
    type: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
    status: string | null
  }

  export type FeedbackMaxAggregateOutputType = {
    id: number | null
    type: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
    status: string | null
  }

  export type FeedbackCountAggregateOutputType = {
    id: number
    type: number
    title: number
    description: number
    createdAt: number
    status: number
    _all: number
  }


  export type FeedbackAvgAggregateInputType = {
    id?: true
  }

  export type FeedbackSumAggregateInputType = {
    id?: true
  }

  export type FeedbackMinAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    createdAt?: true
    status?: true
  }

  export type FeedbackMaxAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    createdAt?: true
    status?: true
  }

  export type FeedbackCountAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    createdAt?: true
    status?: true
    _all?: true
  }

  export type FeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedback to aggregate.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Feedbacks
    **/
    _count?: true | FeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FeedbackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FeedbackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeedbackMaxAggregateInputType
  }

  export type GetFeedbackAggregateType<T extends FeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeedback[P]>
      : GetScalarType<T[P], AggregateFeedback[P]>
  }




  export type FeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithAggregationInput | FeedbackOrderByWithAggregationInput[]
    by: FeedbackScalarFieldEnum[] | FeedbackScalarFieldEnum
    having?: FeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeedbackCountAggregateInputType | true
    _avg?: FeedbackAvgAggregateInputType
    _sum?: FeedbackSumAggregateInputType
    _min?: FeedbackMinAggregateInputType
    _max?: FeedbackMaxAggregateInputType
  }

  export type FeedbackGroupByOutputType = {
    id: number
    type: string
    title: string
    description: string
    createdAt: Date
    status: string
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  type GetFeedbackGroupByPayload<T extends FeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
        }
      >
    >


  export type FeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    status?: boolean
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    status?: boolean
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    status?: boolean
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectScalar = {
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    status?: boolean
  }

  export type FeedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "title" | "description" | "createdAt" | "status", ExtArgs["result"]["feedback"]>

  export type $FeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Feedback"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      type: string
      title: string
      description: string
      createdAt: Date
      status: string
    }, ExtArgs["result"]["feedback"]>
    composites: {}
  }

  type FeedbackGetPayload<S extends boolean | null | undefined | FeedbackDefaultArgs> = $Result.GetResult<Prisma.$FeedbackPayload, S>

  type FeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeedbackCountAggregateInputType | true
    }

  export interface FeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Feedback'], meta: { name: 'Feedback' } }
    /**
     * Find zero or one Feedback that matches the filter.
     * @param {FeedbackFindUniqueArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeedbackFindUniqueArgs>(args: SelectSubset<T, FeedbackFindUniqueArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FeedbackFindUniqueOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, FeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeedbackFindFirstArgs>(args?: SelectSubset<T, FeedbackFindFirstArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, FeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feedbacks
     * const feedbacks = await prisma.feedback.findMany()
     * 
     * // Get first 10 Feedbacks
     * const feedbacks = await prisma.feedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feedbackWithIdOnly = await prisma.feedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeedbackFindManyArgs>(args?: SelectSubset<T, FeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feedback.
     * @param {FeedbackCreateArgs} args - Arguments to create a Feedback.
     * @example
     * // Create one Feedback
     * const Feedback = await prisma.feedback.create({
     *   data: {
     *     // ... data to create a Feedback
     *   }
     * })
     * 
     */
    create<T extends FeedbackCreateArgs>(args: SelectSubset<T, FeedbackCreateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Feedbacks.
     * @param {FeedbackCreateManyArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeedbackCreateManyArgs>(args?: SelectSubset<T, FeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Feedbacks and returns the data saved in the database.
     * @param {FeedbackCreateManyAndReturnArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, FeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Feedback.
     * @param {FeedbackDeleteArgs} args - Arguments to delete one Feedback.
     * @example
     * // Delete one Feedback
     * const Feedback = await prisma.feedback.delete({
     *   where: {
     *     // ... filter to delete one Feedback
     *   }
     * })
     * 
     */
    delete<T extends FeedbackDeleteArgs>(args: SelectSubset<T, FeedbackDeleteArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feedback.
     * @param {FeedbackUpdateArgs} args - Arguments to update one Feedback.
     * @example
     * // Update one Feedback
     * const feedback = await prisma.feedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeedbackUpdateArgs>(args: SelectSubset<T, FeedbackUpdateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Feedbacks.
     * @param {FeedbackDeleteManyArgs} args - Arguments to filter Feedbacks to delete.
     * @example
     * // Delete a few Feedbacks
     * const { count } = await prisma.feedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeedbackDeleteManyArgs>(args?: SelectSubset<T, FeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeedbackUpdateManyArgs>(args: SelectSubset<T, FeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks and returns the data updated in the database.
     * @param {FeedbackUpdateManyAndReturnArgs} args - Arguments to update many Feedbacks.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FeedbackUpdateManyAndReturnArgs>(args: SelectSubset<T, FeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Feedback.
     * @param {FeedbackUpsertArgs} args - Arguments to update or create a Feedback.
     * @example
     * // Update or create a Feedback
     * const feedback = await prisma.feedback.upsert({
     *   create: {
     *     // ... data to create a Feedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feedback we want to update
     *   }
     * })
     */
    upsert<T extends FeedbackUpsertArgs>(args: SelectSubset<T, FeedbackUpsertArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackCountArgs} args - Arguments to filter Feedbacks to count.
     * @example
     * // Count the number of Feedbacks
     * const count = await prisma.feedback.count({
     *   where: {
     *     // ... the filter for the Feedbacks we want to count
     *   }
     * })
    **/
    count<T extends FeedbackCountArgs>(
      args?: Subset<T, FeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeedbackAggregateArgs>(args: Subset<T, FeedbackAggregateArgs>): Prisma.PrismaPromise<GetFeedbackAggregateType<T>>

    /**
     * Group by Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeedbackGroupByArgs['orderBy'] }
        : { orderBy?: FeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Feedback model
   */
  readonly fields: FeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Feedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Feedback model
   */
  interface FeedbackFieldRefs {
    readonly id: FieldRef<"Feedback", 'Int'>
    readonly type: FieldRef<"Feedback", 'String'>
    readonly title: FieldRef<"Feedback", 'String'>
    readonly description: FieldRef<"Feedback", 'String'>
    readonly createdAt: FieldRef<"Feedback", 'DateTime'>
    readonly status: FieldRef<"Feedback", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Feedback findUnique
   */
  export type FeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findUniqueOrThrow
   */
  export type FeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findFirst
   */
  export type FeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findFirstOrThrow
   */
  export type FeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findMany
   */
  export type FeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter, which Feedbacks to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback create
   */
  export type FeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data needed to create a Feedback.
     */
    data: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
  }

  /**
   * Feedback createMany
   */
  export type FeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feedback createManyAndReturn
   */
  export type FeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feedback update
   */
  export type FeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data needed to update a Feedback.
     */
    data: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
    /**
     * Choose, which Feedback to update.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback updateMany
   */
  export type FeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
  }

  /**
   * Feedback updateManyAndReturn
   */
  export type FeedbackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
  }

  /**
   * Feedback upsert
   */
  export type FeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The filter to search for the Feedback to update in case it exists.
     */
    where: FeedbackWhereUniqueInput
    /**
     * In case the Feedback found by the `where` argument doesn't exist, create a new Feedback with this data.
     */
    create: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
    /**
     * In case the Feedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
  }

  /**
   * Feedback delete
   */
  export type FeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Filter which Feedback to delete.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback deleteMany
   */
  export type FeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedbacks to delete
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to delete.
     */
    limit?: number
  }

  /**
   * Feedback without action
   */
  export type FeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TicketDataScalarFieldEnum: {
    ticketKey: 'ticketKey',
    status: 'status',
    action: 'action',
    updatedAt: 'updatedAt'
  };

  export type TicketDataScalarFieldEnum = (typeof TicketDataScalarFieldEnum)[keyof typeof TicketDataScalarFieldEnum]


  export const AppSettingScalarFieldEnum: {
    key: 'key',
    value: 'value',
    updatedAt: 'updatedAt'
  };

  export type AppSettingScalarFieldEnum = (typeof AppSettingScalarFieldEnum)[keyof typeof AppSettingScalarFieldEnum]


  export const ScheduledCommentScalarFieldEnum: {
    id: 'id',
    commentType: 'commentType',
    ticketKey: 'ticketKey',
    commentText: 'commentText',
    cronSchedule: 'cronSchedule',
    enabled: 'enabled',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastPostedAt: 'lastPostedAt'
  };

  export type ScheduledCommentScalarFieldEnum = (typeof ScheduledCommentScalarFieldEnum)[keyof typeof ScheduledCommentScalarFieldEnum]


  export const BackupScalarFieldEnum: {
    id: 'id',
    backupType: 'backupType',
    ticketData: 'ticketData',
    appSettings: 'appSettings',
    scheduledComments: 'scheduledComments',
    createdAt: 'createdAt',
    description: 'description'
  };

  export type BackupScalarFieldEnum = (typeof BackupScalarFieldEnum)[keyof typeof BackupScalarFieldEnum]


  export const FeedbackScalarFieldEnum: {
    id: 'id',
    type: 'type',
    title: 'title',
    description: 'description',
    createdAt: 'createdAt',
    status: 'status'
  };

  export type FeedbackScalarFieldEnum = (typeof FeedbackScalarFieldEnum)[keyof typeof FeedbackScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TicketDataWhereInput = {
    AND?: TicketDataWhereInput | TicketDataWhereInput[]
    OR?: TicketDataWhereInput[]
    NOT?: TicketDataWhereInput | TicketDataWhereInput[]
    ticketKey?: StringFilter<"TicketData"> | string
    status?: StringFilter<"TicketData"> | string
    action?: StringFilter<"TicketData"> | string
    updatedAt?: DateTimeFilter<"TicketData"> | Date | string
  }

  export type TicketDataOrderByWithRelationInput = {
    ticketKey?: SortOrder
    status?: SortOrder
    action?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketDataWhereUniqueInput = Prisma.AtLeast<{
    ticketKey?: string
    AND?: TicketDataWhereInput | TicketDataWhereInput[]
    OR?: TicketDataWhereInput[]
    NOT?: TicketDataWhereInput | TicketDataWhereInput[]
    status?: StringFilter<"TicketData"> | string
    action?: StringFilter<"TicketData"> | string
    updatedAt?: DateTimeFilter<"TicketData"> | Date | string
  }, "ticketKey">

  export type TicketDataOrderByWithAggregationInput = {
    ticketKey?: SortOrder
    status?: SortOrder
    action?: SortOrder
    updatedAt?: SortOrder
    _count?: TicketDataCountOrderByAggregateInput
    _max?: TicketDataMaxOrderByAggregateInput
    _min?: TicketDataMinOrderByAggregateInput
  }

  export type TicketDataScalarWhereWithAggregatesInput = {
    AND?: TicketDataScalarWhereWithAggregatesInput | TicketDataScalarWhereWithAggregatesInput[]
    OR?: TicketDataScalarWhereWithAggregatesInput[]
    NOT?: TicketDataScalarWhereWithAggregatesInput | TicketDataScalarWhereWithAggregatesInput[]
    ticketKey?: StringWithAggregatesFilter<"TicketData"> | string
    status?: StringWithAggregatesFilter<"TicketData"> | string
    action?: StringWithAggregatesFilter<"TicketData"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"TicketData"> | Date | string
  }

  export type AppSettingWhereInput = {
    AND?: AppSettingWhereInput | AppSettingWhereInput[]
    OR?: AppSettingWhereInput[]
    NOT?: AppSettingWhereInput | AppSettingWhereInput[]
    key?: StringFilter<"AppSetting"> | string
    value?: StringFilter<"AppSetting"> | string
    updatedAt?: DateTimeFilter<"AppSetting"> | Date | string
  }

  export type AppSettingOrderByWithRelationInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppSettingWhereUniqueInput = Prisma.AtLeast<{
    key?: string
    AND?: AppSettingWhereInput | AppSettingWhereInput[]
    OR?: AppSettingWhereInput[]
    NOT?: AppSettingWhereInput | AppSettingWhereInput[]
    value?: StringFilter<"AppSetting"> | string
    updatedAt?: DateTimeFilter<"AppSetting"> | Date | string
  }, "key">

  export type AppSettingOrderByWithAggregationInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
    _count?: AppSettingCountOrderByAggregateInput
    _max?: AppSettingMaxOrderByAggregateInput
    _min?: AppSettingMinOrderByAggregateInput
  }

  export type AppSettingScalarWhereWithAggregatesInput = {
    AND?: AppSettingScalarWhereWithAggregatesInput | AppSettingScalarWhereWithAggregatesInput[]
    OR?: AppSettingScalarWhereWithAggregatesInput[]
    NOT?: AppSettingScalarWhereWithAggregatesInput | AppSettingScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<"AppSetting"> | string
    value?: StringWithAggregatesFilter<"AppSetting"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"AppSetting"> | Date | string
  }

  export type ScheduledCommentWhereInput = {
    AND?: ScheduledCommentWhereInput | ScheduledCommentWhereInput[]
    OR?: ScheduledCommentWhereInput[]
    NOT?: ScheduledCommentWhereInput | ScheduledCommentWhereInput[]
    id?: IntFilter<"ScheduledComment"> | number
    commentType?: StringFilter<"ScheduledComment"> | string
    ticketKey?: StringNullableFilter<"ScheduledComment"> | string | null
    commentText?: StringFilter<"ScheduledComment"> | string
    cronSchedule?: StringFilter<"ScheduledComment"> | string
    enabled?: BoolFilter<"ScheduledComment"> | boolean
    createdAt?: DateTimeFilter<"ScheduledComment"> | Date | string
    updatedAt?: DateTimeFilter<"ScheduledComment"> | Date | string
    lastPostedAt?: DateTimeNullableFilter<"ScheduledComment"> | Date | string | null
  }

  export type ScheduledCommentOrderByWithRelationInput = {
    id?: SortOrder
    commentType?: SortOrder
    ticketKey?: SortOrderInput | SortOrder
    commentText?: SortOrder
    cronSchedule?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastPostedAt?: SortOrderInput | SortOrder
  }

  export type ScheduledCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ScheduledCommentWhereInput | ScheduledCommentWhereInput[]
    OR?: ScheduledCommentWhereInput[]
    NOT?: ScheduledCommentWhereInput | ScheduledCommentWhereInput[]
    commentType?: StringFilter<"ScheduledComment"> | string
    ticketKey?: StringNullableFilter<"ScheduledComment"> | string | null
    commentText?: StringFilter<"ScheduledComment"> | string
    cronSchedule?: StringFilter<"ScheduledComment"> | string
    enabled?: BoolFilter<"ScheduledComment"> | boolean
    createdAt?: DateTimeFilter<"ScheduledComment"> | Date | string
    updatedAt?: DateTimeFilter<"ScheduledComment"> | Date | string
    lastPostedAt?: DateTimeNullableFilter<"ScheduledComment"> | Date | string | null
  }, "id">

  export type ScheduledCommentOrderByWithAggregationInput = {
    id?: SortOrder
    commentType?: SortOrder
    ticketKey?: SortOrderInput | SortOrder
    commentText?: SortOrder
    cronSchedule?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastPostedAt?: SortOrderInput | SortOrder
    _count?: ScheduledCommentCountOrderByAggregateInput
    _avg?: ScheduledCommentAvgOrderByAggregateInput
    _max?: ScheduledCommentMaxOrderByAggregateInput
    _min?: ScheduledCommentMinOrderByAggregateInput
    _sum?: ScheduledCommentSumOrderByAggregateInput
  }

  export type ScheduledCommentScalarWhereWithAggregatesInput = {
    AND?: ScheduledCommentScalarWhereWithAggregatesInput | ScheduledCommentScalarWhereWithAggregatesInput[]
    OR?: ScheduledCommentScalarWhereWithAggregatesInput[]
    NOT?: ScheduledCommentScalarWhereWithAggregatesInput | ScheduledCommentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ScheduledComment"> | number
    commentType?: StringWithAggregatesFilter<"ScheduledComment"> | string
    ticketKey?: StringNullableWithAggregatesFilter<"ScheduledComment"> | string | null
    commentText?: StringWithAggregatesFilter<"ScheduledComment"> | string
    cronSchedule?: StringWithAggregatesFilter<"ScheduledComment"> | string
    enabled?: BoolWithAggregatesFilter<"ScheduledComment"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ScheduledComment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ScheduledComment"> | Date | string
    lastPostedAt?: DateTimeNullableWithAggregatesFilter<"ScheduledComment"> | Date | string | null
  }

  export type BackupWhereInput = {
    AND?: BackupWhereInput | BackupWhereInput[]
    OR?: BackupWhereInput[]
    NOT?: BackupWhereInput | BackupWhereInput[]
    id?: IntFilter<"Backup"> | number
    backupType?: StringFilter<"Backup"> | string
    ticketData?: JsonNullableFilter<"Backup">
    appSettings?: JsonNullableFilter<"Backup">
    scheduledComments?: JsonNullableFilter<"Backup">
    createdAt?: DateTimeFilter<"Backup"> | Date | string
    description?: StringNullableFilter<"Backup"> | string | null
  }

  export type BackupOrderByWithRelationInput = {
    id?: SortOrder
    backupType?: SortOrder
    ticketData?: SortOrderInput | SortOrder
    appSettings?: SortOrderInput | SortOrder
    scheduledComments?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    description?: SortOrderInput | SortOrder
  }

  export type BackupWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BackupWhereInput | BackupWhereInput[]
    OR?: BackupWhereInput[]
    NOT?: BackupWhereInput | BackupWhereInput[]
    backupType?: StringFilter<"Backup"> | string
    ticketData?: JsonNullableFilter<"Backup">
    appSettings?: JsonNullableFilter<"Backup">
    scheduledComments?: JsonNullableFilter<"Backup">
    createdAt?: DateTimeFilter<"Backup"> | Date | string
    description?: StringNullableFilter<"Backup"> | string | null
  }, "id">

  export type BackupOrderByWithAggregationInput = {
    id?: SortOrder
    backupType?: SortOrder
    ticketData?: SortOrderInput | SortOrder
    appSettings?: SortOrderInput | SortOrder
    scheduledComments?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: BackupCountOrderByAggregateInput
    _avg?: BackupAvgOrderByAggregateInput
    _max?: BackupMaxOrderByAggregateInput
    _min?: BackupMinOrderByAggregateInput
    _sum?: BackupSumOrderByAggregateInput
  }

  export type BackupScalarWhereWithAggregatesInput = {
    AND?: BackupScalarWhereWithAggregatesInput | BackupScalarWhereWithAggregatesInput[]
    OR?: BackupScalarWhereWithAggregatesInput[]
    NOT?: BackupScalarWhereWithAggregatesInput | BackupScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Backup"> | number
    backupType?: StringWithAggregatesFilter<"Backup"> | string
    ticketData?: JsonNullableWithAggregatesFilter<"Backup">
    appSettings?: JsonNullableWithAggregatesFilter<"Backup">
    scheduledComments?: JsonNullableWithAggregatesFilter<"Backup">
    createdAt?: DateTimeWithAggregatesFilter<"Backup"> | Date | string
    description?: StringNullableWithAggregatesFilter<"Backup"> | string | null
  }

  export type FeedbackWhereInput = {
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    id?: IntFilter<"Feedback"> | number
    type?: StringFilter<"Feedback"> | string
    title?: StringFilter<"Feedback"> | string
    description?: StringFilter<"Feedback"> | string
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    status?: StringFilter<"Feedback"> | string
  }

  export type FeedbackOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type FeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    type?: StringFilter<"Feedback"> | string
    title?: StringFilter<"Feedback"> | string
    description?: StringFilter<"Feedback"> | string
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    status?: StringFilter<"Feedback"> | string
  }, "id">

  export type FeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    _count?: FeedbackCountOrderByAggregateInput
    _avg?: FeedbackAvgOrderByAggregateInput
    _max?: FeedbackMaxOrderByAggregateInput
    _min?: FeedbackMinOrderByAggregateInput
    _sum?: FeedbackSumOrderByAggregateInput
  }

  export type FeedbackScalarWhereWithAggregatesInput = {
    AND?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    OR?: FeedbackScalarWhereWithAggregatesInput[]
    NOT?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Feedback"> | number
    type?: StringWithAggregatesFilter<"Feedback"> | string
    title?: StringWithAggregatesFilter<"Feedback"> | string
    description?: StringWithAggregatesFilter<"Feedback"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
    status?: StringWithAggregatesFilter<"Feedback"> | string
  }

  export type TicketDataCreateInput = {
    ticketKey: string
    status?: string
    action?: string
    updatedAt?: Date | string
  }

  export type TicketDataUncheckedCreateInput = {
    ticketKey: string
    status?: string
    action?: string
    updatedAt?: Date | string
  }

  export type TicketDataUpdateInput = {
    ticketKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketDataUncheckedUpdateInput = {
    ticketKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketDataCreateManyInput = {
    ticketKey: string
    status?: string
    action?: string
    updatedAt?: Date | string
  }

  export type TicketDataUpdateManyMutationInput = {
    ticketKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketDataUncheckedUpdateManyInput = {
    ticketKey?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingCreateInput = {
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type AppSettingUncheckedCreateInput = {
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type AppSettingUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingCreateManyInput = {
    key: string
    value: string
    updatedAt?: Date | string
  }

  export type AppSettingUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppSettingUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduledCommentCreateInput = {
    commentType?: string
    ticketKey?: string | null
    commentText: string
    cronSchedule: string
    enabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastPostedAt?: Date | string | null
  }

  export type ScheduledCommentUncheckedCreateInput = {
    id?: number
    commentType?: string
    ticketKey?: string | null
    commentText: string
    cronSchedule: string
    enabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastPostedAt?: Date | string | null
  }

  export type ScheduledCommentUpdateInput = {
    commentType?: StringFieldUpdateOperationsInput | string
    ticketKey?: NullableStringFieldUpdateOperationsInput | string | null
    commentText?: StringFieldUpdateOperationsInput | string
    cronSchedule?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScheduledCommentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    commentType?: StringFieldUpdateOperationsInput | string
    ticketKey?: NullableStringFieldUpdateOperationsInput | string | null
    commentText?: StringFieldUpdateOperationsInput | string
    cronSchedule?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScheduledCommentCreateManyInput = {
    id?: number
    commentType?: string
    ticketKey?: string | null
    commentText: string
    cronSchedule: string
    enabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    lastPostedAt?: Date | string | null
  }

  export type ScheduledCommentUpdateManyMutationInput = {
    commentType?: StringFieldUpdateOperationsInput | string
    ticketKey?: NullableStringFieldUpdateOperationsInput | string | null
    commentText?: StringFieldUpdateOperationsInput | string
    cronSchedule?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ScheduledCommentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    commentType?: StringFieldUpdateOperationsInput | string
    ticketKey?: NullableStringFieldUpdateOperationsInput | string | null
    commentText?: StringFieldUpdateOperationsInput | string
    cronSchedule?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastPostedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BackupCreateInput = {
    backupType?: string
    ticketData?: NullableJsonNullValueInput | InputJsonValue
    appSettings?: NullableJsonNullValueInput | InputJsonValue
    scheduledComments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    description?: string | null
  }

  export type BackupUncheckedCreateInput = {
    id?: number
    backupType?: string
    ticketData?: NullableJsonNullValueInput | InputJsonValue
    appSettings?: NullableJsonNullValueInput | InputJsonValue
    scheduledComments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    description?: string | null
  }

  export type BackupUpdateInput = {
    backupType?: StringFieldUpdateOperationsInput | string
    ticketData?: NullableJsonNullValueInput | InputJsonValue
    appSettings?: NullableJsonNullValueInput | InputJsonValue
    scheduledComments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BackupUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    backupType?: StringFieldUpdateOperationsInput | string
    ticketData?: NullableJsonNullValueInput | InputJsonValue
    appSettings?: NullableJsonNullValueInput | InputJsonValue
    scheduledComments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BackupCreateManyInput = {
    id?: number
    backupType?: string
    ticketData?: NullableJsonNullValueInput | InputJsonValue
    appSettings?: NullableJsonNullValueInput | InputJsonValue
    scheduledComments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    description?: string | null
  }

  export type BackupUpdateManyMutationInput = {
    backupType?: StringFieldUpdateOperationsInput | string
    ticketData?: NullableJsonNullValueInput | InputJsonValue
    appSettings?: NullableJsonNullValueInput | InputJsonValue
    scheduledComments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BackupUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    backupType?: StringFieldUpdateOperationsInput | string
    ticketData?: NullableJsonNullValueInput | InputJsonValue
    appSettings?: NullableJsonNullValueInput | InputJsonValue
    scheduledComments?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FeedbackCreateInput = {
    type: string
    title: string
    description: string
    createdAt?: Date | string
    status?: string
  }

  export type FeedbackUncheckedCreateInput = {
    id?: number
    type: string
    title: string
    description: string
    createdAt?: Date | string
    status?: string
  }

  export type FeedbackUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type FeedbackUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type FeedbackCreateManyInput = {
    id?: number
    type: string
    title: string
    description: string
    createdAt?: Date | string
    status?: string
  }

  export type FeedbackUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type FeedbackUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TicketDataCountOrderByAggregateInput = {
    ticketKey?: SortOrder
    status?: SortOrder
    action?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketDataMaxOrderByAggregateInput = {
    ticketKey?: SortOrder
    status?: SortOrder
    action?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketDataMinOrderByAggregateInput = {
    ticketKey?: SortOrder
    status?: SortOrder
    action?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AppSettingCountOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppSettingMaxOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppSettingMinOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ScheduledCommentCountOrderByAggregateInput = {
    id?: SortOrder
    commentType?: SortOrder
    ticketKey?: SortOrder
    commentText?: SortOrder
    cronSchedule?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastPostedAt?: SortOrder
  }

  export type ScheduledCommentAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ScheduledCommentMaxOrderByAggregateInput = {
    id?: SortOrder
    commentType?: SortOrder
    ticketKey?: SortOrder
    commentText?: SortOrder
    cronSchedule?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastPostedAt?: SortOrder
  }

  export type ScheduledCommentMinOrderByAggregateInput = {
    id?: SortOrder
    commentType?: SortOrder
    ticketKey?: SortOrder
    commentText?: SortOrder
    cronSchedule?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastPostedAt?: SortOrder
  }

  export type ScheduledCommentSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BackupCountOrderByAggregateInput = {
    id?: SortOrder
    backupType?: SortOrder
    ticketData?: SortOrder
    appSettings?: SortOrder
    scheduledComments?: SortOrder
    createdAt?: SortOrder
    description?: SortOrder
  }

  export type BackupAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BackupMaxOrderByAggregateInput = {
    id?: SortOrder
    backupType?: SortOrder
    createdAt?: SortOrder
    description?: SortOrder
  }

  export type BackupMinOrderByAggregateInput = {
    id?: SortOrder
    backupType?: SortOrder
    createdAt?: SortOrder
    description?: SortOrder
  }

  export type BackupSumOrderByAggregateInput = {
    id?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type FeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type FeedbackAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type FeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type FeedbackSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}