//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );
//var MA = 'https://www.meilleursagents.com/prix-immobilier/';

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {

    if ( req.query.urlLBC ) {
        Deal( req.query.urlLBC, res );
        urlLBC = null;
    }
    else {
        res.render( 'home', {
            message: ''
        });
    }
});


//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});

function Deal( urlLBC, res ) {

    request( urlLBC, function ( error, response, html ) {
        if ( !error && response.statusCode == 200 ) {
            var $ = cheerio.load( html );
            var data = new Object();


            var price = parseInt( $( 'h2.item_price span.value' ).get()[0].children[0].data.replace( /\s/g, '' ), 10 );
            console.log( price );
            data.price = price;

            var ville = $( 'h2 .value ' ).get()[1].children[0].data.replace( /\n/g, '' ).split( " " );
            console.log( ville[0] );
            data.ville = ville[0];

            var cp = $( 'h2 .value ' ).get()[1].children[0].data.replace( /\n/g, '' ).split( " " );
            console.log( cp[1] );
            data.cp = cp[1];

            var typedebien = $( 'h2 .value ' ).get()[2].children[0].data;
            console.log( typedebien );
            data.typedebien = typedebien;

            var nbPiece = $( 'h2 .value ' ).get()[3].children[0].data;
            console.log( nbPiece );
            data.nbPiece = nbPiece;

            var surface = parseInt( $( 'h2 .value ' ).get()[4].children[0].data.replace( /\s/g, '' ), 10 );
            console.log( surface );
            data.surface = surface;

            console.log( data );

            var MA = null;
            MA = 'https://www.meilleursagents.com/prix-immobilier/' + data.ville.toLowerCase() + "-" + cp[1] + "/";
            console.log( MA );

            request( MA.toString(), function ( error, response, html ) {
                if ( !error && response.statusCode == 200 ) {
                    var $ = cheerio.load( html );

                    if ( data.typedebien == "Appartement" ) {
                        var MAPrice = parseInt( $( 'div.prices-summary__values div.prices-summary__cell--median' ).get( 0 ).children[0].data.replace( /\s/g, '' ), 10 );
                    }
                    else if ( data.typedebien == "Maison" ) {
                        var MAPrice = parseInt( $( 'div.prices-summary__values div.prices-summary__cell--median' ).get( 1 ).children[0].data.replace( /\s/g, '' ), 10 );
                    }

                    else {
                        var MAPrice = "Type de bien inconnu";
                    }
                    console.log( MAPrice );

                    MyPriceByM = data.price / data.surface;
                    console.log( MyPriceByM );

                    if ( MyPriceByM <= MAPrice ) {
                        res.render( 'home', {
                            message: 'Good Deal !'
                        });
                    }
                    else {
                        res.render( 'home', {
                            message: 'Bad Deal...'
                        });
                    }
                }
                else {
                    res.render( 'home', {
                        message: 'Error'
                    });
                }

            });
        };
    });
};







