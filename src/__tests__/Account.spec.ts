import { DocumentData, Timestamp } from 'firebase/firestore'
import { Account } from '../Account'
import type { User } from 'firebase/auth'

describe('Account', () => {
  it('Should remove personal data from docdata', () => {
    const ts = Timestamp.now()
    const user = {
      uid: 'test for docData',
      email: 'email',
      displayName: 'displayName',
      photoURL: 'https://avatar.com',
      isAnonymous: false,
      providerId: 'providerId'
    } as User
    const account = new Account(user)
    expect(account.email).toBe('email')
    expect(account.docData.email).toBeUndefined()
  }),
    it('should return a collection name', () => {
      expect(Account.collectionName).toBe('account')
    }),
    it('Should support watching db entities', () => {
      const ts = Timestamp.now()
      const user = {
        uid: 'test for docData',
        email: 'email',
        displayName: 'displayName',
        photoURL: 'https://avatar.com',
        isAnonymous: false,
        providerId: 'providerId'
      } as User
      const account = new Account(user)
      expect(account.watched).toEqual([])
      expect(account.docData.watched).toBeUndefined()
      account.watched = [{ key: 'test', lastSeen: ts }]
      expect(account.watched).toEqual([{ key: 'test', lastSeen: ts }])
      expect(account.docData.watched).toEqual([{ key: 'test', lastSeen: ts }])
    }),
    it('Should support reading watches from db', () => {
      const ts = Timestamp.now()
      const user = {
        uid: 'test for docData',
        watched: [{ key: 'test', lastSeen: ts }]
      } as DocumentData
      const account = new Account(user)
      expect(account.watched).toEqual([{ key: 'test', lastSeen: ts }])
      expect(account.docData.watched).toEqual([{ key: 'test', lastSeen: ts }])
    }),
    it('Should support seenSince db entities', () => {
      const ts = Timestamp.now()
      const user = {
        uid: 'test for docData',
        email: 'email',
        displayName: 'displayName',
        photoURL: 'https://avatar.com',
        isAnonymous: false,
        providerId: 'providerId'
      } as User
      const account = new Account(user)
      expect(account.seenSince).toBeNull()
      expect(account.docData.seenSince).toBeUndefined()
      account.seenSince = ts
      expect(account.seenSince).toEqual(ts)
      expect(account.docData.seenSince).toEqual(ts)
    }),
    it('Should support lightMode', () => {
      const user = {
        uid: 'test for docData',
        lightMode: 'light'
      } as DocumentData
      const account = new Account(user)
      expect(account.lightMode).toEqual('light')
      expect(account.docData.lightMode).toEqual('light')
      account.lightMode = 'dark'
      expect(account.lightMode).toEqual('dark')
      expect(account.docData.lightMode).toEqual('dark')
    }),
    it('should support setting docData', () => {
      const ts = Timestamp.now()
      const data = {
        uid: 'test for docData',
        photoURL: 'https://avatar.com',
        lightMode: 'light',
        watched: [{ key: 'test', lastSeen: ts }],
        seenSince: ts
      }
      const account = new Account(null)
      account.docData = data
      expect(account.watched).toEqual([{ key: 'test', lastSeen: ts }])
      expect(account.seenSince).toEqual(ts)
      expect(account.lightMode).toEqual('light')
    })
})
