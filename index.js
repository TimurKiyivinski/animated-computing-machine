'use strict'

const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')

;(function () {
  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Connect to database
  mongoose.connect('mongodb://localhost/note')

  // Create model
  const Note = mongoose.model('Note', {
    title: String,
    data: String
  })

  // Static code
  app.use(express.static('public'))

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  // API
  const api = '/api/note'

  app.get(api, (req, res) => {
    Note.find({}, (err, notes) => {
      res.json(notes)
    })
  })

  app.post(api, (req, res) => {
    const note = new Note({
      title: req.body.title,
      data: req.body.data
    })
    note.save(err => {
      if (err) {
        res.json({
          error: true
        })
      } else {
        res.json(note)
      }
    })
  })

  app.get(`${api}/:id`, (req, res) => {
    Note.findOne({ _id: req.params.id }, (err, note) => {
      res.json(note)
    })
  })

  app.put(`${api}/:id`, (req, res) => {
    Note.findOne({ _id: req.params.id }, (err, note) => {
      note.title = req.body.title
      note.data = req.body.data
      note.save(err => {
        if (err) {
          res.json({
            error: true
          })
        } else {
          res.json(note)
        }
      })
    })
  })

  app.delete(`${api}/:id`, (req, res) => {
    Note.findOneAndRemove({ _id: req.params.id }, (err, doc, note) => {
      if (err) {
        res.json({
          error: true
        })
      } else {
        res.json(note)
      }
    })
  })

  app.listen(3000)
})()
