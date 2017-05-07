const rx = require('rxjs/Rx')
const { Observable } = rx

function FeedService (base) {
  if (!(this instanceof FeedService)) {
    return new FeedService(base)
  }
  this.base = base
}

FeedService.prototype.get = function () {
  return Observable.create(observer => {
    this.base('/feed').select({
      maxRecords: 10,
      view: 'Public View'
    }).firstPage((err, records) => {
      if (err) {
        console.error('Error requesting records')
        console.error(err)
        observer.error(err)
      }

      console.log('requested feed data')
      const model = records.map(item => {
        return {
          name: item.get('Name'),
          content: item.get('Content'),
          votes: item.get('Votes'),
          id: item.id
        }
      })
      observer.next(model)
      observer.complete()
    })
  })
}


module.exports = FeedService
