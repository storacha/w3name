import type { Queue } from '../../src/queue-types'

export class MockQueue implements Queue {
  messages: any[] = []

  async send (msg: any) {
    this.messages.push(msg)
  }
}
