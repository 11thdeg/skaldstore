import { DocumentData, Timestamp } from 'firebase/firestore'
import { Profile } from '../entries/Profile'

describe('Profile', () => {
  it('Should hydrate Avatar URL and Nickname from docData', () => {
    const ts = Timestamp.now()
    const doc = {
      id: 'test for docData',
      avatarURL: 'https://avatar.com',
      nickname: 'nickname',
      createdAt: ts
    } as DocumentData
    const profile = new Profile(doc)
    expect(profile.avatarURL).toBe('https://avatar.com')
    expect(profile.nickname).toBe('nickname')
    expect(profile.createdAt).toBe(ts)
  })
})
