import { Timestamp } from 'firebase/firestore'
import { Notification } from '../Notification'

describe('Notification', () => {
  it('Core fields should work as expected', () => {
    const notification = new Notification(
      {
        from: 'from',
        to: 'to',
        message: 'message',
        targetKey: 'targetKey',
        targetType: 'targetType',
        createdAt: new Timestamp(100, 200)
      },
      'key'
    )
    expect(notification.from).toBe('from')
    expect(notification.docData?.from).toBe('from')
    expect(notification.to).toBe('to')
    expect(notification.docData?.to).toBe('to')
    expect(notification.message).toBe('message')
    expect(notification.docData?.message).toBe('message')
    expect(notification.targetKey).toBe('targetKey')
    expect(notification.docData?.targetKey).toBe('targetKey')
    expect(notification.targetType).toBe('targetType')
    expect(notification.docData?.targetType).toBe('targetType')
    expect(notification.createdAt).toEqual(new Timestamp(100, 200))
    expect(notification.docData?.createdAt).toEqual(new Timestamp(100, 200))

    expect(notification.key).toBe('key')
  })
  it('Supports creating a new notification', () => {
    const notification = new Notification(
      {
        from: 'from',
        to: 'to',
        message: 'message',
        targetKey: 'targetKey',
        targetType: 'targetType'
      },
      'key'
    )
    expect(notification.docData?.createdAt).toBeDefined()
  }),
  it('should return a collection name', () => {
    expect(Notification.collectionName).toBe('notifications')
  })
})