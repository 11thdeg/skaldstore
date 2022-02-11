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
  })
})