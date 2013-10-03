/**
 * Created with JetBrains PhpStorm.
 * User: doug
 * Date: 9/29/13
 * Time: 4:29 PM
 * To change this template use File | Settings | File Templates.
 */

var map;
var geocoder;
var accessToken;
var maxPhotosPerPage = 12;
var instagramLocationMatch = null;
var instagramLocationIndex = 0;

function initialize() {
    // handle Instagram authorization
    accessToken = parseInstagramAuthToken();
    if (accessToken.length == 0)
    {
        loginToInstagram();
    }

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

    $("#formSearch").submit(searchForLocation);
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

            $('#mapTitle').html("<h2>" + searchTerms + "</h2>");
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();

            getInstagramLocationMatches(lat,lng);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
    event.preventDefault();
}

function loginToInstagram() {
    console.log("Redirecting to Instagram oAuth...");
    var clientId = '954610280b974fd8ae723f4fcefa0d46';
    var redirectUri = "file:///Users/doug/Documents/code/git/ThinkfulHackProject/index.html";
    var oauthURL = "https://api.instagram.com/oauth/authorize/"
                 + "?client_id=" + clientId
                 + "&redirect_uri=" + redirectUri
                 + "&response_type=token";
    window.location.replace(oauthURL);
}

function parseInstagramAuthToken() {
    var currentURL = document.URL;
    var index = 0;
    var found = false;
    var token = "";
    var parameter = "";

    //-----------------------------------------------------------------------
    // The Instagram auth token will be the only parameter at the end of the
    // URL (e.g. http://mypage.com#access_token=someLongString)
    //-----------------------------------------------------------------------
    while ( !found && (index < currentURL.length) ) {
        found = ( '#' == currentURL[index] );
        index++;
    } // end while

    if (found && (index < currentURL.length) ) {
        parameter = currentURL.slice(index, currentURL.length);

        index = 0;
        found = false;

        while ( !found && (index < parameter.length) ) {
            found = ( '=' == parameter[index] );
            index++;
        } // end while

        if (found && (index < parameter.length) ) {
            token = parameter.slice(index, parameter.length);
        }
    }

    return token;
}

function getInstagramLocationMatches(lat, lng) {
    if (accessToken.length > 0) {

        var apiURL = "https://api.instagram.com/v1/locations/search"
                   + "?lat=" + lat
                   + "&lng=" + lng
                   + "&access_token=" + accessToken
                   + "&callback=?";
        $.getJSON(apiURL,processLocationPhotos);
        /*
        $.ajax("https://api.instagram.com/v1/locations/search",
            {
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                success: processLocationPhotos,
                data: {"lat": lat, "lng": lng, "access_token": token}
            }
        );
        */
    }
}

function processLocationPhotos(response) {
    console.log(response);

    instagramLocationMatch = response;
    instagramLocationIndex = 0;

/*
    var baseApiUrl = "https://api.instagram.com/v1/media/";
    var imgApiUrl;
    var location = $("#mapTitle>h2").text();
*/
    //$("#photos").detach();
    $("#photos").html("<p>Photos near " + $("#mapTitle>h2").text() + "</p>");
    //$("body").append($("#photos"));

    tryNextInstagramPhoto();
/*
    if (response.data.length > 0) {
        imgApiUrl = baseApiUrl + response.data[0].id
                  + "?access_token=" + accessToken + "&callback=?";
        $.getJSON(imgApiUrl, addPhotoToPage);
    }
*/
    /*
        for (var i = 0; i < response.data.length; i++) {
            console.log(" - response.data[" + i + "].id = " + response.data[i].id);
            console.log(" - response.data[" + i + "].name = " + response.data[i].name);

            imgApiUrl = baseApiUrl + response.data[i].id
                      + "?access_token=" + accessToken + "&callback=?";
            $.getJSON(imgApiUrl, addPhotoToPage);
        }
    */
}

function loadImage(imageData) {
    var apiURL = "https://api.instagram.com/v1/media/" + imageData.id
               + "?access_token=" + accessToken
               + "&callback=?";
    $.getJSON(apiURL,addPhotoToPage);
}

function tryNextInstagramPhoto() {
/*
    if ( (instagramLocationMatch.data.length > instagramLocationIndex)
          && (instagramLocationIndex < maxPhotosPerPage) ) {
*/
    if (instagramLocationMatch.data.length > instagramLocationIndex) {
        var baseApiUrl = "https://api.instagram.com/v1/media/";
        var imgApiUrl = baseApiUrl
                      + instagramLocationMatch.data[instagramLocationIndex].id
                      + "?access_token=" + accessToken + "&callback=?";
        $.getJSON(imgApiUrl, addPhotoToPage);
    }
/*
    else {
        $("#photos").append("<p>No matching photos found.</p>");
    }
*/
}

/*
 TODO Figure out why this method fails.  It gets called at least once with no response argument.
 */
function addPhotoToPage(response) {
    var thumbnailUrl;
    var fullSizedUrl;
    var imgHtml;
    var divHtml;

    if (response.meta.code == 200) {
        thumbnailUrl = response.data.images.thumbnail.url;
        fullSizedUrl = response.data.images.standard_resolution.url;
        imgHtml = '<a href="' + fullSizedUrl + '"><img src="' + thumbnailUrl + '" /></a>';
        divHtml = '<div class="photoResult">' + imgHtml + '</div>';

        $("#photos").append(divHtml);
    }

    instagramLocationIndex++;
    tryNextInstagramPhoto();
}
/*
function handleAuthResponse(response)
{
    console.log("Auth response: " + response);
}
*/
/*
The line of code below appeared in the Google example.  I replaced it with
the document.onload() call.

google.maps.event.addDomListener(window, 'load', initialize);
 */

$(document).ready(initialize);