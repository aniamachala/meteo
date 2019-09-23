<template>
 <v-container >
   <v-card-title class="header">
    METEO widget
    <i class="wi wi-day-storm-showers"></i>
   </v-card-title>
   <v-card style="padding: 10px;" class="grey lighten-5">
     <div style="padding: 15px; font-size: 14px;">
    Strona służy do generowania widgetów pogodowych.
Pomiary dokonywane są przez stacje meteorologiczne, należące do szkół biorących udział w projekcie Małopolskiej Chmury Edukacyjnej. <br>
W paru prostych krokach pozwala na dostosowanie aplikacji do własnych potrzeb. Wygeneruj kod, umieść go na swojej stronie i gotowe!<br><br>
     </div>
    <v-row align="center">
      <v-col class="d-flex" cols="12" sm="1">
          <v-avatar color="#78909C" size="50">
      <span class="white--text" stle="position:absolute">Krok 1</span>
    </v-avatar>
      </v-col>
      <v-col class="d-flex" cols="12" sm="5">
     Wybierz stację pomiarową:
      </v-col>
     <v-col class="d-flex" cols="12" sm="4">
 <v-select v-model="form.selected" :items="stations" v-on="setStationName()" item-value="station" item-text="name" label="Stacja pomiarowa" style="padding: 30px;"/>
     </v-col>
     <v-col class="d-flex" cols="12" sm="2">
     </v-col>
    <v-col class="d-flex" cols="12" sm="1">
          <v-avatar color="#78909C" size="50">
      <span class="white--text" stle="position:absolute">Krok 2</span>
    </v-avatar>
    </v-col>
     <v-col class="d-flex" cols="12" sm="5">
     Wybierz typ widgetu:
<div v-if="radios==='t1'">
  <br>
     <h3>Typ standard</h3>
      <ul>
        <li>prezentowane wszystkie pomiary</li>
        <li>szerokość min. 200px</li>
        <li>wysokość 300px</li>
      </ul>
</div>
<div v-if="radios==='t2'">
    <br>
      <h3>Mały</h3>
      <ul>
        <li>szerokość 150px</li>
        <li>kolor czcionki jasny lub ciemny</li>
        <li>wysokość zależy od ilości wybranych <br>w kolejnym kroku parametrów</li>
      </ul>
</div>
<div v-if="radios==='t3'">
    <br>
      <h3>Średni</h3>
      <ul>
        <li>szerokość 220px</li>
        <li>kolor czcionki jasny lub ciemny</li>
        <li>opis wybranych pomiarów</li>
        <li>wysokość zależy od ilości wybranych <br>w kolejnym kroku parametrów</li>
      </ul>
</div>
<div v-if="radios==='t4'">
    <br>
      <h3>Duży</h3>
      <ul>
        <li>szerokość 300 px</li>
        <li>opis wybranych pomiarów</li>
        <li>wysokość zależy od ilości wybranych <br>w kolejnym kroku parametrów</li>
      </ul>
</div>
     </v-col>
      <v-col class="d-flex" cols="12" sm="6">
        <v-flex xs12 sm1>
        </v-flex>
      <v-radio-group v-model="radios" :mandatory="true">
          <v-radio label="Standard" value="t1" ></v-radio>
          <v-radio label="Mały" value="t2"></v-radio>
          <v-radio label="Średni" value="t3"></v-radio>
          <v-radio label="Duży" value="t4"></v-radio>
      </v-radio-group>
          <v-flex xs12 sm4>
        <v-text-field type="number"
            min="200"
            :rules="widthRule"
            v-if="radios === 't1'"
            style="padding: 30px;"
            label="Szerokość"
            suffix="px"
             v-model="form.width"
          ></v-text-field>
          <v-switch
          v-if="radios === 't2' || radios === 't3'"
          v-model="dark"
          :label="`Biała czcionka: ${DarkThemeDesc}`"
    ></v-switch>
          </v-flex>
       </v-col>
      <v-col class="d-flex" cols="12" sm="1">
        <v-avatar color="#78909C" size="50">
          <span class="white--text" stle="position:absolute">Krok 3</span>
        </v-avatar>
      </v-col>
      <v-col class="d-flex" cols="12" sm="5">
     Zaznacz parametry, które chciałbyś umieścić na widgecie:
       </v-col>
     <v-col class="d-flex" cols="12" sm="4">
    <v-select
      :disabled="disableParamSelection"
      v-model="form.selectedParameters"
      :items="parameters"
      item-text="value"
      item-value="param"
      label="Wybierz pomiary"
      style="padding: 30px;"
      placeholder=" "
      chips
      multiple
    >
      <template v-slot:prepend-item>
        <v-list-item
          ripple
          @click="toggle"
        >
          <v-list-item-action>
            <v-icon :color="form.selectedParameters.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Zaznacz wszystkie</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>
    </v-select>
    </v-col>
    <v-col class="d-flex" cols="12" sm="2">
    </v-col>
      <v-col class="d-flex" cols="12" sm="1">
        <v-avatar color="#78909C" size="50">
          <span class="white--text" stle="position:absolute">Krok 4</span>
        </v-avatar>
      </v-col>
    <v-col class="d-flex" cols="12" sm="5">
    Wybierz kolor tła:
    </v-col>
    <v-col class="d-flex" cols="12" sm="6">
      <div style="padding: 30px;">
        <v-color-picker v-model="color" :mode.sync="mode" ></v-color-picker>
    </div>
    </v-col>
    <v-col class="d-flex" cols="12" sm="1">
      <v-avatar color="#78909C" size="50">
          <span class="white--text" stle="position:absolute">Krok 5</span>
      </v-avatar>
    </v-col>
    <v-col class="d-flex" cols="12" sm="5">
    Określ czas aktualizacji danych (w minutach):
    </v-col>
    <v-col class="d-flex" cols="12" sm="4">
    <v-slider
              v-model="form.interval"
              label="Czas"
              min="1"
              max="120"
              thumb-label="always"
            ></v-slider>
    </v-col>
    <v-col class="d-flex" cols="12" sm="4">
    </v-col>
    <v-col class="d-flex text-center" cols="12" sm="2">
    <v-btn v-on:click="loadFrame()">Generuj kod</v-btn>
    </v-col>

    <v-col class="d-flex" cols="12" sm="6" style="padding-right: 20%;">
              <v-textarea
                ref="text"
                v-show="showIframe"
                v-model="iframeContent"
                :auto-grow="true"
                :readonly="true"
                :outlined="true"
                v-on:focus.native="copyTextArea()"
        ></v-textarea>
    </v-col>
    <v-col class="d-flex" cols="12" sm="5">
    </v-col>
    <v-col class="d-flex" cols="12" sm="5"  v-html="iframeContent">
          {{iframeContent}}
    </v-col>
    </v-row>
  </v-card>
  <Footer />
 </v-container>
</template>
<script>
import { mapState } from 'vuex'
import Footer from '@/components/Footer'
export default {
    components: {
      Footer,
  },
  data() {
    return {
      radios: 't1',
      iframeContent: "",
      showIframe: false,
      disabled: false,
      dark: false,
      minLength: 200,
      form: {
        selected: "s000",
        width: 200,
        height: 300,
        selectedParameters: ["ta"],
        interval: 10,
      },
      types: ['hex'],
      type: 'hex',
      mode: 'hexa',
      hex: '#ECECEC',
    parameters: [
      { param: "p0", value: "ciśnienie na poziomie morza" },
      { param: "ta", value: "temperatura" },
      { param: "t0", value: "temperatura punktu rosy" },
      { param: "ha", value: "wilgotność" },
      { param: "r1", value: "opad w ostatniej godzinie", },
      { param: "ra", value: "opad" },
      { param: "ws", value: "prędkość wiatru" },
      { param: "wg", value: "chwilowa prędkość wiatru" },
      { param: "h0", value: "wysokość nad poziom morza" }
    ],
    widthRule:[ v => v >= this.minLength || `Minimalna szerokość to 200px`],
  }
  },
    computed: {
    ...mapState(['stations','stationName','stationInfo']),
    selectedAllParameters () {
      return this.form.selectedParameters.length === this.parameters.length
    },
    selectedSomeParameters () {
      return this.form.selectedParameters.length > 0 && !this.selectedAllParameters
    },
    DarkThemeDesc (){
      if(this.dark)
      return "Tak";
      else 
      return "Nie";
    },
    icon () {
      if (this.selectedAllParameters) return 'mdi-close-box'
      if (this.selectedSomeParameters) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    disableParamSelection(){
      var disabled = false;
      if(this.radios === "t1"){
      this.form.selectedParameters = [ "p0", "ta", "t0", "ha", "r1", "ra", "ws", "wg", "h0" ];
      disabled = true;}
      else 
      disabled = false;
      return disabled;
      },
    color: {
        get () {
          return this[this.type]
        },
        set (v) {
          this[this.type] = v
        },
      },
    showColor () {
        if (typeof this.color === 'string') return this.color

        return JSON.stringify(Object.keys(this.color).reduce((color, key) => {
          color[key] = Number(this.color[key].toFixed(2))
          return color
        }, {}), null, 2)
      },
      mySrc: {
        get: function() {
          var meteo = this.form.selectedParameters.join('');
          var color = this.hex.substr(1);
          var currentUrl = window.location.href;
          var src = `${currentUrl}${this.radios}/${this.form.selected}?background=${color}&width=${this.form.width}&i=${this.form.interval}`
          if(this.radios === "t2")
          src= `${currentUrl}${this.radios}/${this.form.selected}?params=${meteo}&background=${color}&width=${this.form.width}&i=${this.form.interval}&dark=${this.dark}`
          if(this.radios === "t3")
          src= `${currentUrl}${this.radios}/${this.form.selected}?params=${meteo}&background=${color}&width=${this.form.width}&i=${this.form.interval}&dark=${this.dark}`
           if(this.radios === "t4")
          src= `${currentUrl}${this.radios}/${this.form.selected}?params=${meteo}&background=${color}&width=${this.form.width}&i=${this.form.interval}`
          
          return src;
          },
  }
  },
  watch: {
    selected: function (newVal) {
      this.form.selected = newVal;
    },
    selectedParameters: function (newVal) {
      this.form.selectedParameters = newVal;
    }
  },
  mounted () {
    this.$store.dispatch('loadStations')
  },
  methods: {
    setStationName: function(){
        this.$store.commit("setStationDetails", this.stations.find(s => s.station == this.form.selected))
        this.$store.commit('setStationName',this.form.selected)
    },
      toggle () {
      this.$nextTick(() => {
        if (this.selectedAllParameters) {
          this.form.selectedParameters = []
        } else {
          this.form.selectedParameters = [ "p0", "ta", "t0", "ha", "r1", "ra", "ws", "wg", "h0" ];

        }
      })
    },
    loadFrame: function(){
      var Applength = this.form.selectedParameters.length;
      this.form.height = 300;
      if(this.radios === "t2"){
        this.form.width = 150;
        this.form.height = Applength*24+72;
      }
      else if(this.radios === "t3"){
        this.form.width = 222;
        this.form.height = Applength*32+64;
      }
      else if(this.radios === "t4"){
        this.form.width = 300;
        this.form.height = Applength*50+84;
      }
      var src = this.mySrc;
      this.iframeContent =  `<iframe src='${ src }' frameborder="0" scrolling="no" height='${this.form.height}' width='${this.form.width}'  ></iframe>`;
      this.showIframe = true;
    },
    copyTextArea() {
      this.$refs.text.select();
      document.execCommand('copy');
    }
  },
};
</script>
<style>
.header {
  padding: 20px;
  text-align: center;
  display: block;
  background-image: url('../assets/tlo.jpg');
  background-position: 0px;
  color: white;
  font-size: 50px;
}

</style>