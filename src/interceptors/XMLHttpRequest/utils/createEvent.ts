import { EventPolyfill } from '../polyfills/EventPolyfill'
import { ProgressEventPolyfill } from '../polyfills/ProgressEventPolyfill'

const SUPPORTS_PROGRESS_EVENT = typeof ProgressEvent !== 'undefined'

export function createEvent<EventTargetType extends EventTarget>(
  target: EventTargetType,
  type: string,
  init?: ProgressEventInit
): EventPolyfill<EventTargetType> {
  const progressEvents = [
    'error',
    'progress',
    'loadstart',
    'loadend',
    'load',
    'timeout',
    'abort',
  ]

  /**
   * `ProgressEvent` is not supported in React Native.
   * @see https://github.com/mswjs/interceptors/issues/40
   */
  const ProgressEventClass = SUPPORTS_PROGRESS_EVENT
    ? ProgressEvent
    : ProgressEventPolyfill

  const event = progressEvents.includes(type)
    ? new ProgressEventClass(type, {
        lengthComputable: true,
        loaded: init?.loaded || 0,
        total: init?.total || 0,
      })
    : new EventPolyfill<EventTargetType>(type, {
        target,
        currentTarget: target,
      })

  return event
}
