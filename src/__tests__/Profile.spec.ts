import { DocumentData, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Profile } from '../entries/Profile'

describe('Profile', () => {
  it('Should hydrate Avatar URL and Nickname from docData', () => {
    const ts = Timestamp.now()
    const doc = {
      avatarURL: 'https://avatar.com',
      nick: 'nickname',
      createdAt: ts
    } as DocumentData
    const profile = new Profile(doc)
    expect(profile.avatarURL).toBe('https://avatar.com')
    expect(profile.nick).toBe('nickname')
    expect(profile.createdAt).toBe(ts)
  })
  it('Should support setting and getting docData', () => {
    const profile = new Profile()
    profile.docData = {
      avatarURL: 'https://avatar.com',
      nick: 'nickname!',
      bio: 'bio'
    }
    expect(profile.docData).toEqual({
      avatarURL: 'https://avatar.com',
      nick: 'nickname!',
      bio: 'bio',
      createdAt: serverTimestamp(),
      flowTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  })
  it('Should support setting and getting empty docdata', () => {
    const profile = new Profile()
    profile.docData = {}
    expect(profile.nick).toBe('')
    expect(profile.avatarURL).toBeUndefined()
    expect(profile.bio).toBe('')
  })
  it('Should support legacy photoURL', () => {
    const profile = new Profile()
    profile.docData = {
      photoURL: 'https://avatar.com'
    }
    expect(profile.avatarURL).toBe('https://avatar.com')
    expect(profile.docData.avatarURL).toBe('https://avatar.com')
    expect(profile.docData.photoURL).toBeUndefined()
  })
  it('Should support uid as a legacy owner field', () => {
    const profile = new Profile({}, 'uid_11')
    expect(profile.docData.owners).toEqual(['uid_11'])
    expect(profile.uid).toBe('uid_11')
    expect(profile.docData.uid).toBe('uid_11')
  })
  it('Should return first owner as uid if uid is missing', () => {
    const profile = new Profile()
    profile.owners = [
      'owner_99',
      'another owner, which should not do anything except fill up the db with extraneous data'
    ]
    expect(profile.uid).toBe('owner_99')
  })
  it('Should dehydrate settable fields', () => {
    const profile = new Profile()
    profile.bio = 'a test of bio'
    expect(profile.docData.bio).toBe('a test of bio')
  })
})
