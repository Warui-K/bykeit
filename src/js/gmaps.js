function generateURL() {
    var part1 = document.getElementById('pick-address').value;
    var part2 = document.getElementById('ship-address').value;
    var part7 = document.getElementById('distance').value;
    var part8 = document.getElementById('no_selection').value;
    var part9 = document.getElementById('sender-name').value;
    var part10 = document.getElementById('sender-contact').value;
    var part11 = document.getElementById('receiver-name').value;
    var part12 = document.getElementById('receiver-contact').value;
    var part13 = document.getElementById('instructions').value;
    window.open("https://wa.me/254705719718?text=" + "*Sender%20Name%3A*%20" + encodeURIComponent(part9) + "%0A*Sender%20Contact%3A*%20" + encodeURIComponent(part10) + "%0A*SENDER%20ADDRESS%3A*%20" + encodeURIComponent(part1) + "%0A%0A*Receiver%20Name%3A*%20" + encodeURIComponent(part11) + "%0A*Receiver%20Contact%3A*%20" + encodeURIComponent(part12) + "%0A*DELIVERY%20ADDRESS%3A*%20%20" + encodeURIComponent(part2) + "%0A%0A" + encodeURIComponent(part7) + "%0A*******************************" + "%0A_" + encodeURIComponent(part8) + "_%0A*******************************" + "%0A%0A*Additional%20Instructions%3A*%20" + encodeURIComponent(part13) + "%0A%0AI%20need%20a%20rider%20for%20this%20request.");
    return false;  
}

//Start of MAPS script
var infowindow;
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: {
            lat: -1.292077,
            lng: 36.821936
        },
        zoom: 14
    });
    infowindow = new google.maps.InfoWindow();
    new AutocompleteDirectionsHandler(map);
}
function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'DRIVING';
    var originInput = document.getElementById('pick-address');
    var destinationInput = document.getElementById('ship-address');
    var modeSelector = document.getElementById('mode-selector');
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsDisplay.setMap(map);
    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {
        placeIdOnly: true
    });
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {
        placeIdOnly: true
    });
    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    this.setupClickListener('changemode-driving', 'DRIVING');
    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
}
// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function (id, mode) {
    var radioButton = document.getElementById(id);
    var me = this;
    radioButton.addEventListener('click', function () {
        me.travelMode = mode;
        me.route();
    });
};
AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
        }
        if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
        } else {
            me.destinationPlaceId = place.place_id;
        }
        me.route();
    });
};
AutocompleteDirectionsHandler.prototype.route = function () {
    if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
    }
    var me = this;
    this.directionsService.route({
        origin: {
            'placeId': this.originPlaceId
        },
        destination: {
            'placeId': this.destinationPlaceId
        },
        travelMode: this.travelMode
    }, function (response, status) {
        if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
            var center = response.routes[0].overview_path[Math.floor(response.routes[0].overview_path.length / 2)];
            infowindow.setPosition(center);
            var dist = Math.round(response.routes[0].legs[0].distance.value / 1000);
            var costB = Math.round(Math.round(response.routes[0].legs[0].distance.value / 100) * 3.0);
            var costC = costB * 0.8;
            costC = (Math.round(costC / 10) * 10);
            costB = (Math.round(costB / 10) * 10);
            if (costB < 250) {
                costB = 250;
            }
            if (costC < 200) {
                costC = 200;
            }
            var priceB = "Express Delivery = Ksh " + costB;
            var first = document.getElementById("pick-address").value;
            var second = document.getElementById("ship-address").value;
            var textbox3 = document.getElementById('location_1');
            textbox3.value = first;
            var textbox4 = document.getElementById('location_2');
            textbox4.value = second;
            var textbox6 = document.getElementById('cost_B');
            textbox6.value = priceB;
            var textbox7 = document.getElementById('distance');
            textbox7.value = "Distance: " + dist + " KM";
            var textbox10 = document.getElementById('no_selection');
            textbox10.value = "Express Delivery @ Ksh " + costB;
            infowindow.setContent(response.routes[0].legs[0].distance.text);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
};
google.maps.event.addDomListener(window, "load", initMap);
//END OF MAPS SCRIPT