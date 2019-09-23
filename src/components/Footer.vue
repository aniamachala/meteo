<template>
  <v-footer
    height="auto"
    color="grey darken-3"
  >
    <v-layout
      justify-center
      row
      wrap
    >
      <v-btn 
        small
        rounded
        style="margin: 5px;"
        v-for="item in links"
        :key="item.link"

      >
        <a :href="'//' + item.link" target="_blank">
        {{item.name }}
         </a>
      </v-btn>
      <v-flex
        grey darken-4
        py-3
        text-center
        white--text
        xs12
      >
        &copy;2019 — <strong>Anna Machała</strong>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      links: [
        {name: 'Strona z pomiarami', link: 'rainbow.fis.agh.edu.pl/mche'},
        {name: 'Małopolska Chmura Edukacyjna', link: 'e-chmura.malopolska.pl/'},
        {name: 'Strona udostępniająca dane', link: 'mech.fis.agh.edu.pl/meteo/'},
        {name: 'Serwis METEO', link: 'meteo.ftj.agh.edu.pl/'},
      ]
    })
  }
</script>
<style>
</style>
