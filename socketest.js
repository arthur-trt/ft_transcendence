import * as WebSocket from 'ws'
beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
	imports: [
	  SocketModule,
	],
  })
	.compile()

  app = moduleFixture.createNestApplication()
  app.useWebSocketAdapter(new WsAdapter(app))
  await app.init()
})

it('should connect successfully', (done) => {
  const address = app.getHttpServer().listen().address()
  const baseAddress = `http://[${address.address}]:${address.port}`

  const socket = new WebSocket(baseAddress)

  socket.on('open', () => {
	console.log('I am connected! YEAAAP')
	done()
  })

  socket.on('close', (code, reason) => {
	done({ code, reason })
  })

  socket.on ('error', (error) => {
	done(error)
  })
})
