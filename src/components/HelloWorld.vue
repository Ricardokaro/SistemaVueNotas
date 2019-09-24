<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/logoColegio.svg')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Bienvenido {{ this.$store.state.usuario.nombre }}
        </h1>
        <p class="subheading font-weight-regular">
           Al Sistema de notas onlline,
          <br>aqui encontrara todo lo relacionado con sus calificaciones.     
        </p>
      </v-flex>

      <v-flex
        mb-5
        xs12
      >
        <h2 class="headline font-weight-bold mb-3">Administrador</h2>

        <v-layout justify-center>
         <p>todo lo relacionado con el rol de calificaciones</p>
        </v-layout>
      </v-flex>

      <v-flex
        xs12
        mb-5
      >
        <h2 class="headline font-weight-bold mb-3">Docente</h2>

        <v-layout justify-center>
         <p>Todo lo relacionado con el rol Docente</p>
        </v-layout>
      </v-flex>

      <v-flex
        xs12
        mb-5
      >
        <h2 class="headline font-weight-bold mb-3">Estudiante</h2>

        <v-layout justify-center>
         <p>Todo lo relacionado con el rol Docente</p>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      
    })
  }
</script>

<style>

</style>
