import { Asset } from '../entries/Asset'

describe('Asset', () => {
  it('Should support hydration from docData', () => {
    const asset = new Asset()
    asset.docData = {
      url: 'https://avatar.com',
      description: 'description',
      license: 1,
      site: 'site',
      name: 'name',
      mimetype: 'mimetype',
      storagePath: 'storagePath'
    }
    expect(asset.url).toBe('https://avatar.com')
    expect(asset.description).toBe('description')
    expect(asset.license).toBe('1')
    expect(asset.site).toBe('site')
    expect(asset.name).toBe('name')
    expect(asset.mimetype).toBe('mimetype')
    expect(asset.storagePath).toBe('storagePath')
  }),
    it('Should provide a Collection name', () => {
      expect(Asset.collectionName).toBe('assets')
    })
})
