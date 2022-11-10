import { Reply } from '../entries/Reply'
import { DocumentData, Timestamp } from 'firebase/firestore'

describe('Reply', () => {
  it('Hydrates legacy data', () => {
    const ts = new Timestamp(100, 200)
    const reply = new Reply(
      {
        author: 'ststrsrt',
        content: '<p>fygiubbubu</p>',
        created: ts
      },
      'key_for_a_reply'
    )
    expect(reply.owners).toEqual('ststrsrt')
    expect(reply.docData?.author).toBe('ststrsrt')
    expect(reply.docData?.content).toBe('<p>fygiubbubu</p>')
    expect(reply.docData?.createdAt).toBe(ts)
  }),
    it('Supports quoted content', () => {
      const reply = new Reply({
        quoteRef: 'wdwqfq3f'
      })
      expect(reply.isQuoting()).toBe(true)
      expect(reply.quoteRef).toBe('wdwqfq3f')
    })
  it('Provides a collection name', () => {
    expect(Reply.collectionName).toBe('comments')
  })
})
