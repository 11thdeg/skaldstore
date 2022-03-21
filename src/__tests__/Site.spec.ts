import { Site } from '../entries/Site'
import { Timestamp } from 'firebase/firestore'

describe('Site', () => {
  it('Supports base fields', () => {
    const site = new Site({
      name: 'fwafawfa',
      description: 'faefaefa bdbmper odcöoabuw'
    })
    expect(site.name).toBe('fwafawfa')
    expect(site.description).toBe('faefaefa bdbmper odcöoabuw')
    expect(site.docData.name).toBe('fwafawfa')
    expect(site.docData.description).toBe('faefaefa bdbmper odcöoabuw')
  })
  it('Forces --- as a name instead of empty name for orderby and where support on firebase', () => {
    const site = new Site()
    expect(site.docData.name).toBe('---')
  })
  it('Supports systemBadge', () => {
    const site = new Site({
      systemBadge: 'fawefaefa'
    })
    expect(site.systemBadge).toBe('fawefaefa')
    expect(site.docData.systemBadge).toBe('fawefaefa')
  })
  it('Supports system', () => {
    const site = new Site({
      system: 'fawefaefa'
    })
    expect(site.system).toBe('fawefaefa')
    expect(site.docData.system).toBe('fawefaefa')
  })
  it('Supports hidden', () => {
    const site = new Site({
      hidden: true
    })
    expect(site.hidden).toBe(true)
    expect(site.docData.hidden).toBe(true)
  })
  it('Supports pageCategories', () => {
    const site = new Site({
      pageCategories: [
        {
          slug: 'fawefsdfaefa',
          name: 'fawefaefsfsdfa'
        },
        {
          slug: 'fawefsdfaefa_2',
          name: 'fawefaefsfsdfa_2'
        }
      ]
    })
    expect(site.pageCategories).toContainEqual({
      slug: 'fawefsdfaefa',
      name: 'fawefaefsfsdfa'
    })
    expect(site.pageCategories).toContainEqual({
      slug: 'fawefsdfaefa_2',
      name: 'fawefaefsfsdfa_2'
    })
    expect(site.docData.pageCategories).toContainEqual({
      slug: 'fawefsdfaefa',
      name: 'fawefaefsfsdfa'
    })
  })
  it('Supports players', () => {
    const site = new Site({
      players: ['player_1'],
      owners: ['owner_2', 'owner_3']
    })
    expect(site.players).toContain('player_1')
    expect(site.members).toContain('player_1')
    expect(site.members).toContain('owner_2')
    expect(site.members).toContain('owner_3')
    expect(site.docData.players).toContain('player_1')
    expect(site.docData.owners).toContain('owner_2')
  })
  it('Supports avatar and poster', () => {
    const site = new Site({
      avatarURL: 'avatar_url',
      posterURL: 'avatar_2'
    })
    expect(site.avatarURL).toBe('avatar_url')
    expect(site.posterURL).toBe('avatar_2')
    expect(site.docData.avatarURL).toBe('avatar_url')
    expect(site.docData.posterURL).toBe('avatar_2')
  })
  it('Supports legacy dates', () => {
    const ts = Timestamp.fromDate(new Date())
    const site = new Site({
      lastUpdate: ts
    })
    expect(site.createdAt).toBe(ts)
    expect(site.updatedAt).toBe(ts)
    expect(site.flowTime).toBe(Math.floor(ts.toMillis()))
    expect(site.docData.createdAt).toBe(ts)
  })
})
