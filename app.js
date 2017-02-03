//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {
    res.render( 'home', {
        message: 'The Home Page!'
    });
});


//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});

request( 'https://www.leboncoin.fr/ventes_immobilieres/1066912654.htm?ca=12_s', function ( error, response, html ) {
    if ( !error && response.statusCode == 200 ) {
        var $ = cheerio.load( html );
        var price = parseInt( $( 'h2.item_price span.value' ).get()[0].children[0].data.replace( /\s/g, '' ), 10 );
        console.log( price );

        var ville = $( 'h2 .value ' ).get()[1].children[0].data.split( " " );
        console.log( ville[0] );

        var cp = $( 'h2 .value ' ).get()[1].children[0].data.replace( /\n/g, '' ).split( " " );
        console.log( cp[1] );

        var typedebien = $( 'h2 .value ' ).get()[2].children[0].data;
        console.log( typedebien );

        var nbPiece = $( 'h2 .value ' ).get()[3].children[0].data;
        console.log( nbPiece );

        var surface = parseInt( $( 'h2 .value ' ).get()[4].children[0].data.replace( /\s/g, '' ), 10 );
        console.log( surface );




    };

});