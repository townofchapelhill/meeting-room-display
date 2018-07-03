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
var month;
var day_;
var month_;
var purpose;
        
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
	};

 setTimeout(function(){
      window.location.href = window.location.href;
  },(60000 * 30));

			today = new Date();
			month = today.getMonth() + 1;
			console.log(today.getMonth());
			console.log(today.getDate());
			time  = today.getTime(); //results in milliseconds
        //to be used for the meetings that have ended within the past thirty minutes or will end later
        minute = today.getMinutes() - 30;
		if(minute < 0) {
			minute = Math.abs(today.getMinutes()-30);
			minute = 60 - minute;
			hour = today.getHours() - 1;
			compare = hour + ":"  + minute;
		} else {
 		hour = today.getHours();
		compare = hour + ":" + minute;
		}
		//test case default
		//compare = "00:00";
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
				if(accessed[y] === false) {
                index = y;
				accessed[y] = true;
				break;
				} 
			}
        }
		
		if(jsonData.records[index].fields.date[1] === '/') {
			month_ = parseInt(jsonData.records[index].fields.date[0]);
			if(jsonData.records[index].fields.date[3] === '/') {
				day_ = parseInt(jsonData.records[index].fields.date[2]);
			} else if(jsonData.records[index].fields.date[4] === '/' ) {
				//handles the case that the day is in double digits
				day_ = parseInt(jsonData.records[index].fields.date.slice(2,4));
			}
		} else if(jsonData.records[index].fields.date[2] === '/') {
			//handles the case if the month is in the double digits
			month_ = parseInt(jsonData.records[index].fields.date.slice(0,2));
			 if(jsonData.records[index].fields.date[4] === '/') {
				day_ = parseInt(jsonData.records[index].fields.date[3]);
			} else if(jsonData.records[index].fields.date[5] === '/' ) {
				//handles the case that the day is in double digits
				day_ = parseInt(jsonData.records[index].fields.date.slice(3,5));
			}
		}
		
        if(parseInt(jsonData.records[index].fields.date.slice(4)) === today.getFullYear() && month_ === month && day_ === today.getDate() && jsonData.records[index].fields.end_time.localeCompare(compare) > 0) {
                    
                    if(jsonData.records[index].fields.organization !== null) {
                        org = jsonData.records[index].fields.organization;
                    } else {
                        org = "N/A";
                    }
                    if(jsonData.records[index].fields.start_time !== null) {
							start = jsonData.records[index].fields.start_time;
                    } else {
                        start = "N/A";
                    }
                    if(jsonData.records[index].fields.end_time !==null) {
						end = jsonData.records[index].fields.end_time;
                    } else {
                        end = "N/A";
                    }
                    if(jsonData.records[index].fields.space_name !==null) {
                        place = jsonData.records[index].fields.space_name;
                    } else {
                        start = "N/A";
                    }
					if(jsonData.records[index].fields.purpose !== null) {
						purpose = jsonData.records[index].fields.purpose;
					} else {
						purpose = "N/A";
					}
                    $(".table").append("<tr><td>" + org + "</td><td>" + start + "</td><td>" + end + "</td><td>" + place +  "</td><td>" + purpose + "</td></tr>");
                }
    } 
});
        }
		
		