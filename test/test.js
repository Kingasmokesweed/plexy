var test = require('tape')

var Plexy = require('../')
var Through = require('through')

test(function(t){
  t.plan(4)

  var localStream = Through(function(data){
    remoteStream.queue(data)
  })

  var remoteStream = Through(function(data){
    localStream.queue(data)
  })

  var localChannel1 = Plexy(localStream, 'channel1')
  var localChannel2 = Plexy(localStream, 'channel2')

  var remoteChannel1 = Plexy(remoteStream, 'channel1')
  var remoteChannel2 = Plexy(remoteStream, 'channel2')

  remoteChannel1.on('data', function(data){
    t.deepEqual(data, {message: 'hello from server on channel 1'})
  })

  remoteChannel2.on('data', function(data){
    t.deepEqual(data, {message: 'hello from server on channel 2'})
  })

  localChannel1.on('data', function(data){
    t.deepEqual(data, {message: 'hello from client on channel 1'})
  })

  localChannel2.on('data', function(data){
    t.deepEqual(data, {message: 'hello from client on channel 2'})
  })

  localChannel1.write({message: 'hello from server on channel 1'})
  localChannel2.write({message: 'hello from server on channel 2'})
  remoteChannel1.write({message: 'hello from client on channel 1'})
  remoteChannel2.write({message: 'hello from client on channel 2'})

  t.end()

})