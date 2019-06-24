

// Escuchar PUSH
self.addEventListener( 'push', e => {

    // console.log(e);
    const data = JSON.parse( e.data.text() );

    console.log( data );

    const title = data.name;
    const options = {
        body: data.street,
        icon: 'assets/images/JOSNA.png',
        badge: 'assets/images/favicon.png',
        image: 'assets/images/image1.jpg',
        openUrl: '/'
    };

    e.waitUntil( self.registration.showNotification( title, options ) );

});