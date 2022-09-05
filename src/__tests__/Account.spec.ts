import { Timestamp } from 'firebase/firestore'
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
  })
})
