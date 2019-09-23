<template>
<v-card
    :width="width"
    :style="{ 'background-color': background }"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline" v-bind="setStationName()"><v-icon>mdi-map-marker</v-icon>{{stationInfo.name}}</v-list-item-title>
        <v-list-item-subtitle class="datetime">pomiar: {{getLocalTime}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-card-text v-if='inArray("ta")'>
      <v-row align="center">
        <v-col class="display-1"  >
          <i class="wi wi-thermometer"></i> {{measurement.ta.value}}&deg;C
        <i :class="WeatherIcon" style="padding-right: 5px;padding-left: 45px;"> </i><i :class="WeatherArray"></i>
        </v-col>
      </v-row>
    </v-card-text>
    
    <v-list-item v-if='inArray("p0")'>
      <v-list-item-icon>
        <v-icon>wi wi-barometer</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{measurement.p0.description}}</v-list-item-subtitle>
      <v-list-item-subtitle >{{measurement.p0.value}} hPa</v-list-item-subtitle>
    </v-list-item>

    <v-list-item v-if='inArray("ha")'>
      <v-list-item-icon>
        <v-icon>wi wi-humidity</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{measurement.ha.description}}</v-list-item-subtitle>
      <v-list-item-subtitle>{{measurement.ha.value}}%</v-list-item-subtitle>
    </v-list-item>

    <v-list-item v-if='inArray("ra")'>
      <v-list-item-icon>
        <v-icon>wi wi-umbrella</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{measurement.ra.description}}</v-list-item-subtitle>
      <v-list-item-subtitle>{{measurement.ra.value}}mm</v-list-item-subtitle>
    </v-list-item>

    <v-list-item v-if='inArray("r1")'>
      <v-list-item-icon>
        <v-icon>wi wi-raindrops</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{measurement.r1.description}}</v-list-item-subtitle>
      <v-list-item-subtitle>{{measurement.r1.value}}mm</v-list-item-subtitle>
    </v-list-item>

    <v-list-item v-if='fetchMeasurements && inArray("ws")'>
      <v-list-item-icon>
        <v-icon>wi wi-wind {{deriveWindDir(measurement.wd.value)}} </v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{measurement.ws.description}}</v-list-item-subtitle>
       <v-list-item-subtitle>{{measurement.ws.value}}m/s</v-list-item-subtitle>
    </v-list-item>

    <v-list-item v-if='inArray("wg")'>
      <v-list-item-icon>
        <v-icon>wi wi-strong-wind</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{measurement.wg.description}}</v-list-item-subtitle>
       <v-list-item-subtitle>{{measurement.wg.value}}m/s</v-list-item-subtitle>
    </v-list-item>

    <v-list-item v-if='inArray("t0")'>
      <v-list-item-icon>
        <v-icon>wi wi-thermometer</v-icon>
        <v-icon>wi wi-raindrops</v-icon>
        </v-list-item-icon>
      
      <v-list-item-subtitle>{{measurement.t0.description}}</v-list-item-subtitle>
       <v-list-item-subtitle>{{measurement.t0.value}}&deg;C</v-list-item-subtitle>
    </v-list-item>

    <v-list-item v-if='inArray("h0")'>
      <v-list-item-icon>
        <v-icon>landscape</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{measurement.h0.description}}</v-list-item-subtitle>
       <v-list-item-subtitle>{{measurement.h0.value}}m n.p.m</v-list-item-subtitle>
    </v-list-item>
  </v-card>
</template>
<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import { setInterval } from 'timers';
import router from '@/router'
  
export default {
  data: () => ({
    meteo: null,
    meteo_desc: true,
    date: '',
    time: '',
    height: 300,
    width: 400,
    timer:'',
    parametersURL: null,
    background: '',
    formattedTime: null,
    hazardDescription: null,
    isDangerous: false,
    WeatherIcon:  '',
    WeatherArray: '',
    weatherHazardsArray:{
          minTemp: {value:-15, warning: 'Ostrzeżenie: Mróz'},
		  maxTemp: {value:30,  warning: 'Ostrzeżenie: Upał'},
		  maxWind: {value:15,  warning: 'Ostrzeżenie: Silny wiatr'},
		  maxRain: {value:30,  warning: 'Ostrzeżenie: Intensywne opady deszczu'},
      },
    timeArray: [
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
    ],
    press1: null,
    press2: null,
    press3: null,
    press4: null,
    press5: null,
    press6: null,
    press7: null,
    press8: null,
    press9: null,
    press10: null,
    press11: null,
    press12: null,
  }),
  props: ["stationName"],
  computed: {
    ...mapState(['measurement','stationInfo','stations','utc','histPressObj']),
    setStyle(){
      var color = "background-color: "+this.background +";";
      var width = "width: " + this.width+ ";";
      return color + width;
    },
    getLocalTime(){
      if(this.utc !== null){
      var utcDate = new Date(this.utc)
      utcDate.setHours( utcDate.getHours() +2 );
      this.formattedTime = utcDate.getFullYear() + "." + this.appendLeadingZeroes(utcDate.getMonth()+1) + "." + this.appendLeadingZeroes(utcDate.getDate()) + " " + this.appendLeadingZeroes(utcDate.getHours()) + ":" + this.appendLeadingZeroes(utcDate.getMinutes()) + ":" + this.appendLeadingZeroes(utcDate.getSeconds())
      }
      return this.formattedTime;
    },
  },
  methods: {
    inArray: function(param) {
      return this.parametersURL.indexOf(param) > -1 ? true : false;
    },
    CheckWeatherHazards: function(temperature,rain,wind) {
        var temperatureNum = Number(temperature);
        var rainNum = Number(rain);
        var windNum = Number(wind);
        if (temperature >= this.weatherHazardsArray.maxTemp.value){ 
            this.hazardDescription = this.weatherHazardsArray.maxTemp.warning;
            this.isDangerous = true;
        }
        else if (temperature < this.weatherHazardsArray.minTemp.value){ 
          this.hazardDescription = this.weatherHazardsArray.minTemp.warning;
          this.isDangerous = true;
        }
        else {
            this.isDangerous = false;
            this.hazardDescription = null;
        }
        return this.isDangerous;
  },
    appendLeadingZeroes: function(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
    },
     findPress0: function() {
      try{
      var press1 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t1));
      var press2 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t2));
      var press3 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t3));
      var press4 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t4));
      var press5 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t5));
      var press6 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t6));
      var press7 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t7));
      var press8 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t8));
      var press9 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t9));
      var press10 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t10));
      var press11 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t11));
      var press12 =this.histPressObj.find(el => el.utc.includes(this.timeArray.t12));
      this.press1 = Number(press1.data.p0);
      this.press2 = Number(press2.data.p0);
      this.press3 = Number(press3.data.p0);
      this.press4 = Number(press4.data.p0);
      this.press5 = Number(press5.data.p0);
      this.press6 = Number(press6.data.p0);
      this.press7 = Number(press7.data.p0);
      this.press8 = Number(press8.data.p0);
      this.press9 = Number(press9.data.p0);
      this.press10 = Number(press10.data.p0);
      this.press11 = Number(press11.data.p0);
      this.press12 = Number(press12.data.p0);
      this.press0 = Number(this.measurement.p0.value);
      }catch(e) {console.log(e);
      }
      setTimeout(() => this.weather(this.press0,this.press1,this.press2,this.press3,this.press4,this.press5,this.press6,this.press7,this.press8,this.press9,this.press10,this.press11,this.press12)
    , 2000);
      },
    setHistTime(actualUtc){
      this.timeArray.t1 = this.comupteTime(actualUtc, 30)
      this.timeArray.t2 = this.comupteTime(actualUtc, 60)
      this.timeArray.t3 = this.comupteTime(actualUtc, 90)
      this.timeArray.t4 = this.comupteTime(actualUtc, 120)
      this.timeArray.t5 = this.comupteTime(actualUtc, 150)
      this.timeArray.t6 = this.comupteTime(actualUtc, 180)
      this.timeArray.t7 = this.comupteTime(actualUtc, 210)
      this.timeArray.t8 = this.comupteTime(actualUtc, 240)
      this.timeArray.t9 = this.comupteTime(actualUtc, 270)
      this.timeArray.t10 = this.comupteTime(actualUtc, 300)
      this.timeArray.t11 = this.comupteTime(actualUtc, 330)
      this.timeArray.t12 = this.comupteTime(actualUtc, 360)
      console.log(actualUtc)
      setTimeout(this.findPress0 , 5000); 
  },
    ...mapActions(["loadMeasurements","loadStations","loadHistPressure"]),
    fetchMeasurements: function() {
      this.loadMeasurements(this.stationName);
    },
    fetchStations: function() {
      this.loadStations();
    },
    fetchPressures: function() {
      this.loadHistPressure(this.stationName,this.utc);
    },
    setStationName: function(){
      this.$store.commit("setStationDetails", this.stations.find(s => s.station == this.stationName))
    },
    deriveWindDir: function(windDir) {
      var wind_directions_array = [
        { minVal: 0, maxVal: 30, direction: 'N', icon: 'wi-towards-n'},
        { minVal: 31, maxVal: 45, direction: 'NNE', icon: 'wi-towards-nne' },
        { minVal: 46, maxVal: 75, direction: 'NE', icon: 'wi-towards-ne' },
        { minVal: 76, maxVal: 90, direction: 'ENE', icon: 'wi-towards-ene' },
        { minVal: 91, maxVal: 120, direction: 'E', icon: 'wi-towards-e' },
        { minVal: 121, maxVal: 135, direction: 'ESE', icon: 'wi-towards-ese' },
        { minVal: 136, maxVal: 165, direction: 'SE', icon: 'wi-towards-se' },
        { minVal: 166, maxVal: 180, direction: 'SSE', icon: 'wi-towards-sse' },
        { minVal: 181, maxVal: 210, direction: 'S', icon: 'wi-towards-s' },
        { minVal: 211, maxVal: 225, direction: 'SSW', icon: 'wi-towards-ssw' },
        { minVal: 226, maxVal: 255, direction: 'SW', icon: 'wi-towards-sw' },
        { minVal: 256, maxVal: 270, direction: 'WSW', icon: 'wi-towards-wsw' },
        { minVal: 271, maxVal: 300, direction: 'W', icon: 'wi-towards-w' },
        { minVal: 301, maxVal: 315, direction: 'WNW', icon: 'wi-towards-wnw' },
        { minVal: 316, maxVal: 345, direction: 'NW', icon: 'wi-towards-nw' },
        { minVal: 346, maxVal: 360, direction: 'NNW', icon: 'wi-towards-nnw' }
      ];
      var wind_direction_icon = '';
      for (var i = 0; i < wind_directions_array.length; i++) {
        if (
          windDir >= wind_directions_array[i].minVal &&
          windDir <= wind_directions_array[i].maxVal
        ) {
          wind_direction_icon = wind_directions_array[i].icon;
        }
      }
      return wind_direction_icon;
    },
  comupteTime: function(utc, diff){
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
  },

  weather: function(press0,press1,press2,press3,press4,press5,press6,press7,press8,press9,press10,press11,press12){
      var pressurerdiff1 = (press0 - press1)*2
      var pressurerdiff2 = (press0 - press2)
      var pressurerdiff3 = (press0 - press3)/1.5
      var pressurerdiff4 = (press0 - press4)/2
      var pressurerdiff5 = (press0 - press5)/2.5
      var pressurerdiff6 = (press0 - press6)/3
      var pressurerdiff7 = (press0 - press7)/3.5
      var pressurerdiff8 = (press0 - press8)/4
      var pressurerdiff9 = (press0 - press9)/4.5
      var pressurerdiff10 = (press0 - press10)/5
      var pressurerdiff11 = (press0 - press11)/5.5
      var pressurerdiff12 = (press0 - press12)/6
      var pressurerdiff = (pressurerdiff1 + pressurerdiff2 + pressurerdiff3 + pressurerdiff4 + pressurerdiff5 + pressurerdiff6 + pressurerdiff7 + pressurerdiff8 + pressurerdiff9 + pressurerdiff10 + pressurerdiff11 + pressurerdiff12)/12;
      var currentpress = press0;
      if (pressurerdiff > 0.75){
        this.WeatherIcon = 'wi wi-day-sleet-storm';
        this.WeatherArray = 'wi wi-direction-up';
      }
      else if (pressurerdiff > 0.42){
        this.WeatherIcon = 'wi wi-day-sunny';
        this.WeatherArray = 'wi wi-direction-up-right';
      }
      else if (pressurerdiff > 0.25){
        this.WeatherIcon = 'wi wi-day-sunny';
        this.WeatherArray = 'wi wi-direction-up-right';
      if ((currentpress >= 1006 && currentpress <= 1020) || currentpress < 1006)
          this.WeatherIcon = 'wi wi-day-cloudy';
      }
      else if (pressurerdiff < -0.75){
        this.WeatherIcon = 'wi wi-storm-showers';
        this.WeatherArray = 'wi wi-direction-down';
      }
      else if (pressurerdiff < -0.42){
        this.WeatherIcon = 'wi wi-showers';
        this.WeatherArray = 'wi wi-direction-down-right';
      }
      else if (pressurerdiff < -0.25){
          this.WeatherArray = 'wi wi-direction-down-right';
        if ((currentpress >= 1006 && currentpress <= 1020) || currentpress > 1020)
          this.WeatherIcon = 'wi wi-day-cloudy';
      }
      else if (pressurerdiff <= 0.25 && pressurerdiff >= -0.25){
        this.WeatherArray = 'wi wi-direction-right';
      if (((currentpress >= 1006 && currentpress <= 1020) || currentpress > 1020) && this.WeatherIcon =='')
          this.WeatherIcon = 'wi wi-day-cloudy';}
  },
    cancelAutoUpdate: function() { 
      clearInterval(this.timer) 
    }
  },
  watch:{
    WeatherIcon(newIcon) {
      localStorage.WeatherIcon = newIcon;
      },
    WeatherArray(newArray) {
      localStorage.WeatherArray = newArray;
      },
    utc(newUtc) {
      localStorage.utc = newUtc;
      },
    utc(newUtc) {
      localStorage.formattedTime = newUtc;
      },
      
    },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted () {
    this.fetchStations();
    if(localStorage.WeatherIcon) this.WeatherIcon = localStorage.WeatherIcon;
    if(localStorage.utc) this.utc = localStorage.utc;
    if(localStorage.formattedTime) this.formattedTime = localStorage.formattedTime;
    if(localStorage.WeatherArray) this.WeatherArray = localStorage.WeatherArray;
  },
  created: function() {
    var cycle = this.$route.query.i;
    this.parametersURL = this.$route.query.params.match(/.{1,2}/g);
    this.background = '#'+this.$route.query.background;
    this.width = this.$route.query.width;
    if(this.stationName == null)
      this.stationName = this.getStationName;
    this.fetchMeasurements();
    this.timer = setInterval(this.fetchMeasurements, cycle*60000)
    this.fetchPressures();
  }
}

</script>
<style>
.datetime{
  text-align: left !important;
}
.v-icon.v-icon {
  font-size: 18px !important;
}
.v-card__text {
  padding: 0px 16px;
}
.theme--light.v-list-item .v-list-item__action-text, .theme--light.v-list-item .v-list-item__subtitle {
    white-space: normal !important;
    word-wrap: break-word;
    text-align: center;
}

</style>