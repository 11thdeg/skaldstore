import { Site } from '../entries/Site'
// import { DocumentData, Timestamp } from 'firebase/firestore'

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
})
