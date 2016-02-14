'use babel'

/* @flow */

import {Emitter, CompositeDisposable} from 'atom'
import {Intention$Highlight} from './types'
import type {Disposable, TextEditor} from 'atom'
import type {Declaration} from './types'

type Intentions$Highlight = {textEditor: TextEditor, visibleRange: Range}

export class ProviderHighlight {
  emitter: Emitter;
  subscriptions: CompositeDisposable;
  grammarScopes: Array<string>;

  constructor() {
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()
    this.grammarScopes = ['*']

    this.subscriptions.add(this.emitter)
  }
  async getIntentions({textEditor, visibleRange}: Intentions$Highlight): Promise<Array<Intention$Highlight>> {
    const results = await this.requestDeclarations({textEditor, visibleRange})
    console.log('declarations', results)
    return []
  }
  async requestDeclarations({textEditor, visibleRange}: Intentions$Highlight): Promise<Array<Declaration>> {
    const event = {promise: Promise.resolve([]), parameters: {textEditor, visibleRange}}
    this.emitter.emit('should-provide-declarations', event)
    return await event.promise
  }
  onShouldProvideDeclarations(callback: Function): Disposable {
    return this.emitter.on('should-provide-declarations', callback)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}