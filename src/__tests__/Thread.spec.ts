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
  it('Should support legacy docdata', () => {
    const thread = new Thread()
    thread.docData = {
      name: 'name_2',
      content: 'content_3',
      author: 'author_4',
      replyCount: 5,
      lovedCount: 6,
      seenCount: 7,
      hidden: true,
      topic: 'yleinen_9',
      site: 'site_10'
    }
    expect(thread.name).toBe('name_2')
    expect(thread.htmlContent).toBe('content_3')
    expect(thread.author).toBe('author_4')
    expect(thread.replyCount).toBe(5)
    expect(thread.lovedCount).toBe(6)
    expect(thread.followerCount).toBe(7)
    expect(thread.hidden).toBe(true)
    expect(thread.topicid).toBe('yleinen_9')
    expect(thread.siteid).toBe('site_10')
  })
})
