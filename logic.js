$(document).ready(function getDate() {
    const prettyDate = moment().format('MMMM DD, YYYY');
    $("#header").append("<h3 id='title'>Meetings & Events for: " + prettyDate + "</h3>");
    getReservations();


    function Reservation(time, orgName, desc, location, pubPriv, sorter) {
        this.duration = time,
        this.organization = orgName,
        this.description = desc,
        this.location = location,
        this.public = pubPriv,
        this.num = sorter
    };

    function getReservations() {
        const apiDate = moment().format('MM%2FDD%2FYYYY')
        const apiQuery = "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=new_reservations&rows=25&facet=startdate&facet=enddate&facet=location&refine.startdate=" + apiDate + "&timezone=America%2FNew_York";

        $.ajax({
            url: apiQuery,
            method: "GET"
        }).done(function(response) {
            const reservationData = [];

            for(var i = 0; i < response.records.length; i++) {
                if (response.records[i].fields.description.includes('placeholder') || response.records[i].fields.description.includes('(placeholder)')) { 
                    continue;
                } else if (response.records[i].fields.location === "Meeting Room B") {
                    reservationData.push(response.records[i].fields);
                } else if (response.records[i].fields.location === "Meeting Room C") {
                    reservationData.push(response.records[i].fields);
                } else if (response.records[i].fields.location === "Meeting Room D") {
                    reservationData.push(response.records[i].fields);
                } else if (response.records[i].fields.location === "Meeting Room A") {
                    reservationData.push(response.records[i].fields);
                } else {
                    continue
                }
            };
            parseData(reservationData);
        });
    };

    function parseData(reservations) {
        const objReservations = [];

        for (i = 0; i < reservations.length; i++) {
            let sorter = reservations[i].startdate.slice(11, 13);
            let parseStart = reservations[i].startdate.split("T");
            let dblParseStart = parseStart[1].split("-");
            const startTime = moment(dblParseStart[0], "HH:mm:ss").format("h:mm a");

            let parseEnd = reservations[i].enddate.split("T");
            let dblParseEnd = parseEnd[1].split("-");
            const endTime = moment(dblParseEnd[0], "HH:mm:ss").format("h:mm a");

            const formattedTime = startTime + "-" + endTime;

            var newRes = new Reservation(formattedTime, '', reservations[i].description, reservations[i].location, '', sorter);
            objReservations.push(newRes);
        };

        objReservations.sort(function(a, b) {
            let a1 = a.num;
            let b1 = b.num;
            if (a1 === b1) {
                return 0;
            }
            return a1 > b1 ? 1 : -1;
        });

        populateTable(objReservations);
    };

    function populateTable(reservations) {
        for (i = 0; i < reservations.length; i++) {
            $('#table').append("<tr class='table-row'> <td class='table-section'>" + reservations[i].duration + "</td> <td class='table-section'>" + reservations[i].organization + "</td> <td class='table-section'>" + reservations[i].description + "</td> <td class='table-section'>" + reservations[i].location + "</td> <td class='table-section'>" + reservations[i].public + "</td> </tr>");
        };
    };

});