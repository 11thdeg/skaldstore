import { Site } from '../entries/Site'
import { Timestamp } from 'firebase/firestore'

describe('Site', () => {
  it('Supports base fields', () => {
    const site = new Site({
      name: 'fwafawfa',
      description: 'faefaefa bdbmper odcöoabuw',
      lovesCount: 24,
    })
    expect(site.name).toBe('fwafawfa')
    expect(site.description).toBe('faefaefa bdbmper odcöoabuw')
    expect(site.docData.name).toBe('fwafawfa')
    expect(site.docData.description).toBe('faefaefa bdbmper odcöoabuw')
    expect(site.lovesCount).toBe(24)
    expect(site.docData.lovesCount).toBe(24)
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
  }),
    it('provides a collectionName', () => {
      expect(Site.collectionName).toBe('sites')
    })
  it('supports homepage', () => {
    const site = new Site(
      {
        homepage: 'homepage'
      },
      'site_id_123'
    )
    expect(site.homepage).toBe('homepage')
    expect(site.docData.homepage).toBe('homepage')
    site.homepage = ''
    expect(site.homepage).toBe(site.key)
    expect(site.docData.homepage).toBe(site.key)
  }),
    it('supports setting a license', () => {
      const site = new Site(
        {
          license: 'license'
        },
        'site_id_123'
      )
      expect(site.license).toBe('license')
      expect(site.docData.license).toBe('license')
      site.license = 'a'
      expect(site.license).toBe('a')
      expect(site.docData.license).toBe('a')
    })
  it('supports FirestoreEntry', () => {
    const site = new Site(
      {
        name: 'fwafawfa',
        description: 'faefaefa bdbmper odcöoabuw'
      },
      'site_id_123'
    )
    expect(site.key).toBe('site_id_123')
    expect(site.getFirestorePath().join('/')).toBe('sites/site_id_123')
  })
  it('supports setting a sort order', () => {
    const site = new Site(
      {
        sortOrder: Site.SORT_BY_MANUAL
      },
      'site_id_123'
    )
    expect(site.sortOrder).toBe(Site.SORT_BY_MANUAL)
    expect(site.docData.sortOrder).toBe(Site.SORT_BY_MANUAL)
    site.sortOrder = Site.SORT_BY_NAME
    expect(site.sortOrder).toBe(Site.SORT_BY_NAME)
    expect(site.docData.sortOrder).toBe(Site.SORT_BY_NAME)
  })

  it('supports dehydrating to JSON', () => {
    const site = new Site(
      {
        name: 'fwafawfa',
        description: 'faefaefa bdbmper odcöoabuw',
        lovesCount: 24,
        systemBadge: 'fawefaefa',
        system: 'fasfa_system',
        pageCategories: [ 'a', 'b' ]
      },
      'site_id_123'
    )
    expect(site.toJSON()).toEqual({
      key: 'site_id_123',
      name: 'fwafawfa',
      description: 'faefaefa bdbmper odcöoabuw',
      flowTime: -1,
      sortOrder: Site.SORT_BY_NAME,
      createdAt: undefined,
      updatedAt: undefined,
      lovesCount: 24,
      systemBadge: 'fawefaefa',
      system: 'fasfa_system',
      pageCategories: [ 'a', 'b' ]
    })
  })
  it('supports hydrating from JSON', () => {
    const json = {
      key: 'site_id_123',
      name: 'fwafawfa',
      description: 'faefaefa bdbmper odcöoabuw',
      flowTime: 24513523236,
    }
    const site = Site.fromJSON(json)
    expect(site.key).toBe('site_id_123')
    expect(site.name).toBe('fwafawfa')
    expect(site.description).toBe('faefaefa bdbmper odcöoabuw')
    expect(site.flowTime).toBe(24513523236)
  })
  // Site supports setting a set of tags, and saving them to the db
  it('supports tags', () => {
    const site = new Site({ key: 'site_id_123' })
    site.tags = ['tag1', 'tag2']
    expect(site.tags).toEqual(['tag1', 'tag2'])
    expect(site.docData.tags).toEqual(['tag1', 'tag2'])
  })
  // Site supports setting a set of links, and saving them to the db
  it('supports links', () => {
    const site = new Site({ key: 'site_id_123' })
    site.links = [
      {
        name: 'title',
        url: 'url'
      }
    ]
    expect(site.links).toEqual([
      {
        name: 'title',
        url: 'url'
      }
    ])
    expect(site.docData.links).toEqual([
      {
        name: 'title',
        url: 'url'
      }
    ])
  })
})
