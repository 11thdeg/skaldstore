import { Timestamp } from 'firebase/firestore'
import { Subscriber } from '../Subscriber'

function createSubscriber(): Subscriber {
  const subscriber = new Subscriber('a_key')
  return subscriber
}

describe('Subscriber', () => {
  it('Should have a collection name', () => {
    expect(Subscriber.collectionName).toBe('subscriptions')
  })
  it('Should provide a key', () => {
    const subscriber = createSubscriber()
    expect(subscriber.key).toBe('a_key')
  })
  it('Should throw an error if no key is provided', () => {
    expect(() => new Subscriber('')).toThrowError('A key is required to construct a Subscriber')
  })
  it('Should hydrate from a plain object', () => {
    const subscriber = createSubscriber()
    const ts1 = new Timestamp(0, 1)
    const ts2 = new Timestamp(0, 2)
    subscriber.docData = {
      uid: 'a_key',
      seenEntities: {
        '123': ts1,
        '456': ts2
      }
    }
    const data = subscriber.docData
    expect(data.uid).toBe('a_key')
    expect(data.seenEntities['123']).toEqual(ts1)
    expect(data.seenEntities['456']).toEqual(ts2)
  })
})
