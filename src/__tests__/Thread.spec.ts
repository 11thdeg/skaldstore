import { DocumentData, Timestamp } from 'firebase/firestore'
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
    expect(thread.docData.public).toBe(true)
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
        images: ['url_1', 'url_2']
      }
      expect(thread.images?.length).toBe(2)
      const i = thread.images ? thread.images[0] : 'error!'
      expect(i).toBe('url_1')
    })
  it('Converts Assets Map to an Array when dehydrating', () => {
    const thread = new Thread()
    thread.images = ['url_1', 'url_2']
    expect(thread.docData.images).toEqual(['url_1', 'url_2'])
  })
  it('Should default to first asset as poster', () => {
    const t = new Thread()
    t.images = ['url_1', 'url_2']
    expect(t.docData.poster).toEqual('url_1')
  })
  it('Should support setting a Poster', () => {
    const t = new Thread()
    t.poster = 'url_1'
    expect(t.docData.poster).toEqual('url_1')
  })
  it('should provide a collectionName', () => {
    expect(Thread.collectionName).toBe('stream')
  })

  it('should support serializing to JSON', () => {
    const t = new Thread({
      title: 'name_2',
      content: 'content_3',
      owners: ['author_4', 'author_5']
    }, 'thread_key_1')
    const json = t.toJSON()
    expect(json.title).toBe('name_2')
    expect(json.content).toBe('content_3')
    expect(json.owners).toEqual(['author_4', 'author_5'])
    expect(json.key).toBe('thread_key_1')
  })

  it('should support serializing from JSON', () => {
    const json = {
      title: 'name_2',
      content: 'content_3',
      owners: ['author_4', 'author_5'],
      key: 'thread_key_1',
      flowTime: 123456789000
    }
    const t = Thread.fromJSON(json)
    expect(t.title).toBe('name_2')
    expect(t.htmlContent).toBe('content_3')
    expect(t.author).toBe('author_4')
    expect(t.key).toBe('thread_key_1')
    expect(t.flowTime).toBe(123456789000)
  })

  it('should support getting a firestore path', () => {
    const t = new Thread({}, 'thread_key_1')
    expect(t.getFirestorePath()).toEqual(['stream', 'thread_key_1'])
  })
})
