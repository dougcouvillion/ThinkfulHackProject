/**
 * Created with JetBrains PhpStorm.
 * User: doug
 * Date: 9/29/13
 * Time: 4:29 PM
 * To change this template use File | Settings | File Templates.
 */

var map;
var geocoder;

function initialize() {
    // initialize the Google Maps API stuff
    var mapOptions = {
        //center: new google.maps.LatLng(-34.397, 150.644),
        center: new google.maps.LatLng(37.552, -77.432),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.STREET
    };
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById("mapCanvas"),
        mapOptions);

    // Set up event handlers
    //$("#buttonSearch").submit(searchForLocation);

    jQuery("#formSearch").submit(searchForLocation);
}

function searchForLocation(event) {
    var searchTerms = $("#inputSearchTerms").val();
    geocoder.geocode( { 'address': searchTerms}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

            $('#mapTitle').html("<h2>" + searchTerms + "</h2>")
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
    event.preventDefault();
}
/*
The line of code below appeared in the Google example.  I replaced it with
the document.onload() call.

google.maps.event.addDomListener(window, 'load', initialize);
 */

$(document).ready(initialize);