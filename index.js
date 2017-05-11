const express = require('express')
const creds = require('./creds.json')
var Airtable = require('airtable')

Airtable.configure({
  apiKey: creds.airtableKey
})

const base = Airtable.base(creds.baseId)
console.info('Conected to base:', creds.baseId)

const navigation$ = require('./navigation')(base).publishReplay(1).refCount()
const feed = require('./feed')(base)
const presentation = require('./presentation')(base)

var app = express()

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  next()
}
app.use(allowCrossDomain)

app.get('/nav.json', function (req, res) {
  res.status(200)
  navigation$.subscribe(nav => {
    res.send(nav)
  }, err => {
    res.status(500)
    res.send(err)
  })
})

app.get('/feed.json', function (req, res) {
  res.status(200)
  feed.get().subscribe(feed => {
    res.send(feed)
  }, err => {
    res.send(err)
  })
})


app.get('/presentation.json', (req, res) => {
  res.status(200)
  presentation.get()
    .subscribe(data => {
      res.send(data)
    }, err => res.send(err))

})

app.get('/feed/:id/vote', (req, res) => {
  const updateIDc = req.params['id']
  res.status(200)
  if (!updateIDc) {
    res.status(422)
    res.end()
    return
  }
  feed.get().subscribe(feeds => {
    const feedRecord = feeds.find(res => res.id === updateIDc)
    if (!feedRecord) {
      console.log('method not allowd on feed')
      res.status(401)
      return
    }
    base('/feed').update(feedRecord.id, {
      Votes: feedRecord.votes ? feedRecord.votes + 1 : 1
    }, function (err, record) {
      if (err) {
        res.send(err)
        return
      }
      console.log('upvoted', feedRecord.id)
      res.send(200, record.get('Votes'))
    })
  }, err => {
    console.log('error with feed sub...')
    res.send(err)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
