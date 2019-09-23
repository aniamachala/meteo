var selectedStation = 's000';
var  actualUtc = null;
var  actualP0 = null;
var WeatherIcon;
var WeatherArray;
var timeArray =  [
	{t1: null},
    {t2: null},
    {t3: null},
    {t4: null},
    {t5: null},
    {t6: null},
    {t7: null},
	{t8: null},
    {t9: null},
    {t10: null},
    {t11: null},
    {t12: null},
]
var press1= null;
var press2= null;
var press3= null;
var press4= null;
var press5= null;
var press6= null;
var press7= null;
var press8= null;
var press9= null;
var press10= null;
var press11= null;
var press12= null;

function timer(today){
		var day = today.getDate();
		var month = today.getMonth()+1;
		var year = today.getFullYear();
		var hours = today.getHours();
		if (hours<10) hours = "0"+hours;
		var minutes = today.getMinutes();
		if (minutes<10) minutes = "0"+minutes;
		var seconds = today.getSeconds();
		if (seconds<10) seconds = "0"+seconds;
		document.getElementById("timer").innerHTML = 
		 day+"/"+month+"/"+year+"  "+hours+":"+minutes+":"+seconds;
}

function getStatonName(){
	$.getJSON('http://mech.fis.agh.edu.pl/meteo/rest/json/info', function(dane) {
        var arrayOfObjects = eval(dane);
       // var station = arrayOfObjects[0];
	    var station = arrayOfObjects.find(el => el.station === selectedStation);
		var src = document.getElementById("station"); 
		$(".station").html(station.name);		
    });
}
getStatonName();
function setHistTime(actualUtc){
      timeArray.t1 = comupteTime(actualUtc, 30)
      timeArray.t2 = comupteTime(actualUtc, 60)
      timeArray.t3 = comupteTime(actualUtc, 90)
      timeArray.t4 = comupteTime(actualUtc, 120)
      timeArray.t5 = comupteTime(actualUtc, 150)
      timeArray.t6 = comupteTime(actualUtc, 180)
      timeArray.t7 = comupteTime(actualUtc, 210)
      timeArray.t8 = comupteTime(actualUtc, 240)
      timeArray.t9 = comupteTime(actualUtc, 270)
      timeArray.t10 = comupteTime(actualUtc, 300)
      timeArray.t11 = comupteTime(actualUtc, 330)
      timeArray.t12 = comupteTime(actualUtc, 360)
      setTimeout(findPressure , 5000); 
  }
  
function comupteTime(utc, diff){
    var actualUtc = new Date(utc);
    var histTime = actualUtc;
    var actualHours = histTime.getHours();
    var utcDate = null;
    if(actualHours >21){
      if(actualHours == 22) histTime.setHours( 0 );
      if(actualHours == 23) histTime.setHours( 1 );
      var temp = histTime;
      temp.setDate(temp.getDate()+1);
      utcDate = histTime.toJSON().slice(0,10);
    }
    else {
        histTime.setHours( actualHours +2 );
        histTime.setMinutes( histTime.getMinutes() - diff );
        utcDate = histTime.toJSON().slice(0,10);
    }
      histTime = histTime.toJSON().slice(11,15);
    return utcDate+ " "+histTime;
}

function findPressure(){
	var utc = actualUtc.slice(0,10);
	$.getJSON('http://mech.fis.agh.edu.pl/meteo/rest/json/pres0/'+selectedStation+'/'+utc, function(dane) {
    var histPressObj = eval(dane);
	try{
      var press1a =histPressObj.find(el => el.utc.includes(timeArray.t1));
      var press2a =histPressObj.find(el => el.utc.includes(timeArray.t2));
      var press3a =histPressObj.find(el => el.utc.includes(timeArray.t3));
      var press4a =histPressObj.find(el => el.utc.includes(timeArray.t4));
      var press5a =histPressObj.find(el => el.utc.includes(timeArray.t5));
      var press6a =histPressObj.find(el => el.utc.includes(timeArray.t6));
      var press7a =histPressObj.find(el => el.utc.includes(timeArray.t7));
      var press8a =histPressObj.find(el => el.utc.includes(timeArray.t8));
      var press9a =histPressObj.find(el => el.utc.includes(timeArray.t9));
      var press10a =histPressObj.find(el => el.utc.includes(timeArray.t10));
      var press11a =histPressObj.find(el => el.utc.includes(timeArray.t11));
      var press12a =histPressObj.find(el => el.utc.includes(timeArray.t12));
      press1 = Number(press1a.data.p0);
      press2 = Number(press2a.data.p0);
      press3 = Number(press3a.data.p0);
      press4 = Number(press4a.data.p0);
      press5 = Number(press5a.data.p0);
      press6 = Number(press6a.data.p0);
      press7 = Number(press7a.data.p0);
      press8 = Number(press8a.data.p0);
      press9 = Number(press9a.data.p0);
      press10 = Number(press10a.data.p0);
      press11 = Number(press11a.data.p0);
      press12 = Number(press12a.data.p0);
      press0 = Number(actualP0);
    }catch(e) {
		console.log(e);
	}
    setTimeout(() => weather(press0,press1,press2,press3,press4,press5,press6,press7,press8,press9,press10,press11,press12), 2000);
    });
}

function weather(press0,press1,press2,press3,press4,press5,press6,press7,press8,press9,press10,press11,press12){
	pressurerdiff1 = (press0 - press1)*2
	pressurerdiff2 = (press0 - press2)
	pressurerdiff3 = (press0 - press3)/1.5
	pressurerdiff4 = (press0 - press4)/2
	pressurerdiff5 = (press0 - press5)/2.5
	pressurerdiff6 = (press0 - press6)/3
	pressurerdiff7 = (press0 - press7)/3.5
	pressurerdiff8 = (press0 - press8)/4
	pressurerdiff9 = (press0 - press9)/4.5
	pressurerdiff10 = (press0 - press10)/5
	pressurerdiff11 = (press0 - press11)/5.5
	pressurerdiff12 = (press0 - press12)/6
	pressurerdiff = (pressurerdiff1 + pressurerdiff2 + pressurerdiff3 + pressurerdiff4 + pressurerdiff5 + pressurerdiff6 + pressurerdiff7 + pressurerdiff8 + pressurerdiff9 + pressurerdiff10 + pressurerdiff11 + pressurerdiff12)/12
	currentpress = press0;
	if (pressurerdiff > 0.75){
		WeatherIcon = 'wi wi-day-sleet-storm';
		WeatherArray = 'wi wi-direction-up';
	}
	else if (pressurerdiff > 0.42){
		WeatherIcon = 'wi wi-day-sunny';
		WeatherArray = 'wi wi-direction-up-right';
	}
	else if (pressurerdiff > 0.25){
		WeatherArray = 'wi wi-direction-up-right';
		if ((currentpress >= 1006 && currentpress <= 1020) || currentpress < 1006)
			WeatherIcon = 'wi wi-day-cloudy';
	}
	else if (pressurerdiff < -0.75){
		WeatherIcon = 'wi wi-storm-showers';
		WeatherArray = 'wi wi-direction-down';
	}
	else if (pressurerdiff < -0.42){
		WeatherIcon = 'wi wi-showers';
		WeatherArray = 'wi wi-direction-down-right';
	}
	else if (pressurerdiff < -0.25){
			WeatherArray = 'wi wi-direction-down-right';
		if ((currentpress >= 1006 && currentpress <= 1020) || currentpress > 1020)
			WeatherIcon = 'wi wi-day-cloudy';
	}
	else if (pressurerdiff <= 0.25 && pressurerdiff >= -0.25)
		WeatherArray = 'wi wi-direction-right';	
	document.getElementById("weatherArray").className = WeatherArray;
	document.getElementById("weatherIcon").className = WeatherIcon;
}

function getMeasurements(){
    $.getJSON('http://mech.fis.agh.edu.pl/meteo/rest/json/last/'+selectedStation, function(dane) {
        var arrayOfObjects = eval(dane);
        var jsonKey = arrayOfObjects[0];
		var time = jsonKey.utc;
		var myDate = new Date(time);
		var hours = myDate.getHours();
		myDate.setHours(hours+2);
		timer(myDate);
		actualUtc = jsonKey.utc;
		var temperature = jsonKey.data.ta;
		var ta = temperature+ "&deg;C"
		actualP0 = jsonKey.data.p0;
		var p0 = actualP0 + " hPa";
		var ha = jsonKey.data.ha + "%";
		var t0 = jsonKey.data.t0 + "&deg;C";
		var r1 = jsonKey.data.r1+ " mm/h";
		var rain = jsonKey.data.ra;
		var ra = rain + " mm";
		var windSpeed = jsonKey.data.ws;
		var ws = windSpeed + " m/s";
		var wd = jsonKey.data.wd;
		var wg = jsonKey.data.wg + " m/s";
		var h0 = jsonKey.data.h0 + "m n.p.m.";
		$(".temperature").html(ta);
		$(".pressure").html(p0);
		$(".humidity").html(ha);
		$(".devPoint").html(t0);
		$(".rain").html(ra);
		$(".rainLastHour").html(r1);
		$(".windSpeed").html(ws);
		$(".windTemp").html(wg);
		$(".height").html(h0);
		var wind = deriveWindDir(wd);
		var warning = CheckWeatherHazards(temperature, windSpeed,rain) 
		$(".windDir").html(wind.direction);
		document.getElementById("changeIcon").className = wind.icon;
		document.getElementById("changeDangerIcon").className = warning.icon;
		$(".warningDescription").html(warning.description);
		setHistTime(actualUtc);
    });
	setTimeout("getMeasurements()",600000);
    }
	
function deriveWindDir(windDir) {
      var wind_directions_array = [
        { minVal: 0, maxVal: 30, direction: 'N', icon: 'wi wi-wind wi-towards-n'},
        { minVal: 31, maxVal: 45, direction: 'NNE', icon: 'wi wi-wind wi-towards-nne' },
        { minVal: 46, maxVal: 75, direction: 'NE', icon: 'wi wi-wind wi-towards-ne' },
        { minVal: 76, maxVal: 90, direction: 'ENE', icon: 'wi wi-wind wi-towards-ene' },
        { minVal: 91, maxVal: 120, direction: 'E', icon: 'wi wi-wind wi-towards-e' },
        { minVal: 121, maxVal: 135, direction: 'ESE', icon: 'wi wi-wind wi-towards-ese' },
        { minVal: 136, maxVal: 165, direction: 'SE', icon: 'wi wi-wind wi-towards-se' },
        { minVal: 166, maxVal: 180, direction: 'SSE', icon: 'wi wi-wind wi-towards-sse' },
        { minVal: 181, maxVal: 210, direction: 'S', icon: 'wi wi-wind wi-towards-s' },
        { minVal: 211, maxVal: 225, direction: 'SSW', icon: 'wi wi-wind wi-towards-ssw' },
        { minVal: 226, maxVal: 255, direction: 'SW', icon: 'wi wi-wind wi-towards-sw' },
        { minVal: 256, maxVal: 270, direction: 'WSW', icon: 'wi wi-wind wi-towards-wsw' },
        { minVal: 271, maxVal: 300, direction: 'W', icon: 'wi wi-wind wi-towards-w' },
        { minVal: 301, maxVal: 315, direction: 'WNW', icon: 'wi wi-wind wi-towards-wnw' },
        { minVal: 316, maxVal: 345, direction: 'NW', icon: 'wi wi-wind wi-towards-nw' },
        { minVal: 346, maxVal: 360, direction: 'NNW', icon: 'wi wi-wind wi-towards-nnw' }
      ];
      var wind = {direction: '', icon: ''};
      for (var i = 0; i < wind_directions_array.length; i++) {
        if (
          windDir >= wind_directions_array[i].minVal &&
          windDir <= wind_directions_array[i].maxVal
        ) {
          wind.icon = wind_directions_array[i].icon;
		  wind.direction = wind_directions_array[i].direction;
        }
      }
      return wind;
}
function CheckWeatherHazards(temperature,wind,rain) {
      var weatherHazardsArray = [
        { minTemp: -15, icon: 'fas fa-exclamation-triangle', warning: 'Niska temperatura'},
		{ maxTemp: 30, icon: 'fas fa-exclamation-triangle', warning: 'Wysoka temperatura'},
		{ maxWind: 15, icon: 'fas fa-exclamation-triangle', warning: 'Duży wiatr'},
		{ maxRain: 30, icon: 'fas fa-exclamation-triangle', warning: 'Intensywne opady'},
      ];
      var hazards = {icon: '', description:''};
      for (var i = 0; i < weatherHazardsArray.length; i++) {
        if (temperature >= weatherHazardsArray[i].maxTemp){ hazards.icon = weatherHazardsArray[i].icon; hazards.description = weatherHazardsArray[i].warning}
		else if (temperature <= weatherHazardsArray[i].minTemp){ hazards.icon = weatherHazardsArray[i].icon; hazards.description = weatherHazardsArray[i].warning}
		if (wind >= weatherHazardsArray[i].maxWind){ hazards.icon = weatherHazardsArray[i].icon; hazards.description = weatherHazardsArray[i].warning}
		if (rain >= weatherHazardsArray[i].maxRain){ hazards.icon = weatherHazardsArray[i].icon; hazards.description = weatherHazardsArray[i].warning}
      }
      return hazards;
}