import { DocumentData } from 'firebase/firestore'
import { Thread } from '../entries/Thread'

describe('Thread', () => {
  it('Should support setting and getting author as owner', () => {
    const thread = new Thread()
    thread.owners = ['author_11']
    expect(thread.author).toBe('author_11')
  })
  it('Should support setting author as owner in the docdata', () => {
    const thread = new Thread()
    thread.owners = ['author_11']
    expect(thread.docData.author).toBe('author_11')
  })
  it('Should default to public visilibilty', () => {
    const thread = new Thread()
    expect(thread.public).toBe(true)
  })
  it('Should support legacy docdata', () => {
    const thread = new Thread()
    thread.docData = {
      title: 'name_2',
      content: 'content_3',
      author: 'author_4',
      replyCount: 5,
      lovedCount: 6,
      seenCount: 7,
      public: false,
      topic: 'yleinen_9',
      site: 'site_10'
    }
    expect(thread.title).toBe('name_2')
    expect(thread.htmlContent).toBe('content_3')
    expect(thread.author).toBe('author_4')
    expect(thread.replyCount).toBe(5)
    expect(thread.lovedCount).toBe(6)
    expect(thread.followerCount).toBe(7)
    expect(thread.public).toBe(false)
    expect(thread.topicid).toBe('yleinen_9')
    expect(thread.siteid).toBe('site_10')
    expect(thread.owners).toEqual('author_4')
  }),
    it('Should support setting a key for linking to a thread', () => {
      const thread = new Thread({}, 'thread_key')
      expect(thread.key).toBe('thread_key')
    }),
    it('Should gracefully return only a legacy-author, even if there are many', () => {
      const thread = new Thread({
        owners: ['author_88242', 'author_12', 'author_13']
      })
      expect(thread.owners).toEqual(['author_88242', 'author_12', 'author_13'])
      expect(thread.author).toBe('author_88242')
      expect(thread.docData.author).toBe('author_88242')
    }),
    it('Converts Assets to Array', () => {
      const thread = new Thread()
      thread.docData = {
        assets: [
          ['asset_1', 'url_1'],
          ['asset_2', 'url_2']
        ]
      }
      expect(thread.assets.size).toBe(2)
      expect(thread.assets.get('asset_1')).toBe('url_1')
    })
  it('Converts Assets Map to an Array when dehydrating', () => {
    const thread = new Thread()
    thread.assets = new Map([
      ['asset_1', 'url_1'],
      ['asset_2', 'url_2']
    ])
    expect(thread.docData.assets).toEqual([
      ['asset_1', 'url_1'],
      ['asset_2', 'url_2']
    ])
  })
})
