import Server from 'socket.io';

export default function startServer(store) {
    // spin up server
    const io = new Server().attach(8090);

    // emit store changes to connected clients
    store.subscribe(
        () => io.emit('state', store.getState().toJS())
    );

    // emit state to new connections
    io.on('connection', (socket) => {
        socket.emit('state', store.getState().toJS());
        socket.on('action', store.dispatch.bind(store));
    });
}
