plexy
=====

Create multiple duplex object streams that **write to** and **read from** a single text stream.

[![NPM](https://nodei.co/npm/plexy.png?compact=true)](https://nodei.co/npm/plexy/)

## API

```js
var Plexy = require('plexy')
```

### Plexy(carrierStream, channelName)

Returns a duplex object stream. 

## Example

Server:

```js
function CarrierStream(){ // allow streaming from and to multiple sources
  var stream = Through(function(data){
    this.outgoing.queue(data)  
  })

  stream.incoming = Through()
  stream.outgoing = Through()

  stream.incoming.on('data', function(data){
    stream.queue(data)
  })

  return stream
}

var carrierStream = CarrierStream()

var main = Plexy(carrierStream, 'main')
var sub = Plexy(carrierStream, 'sub')

// log any messages recieved from clients to console
main.on('data', function(data){
  console.write('main:', data)
})
sub.on('data', function(data){
  console.write('sub:', data)
})

var sock = shoe(function (stream) {
  carrierStream.outgoing.pipe(stream).pipe(carrierStream.incoming)
  stream.on('end', function () {
    carrierStream.outgoing.unpipe(stream)
    stream.unpipe(carrierStream.incoming)
  })
})

// send a message every 4 seconds to all connected clients on 'main' channel
setInterval(function(){
  main.write('hello all!')
}, 4000)

sock.install(server, '/stream')
```

Client:

```js
var socket = Shoe('/stream')

var main = Plexy(socket, 'main')
var sub = Plexy(socket, 'sub')

// send some data to write on server console:
main.write('Some text')
main.write({message: 'an object'})

// log any messages recieved from server
main.on('data', function(data){
  console.write('main:', data)
})

sub.on('data', function(data){
  console.write('sub:', data)
})

```