import Vue from 'vue';
import Vuex from 'vuex';
import AxiosModule from "@/AxiosModule.js"
import axios from 'axios'
import VuexPersist from 'vuex-persist'
Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'my-app',
  storage: window.localStorage
})
export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    stations: [],
    stationInfo: {
      lati: null,
      long: null,
      name: null,
      station: null
    },
    measurements: [],
    utc: null,
    measurement: {
      p0: {value: null, description: "ciśnienie na poziomie morza"},
      ta: {value: null, description: "temperatura"},
      t0: {value: null, description: "punkt rosy"},
      ha: {value: null, description: "wilgotność"},
      r1: {value: null, description: "opad w ostaniej godzinie"},
      ra: {value: null, description: "opad"},
      wd: {value: null, description: "kierunek wiatru"},
      ws: {value: null, description: "prędkość wiatru"},
      wg: {value: null, description: "chwilowa prędkość wiatru"},
      h0: {value: null, description: "wysokość nad poziom morza"}
    },
    stationName: "",
    histPressObj: null,
  },
  getters: {
    getStationName: (state) => {
      return state.stationInfo.station;
    },
    getMeasurements: (state) => {
      return state.measurement;
    },
    getStationDetails: (state, station) => {
      return state.stations.find(s => s.station == station);
    },
  },
  actions: {
      loadStations ({ commit }) {
        axios
          .get('http://mech.fis.agh.edu.pl/meteo/rest/json/info/')
          .then(r => r.data)
          .then(stations => {
            commit('SET_STATIONS', stations);
          })
      },

        loadMeasurements: (context,stationName) => {
          const url = "http://mech.fis.agh.edu.pl/meteo/rest/json/last/"+stationName;
          AxiosModule.get(url)
            .then(response => {
              context.commit("SET_MEASUREMENTS", response);
            })
            .catch(error => {
              console.log(url)
            })
        },
        loadHistPressure: (context,stationName,utc) => {
        if(typeof(utc)!== "undefined")  utc = utc.slice(0,10);
        else  utc = new Date().toJSON().slice(0,10);
        const url = "http://mech.fis.agh.edu.pl/meteo/rest/json/pres0/"+stationName+"/"+utc;
          AxiosModule.get(url)
            .then(response => {
              context.commit("setHistPressure", response);
            })
            .catch(error => {
              console.log(url)
            })
          },
  },  
  mutations: {
     SET_STATIONS (state, payload) {
    state.stations = payload
  },
    SET_MEASUREMENTS: (state, payload) => {
    state.measurement.p0.value = payload[0].data.p0;
    state.measurement.ta.value = payload[0].data.ta;
    state.measurement.t0.value = payload[0].data.t0;
    state.measurement.ha.value = payload[0].data.ha;
    state.measurement.r1.value = payload[0].data.r1;
    state.measurement.ra.value = payload[0].data.ra;
    state.measurement.wd.value = payload[0].data.wd;
    state.measurement.wg.value = payload[0].data.wg;
    state.measurement.ws.value = payload[0].data.ws;
    state.measurement.h0.value = payload[0].data.h0;
    state.utc = payload[0].utc;
  },
  
  setStationName: (state, payload) => {
    state.stationInfo.station = payload
    state.stationName = payload.name
  },
  setStationDetails: (state, payload) => {
    state.stationInfo.lati = payload.lati,
    state.stationInfo.long = payload.long,
    state.stationInfo.name= payload.name,
    state.stationInfo.station = payload.station
  },
  setHistPressure: (state, payload) => {
    state.histPressObj = payload;
  },
  
},
});