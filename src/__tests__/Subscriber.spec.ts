import { Timestamp } from "firebase/firestore"
import { Subscriber } from "../Subscriber"

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
    const ts1 = new Timestamp(0,1)
    const ts2 = new Timestamp(0,2)
    subscriber.docData = {
      uid: 'a_key',
      watched: {
        '123': ts1,
        '456': ts2
      },
      muted: ['789']
    }
    const data = subscriber.docData
    expect(data.uid).toBe('a_key')
    expect(data.watched['123']).toEqual(ts1)
    expect(data.watched['456']).toEqual(ts2)
    expect(data.muted).toEqual(['789'])
  })
  it('Should support adding a watch', () => {
    const subscriber = createSubscriber()
    subscriber.addWatch('123')
    const data = subscriber.docData
    expect(Object.keys(data.watched)).toEqual(['123'])
    expect(subscriber.watches('123') > 0).toBe(true)
  })
  it('Should support removing a watch', () => {
    const subscriber = createSubscriber()
    subscriber.addWatch('123')
    subscriber.addWatch('345')
    subscriber.removeWatch('123')
    const data = subscriber.docData
    expect(Object.keys(data.watched)).toEqual(['345'])
    expect(subscriber.watches('123') === 0).toBe(true)
  })
  it('Should support adding a mute', () => {
    const subscriber = createSubscriber()
    subscriber.addMute('123')
    const data = subscriber.docData
    expect(data.muted).toEqual(['123'])
    expect(subscriber.hasMuted('123')).toBe(true)
  })
  it('Should support removing a mute', () => {
    const subscriber = createSubscriber()
    subscriber.addMute('123')
    subscriber.addMute('345')
    subscriber.removeMute('123')
    const data = subscriber.docData
    expect(data.muted).toEqual(['345'])
    expect(subscriber.hasMuted('123')).toBe(false)
  })
})