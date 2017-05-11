const rx = require('rxjs/Rx')
const {Observable} = rx

function PresentationService (base) {
  if (!(this instanceof PresentationService)) {
    return new PresentationService(base)
  }
  this.base = base
}

PresentationService.prototype.get = function (base) {
  return Observable.create(observer => {
    this.base('Presentation').select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 100,
      view: 'Grid view'
    }).firstPage((err, records) => {
      if (err) {
        console.error('Error requesting records')
        console.error(err)
        observer.error(err)
      }
      
      console.log('requested presentation data')
      const model = records.map(item => {
        return {
          id: item.id,
          name: item.get('Name'),
          content: item.get('Content')
        }
      })

      observer.next(model)
      observer.complete()
    })
  })
}

module.exports = PresentationService
