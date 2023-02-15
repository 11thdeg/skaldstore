import { DocumentData, serverTimestamp, Timestamp } from 'firebase/firestore'
import { Profile } from '../entries/Profile'

describe('Profile', () => {
  // Storable basics
  it('Should support key', () => {
    const asset = new Profile()
    expect(asset.key).toBe('')
    expect(asset.uid).toBe('')
  })
  it('Should support getFirestorePath', () => {
    const asset = new Profile()
    expect(asset.getFirestorePath()).toEqual([Profile.collectionName])
  })


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
      bio: 'bio',
      lovedThreads: ['thread1', 'thread2'],
      lovedSites: ['site1', 'site2']
    }
    expect(profile.docData).toEqual({
      avatarURL: 'https://avatar.com',
      nick: 'nickname!',
      bio: 'bio',
      lovedThreads: ['thread1', 'thread2'],
      lovedSites: ['site1', 'site2'],
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
    expect(profile.docData.lovedThreads).toBeUndefined()
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
  it('Should support reactions', () => {
    const profile = new Profile({
      lovedThreads: ['thread_1', 'thread_2']
    })
    expect(profile.loves('thread_1')).toBe(true)
    expect(profile.loves('thread_3')).toBe(false)
  })
  it('Should support watching a thread', () => {
    const profile = new Profile()
    const t = new Date().getTime()
    profile.watchThreadAt('thread_1', t)
    profile.watchThreadAt('thread_2', t)
    expect(profile.docData.watchThreads.thread_1).toBe(t)
    expect(profile.seenThreadAt('thread_1')).toBe(t)
    expect(profile.watchThreads).toEqual(['thread_1', 'thread_2'])
  })
  it('Should support unwatching a thread', () => {
    const profile = new Profile()
    const t = new Date().getTime()
    profile.watchThreadAt('thread_1', t)
    profile.unWatchThread('thread_1')
    expect(profile.docData.watchThreads).toBeUndefined()
    expect(profile.seenThreadAt('thread_1')).toEqual(0)
    expect(profile.watchThreads).toEqual([])
  })
  it('Should provide a Collection name', () => {
    expect(Profile.collectionName).toBe('profiles')
  })
})
