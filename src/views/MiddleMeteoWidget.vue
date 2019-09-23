<template>
<v-card
    v-on="setStationName()"
    :width="width"
    :style="{ 'background-color': background, 'height':height}"
    :dark="isDark"
  >
    <v-simple-table dense   :style="{ 'background-color': background}">
    <thead>
    </thead>
    <tbody  >
      <tr>
        <td> <v-icon>mdi-map-marker</v-icon></td>
        <td>{{stationInfo.name}}</td>
        <td style="font-size: 8px !important"> prognoza </td>
      </tr>
      <tr>
        <td  style="font-size: 8px !important; width: 46px;">pomiar</td>
        <td style="font-size: 50%;">{{getLocalTime}}</td>
        <td v-if='utc' v-bind="setHistTime(utc)"><v-icon>{{WeatherIcon}} </v-icon><v-icon>{{WeatherArray}} </v-icon></td>
      </tr>
      <tr v-if='inArray("ta")'>
        <td> <v-icon>wi wi-thermometer</v-icon></td>
        <td v-show="meteo_desc">{{measurement.ta.description}}</td>
        <td>{{measurement.ta.value}}&deg;C</td>
      </tr>
      <tr v-if='inArray("p0")'>
        <td> <v-icon>wi wi-barometer</v-icon></td>
        <td v-show="meteo_desc">{{measurement.p0.description}}</td>
        <td>{{measurement.p0.value}} hPa</td>
      </tr>
      <tr v-if='inArray("ha")'>
        <td> <v-icon>wi wi-humidity</v-icon></td>
        <td v-show="meteo_desc">{{measurement.ha.description}}</td>
        <td>{{measurement.ha.value}}%</td>
      </tr>
      <tr v-if='inArray("t0")'>
        <td><v-icon>wi wi-thermometer</v-icon><v-icon>wi wi-raindrops</v-icon></td>
        <td v-show="meteo_desc">{{measurement.t0.description}}</td>
        <td>{{measurement.t0.value}}&deg;C</td>
      </tr>
      <tr v-if='inArray("r1")'>
        <td> <v-icon>wi wi-umbrella</v-icon></td>
        <td v-show="meteo_desc">{{measurement.r1.description}}</td>
        <td>{{measurement.r1.value}}mm/h</td>
      </tr>
      <tr v-if='inArray("ra")'>
        <td> <v-icon>wi wi-raindrops</v-icon></td>
        <td v-show="meteo_desc">{{measurement.ra.description}}</td>
        <td>{{measurement.ra.value}}mm</td>
      </tr>
      <tr v-if='fetchMeasurements && inArray("ws")'>
        <td> <v-icon>wi wi-wind {{deriveWindDir(measurement.wd.value)}} </v-icon></td>
        <td v-show="meteo_desc">{{measurement.ws.description}}</td>
        <td>{{measurement.ws.value}}m/s</td>
      </tr>
      <tr v-if='fetchMeasurements && inArray("wg")'>
        <td> <v-icon>wi wi-strong-wind</v-icon></td>
        <td v-show="meteo_desc">{{measurement.wg.description}}</td>
        <td>{{measurement.wg.value}}m/s</td>
      </tr>
      <tr v-if='inArray("h0")'>
        <td> <v-icon>landscape</v-icon></td>
        <td v-show="meteo_desc">{{measurement.h0.description}}</td>
        <td>{{measurement.h0.value}}m n.p.m</td>
      </tr>
    </tbody>
  </v-simple-table> 
  <div style="padding-bottom:10px"></div>
     
  </v-card>
</template>
<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import { setInterval } from 'timers';
import router from '@/router'
import { get } from 'http';
  
export default {
  data: () => ({
    meteo: null,
    meteo_desc: true,
    date: '',
    isDark: true,
    time: '',
    height: 300,
    width: 400,
    timer:'',
    parametersURL: null,
    background: '',
    hazardDescription: 'Warning',
    isDangerous: false,
    WeatherIcon: '',
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
  props: ['stationName'],
   computed: {
    ...mapState(['measurement','stationInfo','stations','utc','histPressObj']),
    setStyle(){
      var color = "background-color: "+this.background +";";
      var width = "width: " + this.width+ ";";
      return color + width;
    },
    getLocalTime(){
      let formattedTime = ''
      if(this.utc !== null){
      var utcDate = new Date(this.utc)
      utcDate.setHours( utcDate.getHours() +2 );
      formattedTime = utcDate.getFullYear() + "." + this.appendLeadingZeroes(utcDate.getMonth()+1) + "." + this.appendLeadingZeroes(utcDate.getDate()) + " " + this.appendLeadingZeroes(utcDate.getHours()) + ":" + this.appendLeadingZeroes(utcDate.getMinutes()) + ":" + this.appendLeadingZeroes(utcDate.getSeconds())
      }
      return formattedTime;
    },
    
  },
  methods: {
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
    inArray: function(param) {
      return this.parametersURL.indexOf(param) > -1 ? true : false;
    },
    ...mapActions(["loadMeasurements","loadStations","loadHistPressure"]),
    fetchMeasurements: function() {
      this.loadMeasurements(this.stationName);
    },
    fetchStations: function() {
      this.loadStations();
    },
    fetchPressures: function() {
     this.loadHistPressure(this.stationName);
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
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted () {
    this.fetchStations();
  },
  created: function() {
    var cycle = this.$route.query.i;
    this.parametersURL = this.$route.query.params.match(/.{1,2}/g);
    this.background = '#'+this.$route.query.background;
    var dark = this.$route.query.dark;
    if(dark === "true") this.isDark = true; else this.isDark = false;
    this.width = this.$route.query.width;
    if(this.stationName == null)
      this.stationName = this.getStationName;
    this.fetchMeasurements();
    this.fetchPressures();
    this.timer = setInterval(this.fetchMeasurements, cycle*60000)
  }
}

</script>
<style>
.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 1px !important;
}
.v-list-item__subtitle {
    overflow: auto;
    word-break: break-word;
    white-space: normal;
    word-wrap: unset;
}
.v-icon.v-icon {
  font-size: 18px;
}
.datetime{
  font-size: 70% !important;
}
td {
  text-align: center !important;
  padding: 0 10px !important;
  font-size: 11px !important;
  height: 32px !important;
  border-bottom: 0px solid hsla(0,0%,100%,.12) !important;
}
tr {
  background-color: unset !important;
}
table {
    border-bottom: 0px;
}
.v-sheet {
  border-radius: 0px;
}

</style>