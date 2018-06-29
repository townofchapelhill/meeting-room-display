var today;
var minute;
var hour;
var compare;
var org;
var start;
var end;
var place;
var start_time = [];
var time;
        
    $(document).ready( function() {
		
tday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");

function GetClock(){
var d=new Date();
var nday=d.getDay(),nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getFullYear();
var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;

if(nhour==0){ap=" AM";nhour=12;}
else if(nhour<12){ap=" AM";}
else if(nhour==12){ap=" PM";}
else if(nhour>12){ap=" PM";nhour-=12;}

if(nmin<=9) nmin="0"+nmin;
if(nsec<=9) nsec="0"+nsec;

document.getElementById('clockbox').innerHTML=""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"";
}

window.onload=function(){
GetClock();
setInterval(GetClock,1000);
}

			today = new Date(2018, 06, 25);
			time  = today.getTime(); //results in milliseconds
        //to be used for the meetings that ended within the past thirty minutes or later
        minute = today.getMinutes() - 30;
		if(minute < 0) {
			minute = Math.abs(today.getMinutes()-30);
			minute = 60 - minute;
			hour = today.getHours() - 1;
			compare = hour + ":"  + minute;
		}
 		hour = today.getHours();
		//test compare time for the test data, when dealig with other data this should be placed inside an else block 
		compare = "00:00";
		
        updatePage(); 
		});
    
    function updatePage() {
   $.ajaxSetup({
        headers : {
           'Authorization' : 'Basic bWhhbHZvcnNlbjk4QGdtYWlsLmNvbTpCb295YWg5ODE2MjA='
        }
    });
$.getJSON("https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=meeting-room-test-data" ,  function (jsonData)  {
     var count = 0;
    $.each(jsonData.records, function (object, objectData) {

        start_time[count] = objectData.fields.start_time.slice(11,16);
        //console.log(start_time[count]);
        count++;
        if(count == jsonData.records.length) {
            start_time.sort();
        }
		
		
    });
    
    
    var index;
	var accessed = [];
	for(var x = 0; x < start_time.length; x++) {
		accessed[x] = false;
	}
	
    for(var  i = 0; i < start_time.length; i++) {
        for(var y = 0; y < jsonData.records.length; y++) {
            if(jsonData.records[y].fields.start_time.slice(11,16) == start_time[i]) {
				console.log("test");
				if(accessed[y] === false) {
                index = y;
				console.log(y);
				accessed[y] = true;
				break;
				} 
			}
        }
        
        if(parseInt(jsonData.records[index].fields.date.slice(0,4)) === today.getFullYear() && parseInt(jsonData.records[index].fields.date.slice(5,7)) === today.getMonth()
                   && parseInt(jsonData.records[index].fields.date.slice(8)) === today.getDate() && jsonData.records[index].fields.end_time.slice(11,16).localeCompare(compare) > 0) {
                    
                    if(jsonData.records[index].fields.organization !== null) {
                        org = jsonData.records[index].fields.organization;
                    } else {
                        org = "N/A";
                    }
                    if(jsonData.records[index].fields.start_time !== null) {
						if(parseInt(jsonData.records[index].fields.start_time.slice(11,13)) > 12) {
							//handling the military time
							start = parseInt(jsonData.records[index].fields.start_time.slice(11,13)) - 12;
							start = start + ":" + jsonData.records[index].fields.start_time.slice(14,16) + "pm";
						} else {
                        start = jsonData.records[index].fields.start_time.slice(11,16) + "am";
						}
                    } else {
                        start = "N/A";
                    }
                    if(jsonData.records[index].fields.end_time !==null) {
                        if(parseInt(jsonData.records[index].fields.end_time.slice(11,13)) > 12) {
							//handling the military time
							end = parseInt(jsonData.records[index].fields.end_time.slice(11,13)) - 12;
							end = end + ":" + jsonData.records[index].fields.end_time.slice(14,16) + "pm";
						} else {
                        end = jsonData.records[index].fields.end_time.slice(11,16) + "am";
						}
                    } else {
                        end = "N/A";
                    }
                    if(jsonData.records[index].fields.space_name !==null) {
                        place = jsonData.records[index].fields.space_name;
                    } else {
                        start = "N/A";
                    }
                    $(".table").append("<tr><td>" + org + "</td><td>" + start + "</td><td>" + end + "</td><td>" + place +  "</td></tr>");
                }
    } 
    
    
 /* $.each(jsonData.records, function (object, objectData) {
    console.log(objectData.fields.date);
                if(parseInt(objectData.fields.date.slice(0,4)) === today.getFullYear() && parseInt(objectData.fields.date.slice(5,7)) === today.getMonth()
                   && parseInt(objectData.fields.date.slice(8)) === today.getDate() && parseInt(objectData.fields.end_time.slice(15,17)) > minutes) {
                    
                    if(objectData.fields.organization !== null && isNaN(objectData)) {
                        org = objectData.fields.organization;
                    } else {
                        org = "N/A";
                    }
                    if(objectData.fields.start_time !== null && isNaN(objectData)) {
						if(parseInt(objectData.fields.start_time.slice(11,13)) > 12) {
							//handling the military time
							start = parseInt(objectData.fields.start_time.slice(11,13)) - 12;
							start = start + ":" + objectData.fields.start_time.slice(14,16);
						} else {
                        start = objectData.fields.start_time.slice(11,16);
						}
						
                    } else {
                        start = "N/A";
                    }
                    if(objectData.fields.end_time && isNaN(objectData)) {
                        end = objectData.fields.end_time.slice(11,16);
                    } else {
                        start = "N/A";
                    }
                    if(objectData.fields.space_name && isNaN(objectData)) {
                        //location = objectData.fields.space_name;
                    } else {
                        start = "N/A";
                    }
                    $(".table").append("<tr><td>" + org + "</td><td>" + start + "</td><td>" + end + "</td></tr>");
                }
            });*/
 //reloading the page automatically every 30 minutes
setInterval(function() {
                  window.location.reload();
                }, (60000 * 30)); 
});

		
        }
		
		