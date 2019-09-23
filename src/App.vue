<template>
   <v-app id="app">
            <router-view/>
        <!--Footer /-->
    </v-app>
</template>

<script>
import Footer from "@/components/Footer.vue";
export default {
  name: 'App',
  components: {
    Footer
  },
  data(){return{
  };}
}
</script>
<style>
#app {
  background-image: linear-gradient(#E0E0E0,#757575);
}
</style>

