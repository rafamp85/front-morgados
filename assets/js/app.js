
var notifActivated = false;
 const URI = 'http://localhost:3000';
// const URI = 'http://187.210.10.200:3000';
var swLocation = '/sw.js';

var swReg;


if ( navigator.serviceWorker ) {

    navigator.serviceWorker.register( swLocation ).then( reg => {

        swReg = reg;
        swReg.pushManager.getSubscription().then( verifySubscribe );
    });

    // window.addEventListener( 'load', () => {

    //     navigator.serviceWorker.register( swLocation ).then( reg => {

    //         swReg = reg;
    //         swReg.pushManager.getSubscription().then( verifySubscribe );
    //     });

    // });

}

function verifySubscribe( activated ) {

    console.log(activated);

    if ( activated ) {

        if ( activated === 'false' ) {
            console.log('Mando cancelacion');
            return;
        }

        console.log('Ya estas suscrito');
        setActiveNotif( true );

    } else {

        console.log('NO estas suscrito');
        setActiveNotif( false );
        // requestNotification();

    }
}

function setActiveNotif( value ) {
    notifActivated = value;
}


function validateActiveNotif( ) {
    alert( notifActivated );
    return notifActivated;
}


// Get key
function getPublicKey() {

    const url = URI + '/notification';

    return fetch( url )
      .then( res => res.arrayBuffer()
      .then( key => new Uint8Array(key) ) )
      .catch( console.log );

}


function requestNotification() {

    if ( !swReg ) return console.log('No hay registro del SW');

    getPublicKey().then( key => {

        console.log(key);

        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        })
        .then( res => res.toJSON() )
        .then( subscription => {

            console.log(subscription);

            this.notifActivated = true;

            fetch( URI + '/notification/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( subscription )
            })
            .then( verifySubscribe )
            .catch( this.notifActivated = false );

        });

    }).catch(
      this.notifActivated = false
    );

}


function cancelSubscription() {

    swReg.pushManager.getSubscription().then( subs => { 

        subs.unsubscribe().then( () => verifySubscribe( 'false' ) );

    });
}