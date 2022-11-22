/**
 * A dirty workaround for the fact that @cloudflare/worker-types hasn't yet released a version that
 * contains the Queues types. So in order to have code which will at least compile locally and will
 * work on production, we define these classes (again) here. This means that locally we get the
 * types, and in production we will have overridden the types, but hopefully so long as they have
 * the same properties and types as the CF ones, once in JS it won't matter and it will still work.
 * Once https://www.npmjs.com/package/@cloudflare/workers-types does a new release which includes
 * https://github.com/cloudflare/workerd/commit/401e7d60d0d40d820279258553b9cb07f67a66a3
 * we should be able to just update that package and delete this.
 */

/* eslint-disable
  @typescript-eslint/member-delimiter-style,
  @typescript-eslint/array-type,
  @typescript-eslint/method-signature-style,
  jsdoc/newline-after-description,
  jsdoc/require-hyphen-before-param-description
*/

/**
 * A message that is sent to a consumer Worker.
 */
export interface Message<Body = unknown> {
  /**
   * A unique, system-generated ID for the message.
   */
  readonly id: string;
  /**
   * A timestamp when the message was sent.
   */
  readonly timestamp: Date;
  /**
   * The body of the message.
   */
  readonly body: Body;
}

/**
 * A batch of messages that are sent to a consumer Worker.
 */
export interface MessageBatch<Body = unknown> {
  /**
   * The name of the Queue that belongs to this batch.
   */
  readonly queue: string;
  /**
   * An array of messages in the batch. Ordering of messages is not guaranteed.
   */
  readonly messages: readonly Message<Body>[];
  /**
   * Marks every message to be retried in the next batch.
   */
  retryAll(): void;
}

/**
 * A binding that allows a producer to send messages to a Queue.
 */
export interface Queue<Body = any> {
  /**
   * Sends a message to the Queue.
   * @param message The message can be any type supported by the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types), as long as its size is less than 128 KB.
   * @returns A promise that resolves when the message is confirmed to be written to disk.
   */
  send(message: Body): Promise<void>;
}
