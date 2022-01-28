import { DocumentData, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Profile } from '../entries/Profile'

describe('Profile', () => {
  it('Should hydrate Avatar URL and Nickname from docData', () => {
    const ts = Timestamp.now()
    const doc = {
      avatarURL: 'https://avatar.com',
      nickname: 'nickname',
      createdAt: ts
    } as DocumentData
    const profile = new Profile(doc)
    expect(profile.avatarURL).toBe('https://avatar.com')
    expect(profile.nickname).toBe('nickname')
    expect(profile.createdAt).toBe(ts)
  })
  it('Should support setting and getting docData', () => {
    const profile = new Profile()
    profile.docData = {
      avatarURL: 'https://avatar.com',
      nickname: 'nickname!',
      bio: 'bio'
    }
    expect(profile.docData).toEqual({
      avatarURL: 'https://avatar.com',
      nickname: 'nickname!',
      bio: 'bio',
      createdAt: serverTimestamp(),
      flowTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  })
  it('Should support setting and getting empty docdata', () => {
    const profile = new Profile()
    profile.docData = {}
    expect(profile.nickname).toBe('')
    expect(profile.avatarURL).toBeUndefined()
    expect(profile.bio).toBe('')
  })
})
