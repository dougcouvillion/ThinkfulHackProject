/**
 * Created with JetBrains PhpStorm.
 * User: doug
 * Date: 9/29/13
 * Time: 4:29 PM
 * To change this template use File | Settings | File Templates.
 */
function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("mapCanvas"),
        mapOptions);
}

/*
The line of code below appeared in the Google example.  I replaced it with
the document.onload() call.

google.maps.event.addDomListener(window, 'load', initialize);
*/

document.onload( initialize() );

