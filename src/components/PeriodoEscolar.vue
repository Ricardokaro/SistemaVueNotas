<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Periodo Escolar</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Perido Escolar</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs6 sm6 md6>
                    <v-select
                      :items="anioescolares"
                      v-model="idanio_escolar"
                      label="Anio Escolar"
                    ></v-select>
                  </v-flex>
                  <v-flex xs6 sm6 md6>                    
                     <v-menu>
                       <v-text-field 
                       slot="activator" 
                       label="Fecha inicio"
                       prepend-icon="date_range"
                       :value = "fecha_inicio"                         
                       ></v-text-field>
                       <v-date-picker  v-model="fecha_inicio" :landscape="true" :reactive="true"></v-date-picker>
                     </v-menu>
                  </v-flex>
                  <v-flex xs6 sm6 md6> 
                    <v-menu>
                       <v-text-field 
                       slot="activator" 
                       label="Fecha final"
                       prepend-icon="date_range"
                       :value = "fecha_final"                         
                       ></v-text-field>
                       <v-date-picker  v-model="fecha_final" :landscape="true" :reactive="true"></v-date-picker>
                     </v-menu>
                  </v-flex>
                 <v-flex xs6 sm6 md6>
                    <v-text-field v-model="nombre" label="nombre"></v-text-field>
                  </v-flex>

                  <v-flex xs6 sm6 md6>
                    <v-text-field type="number" v-model="porcentaje" label="Porcentaje"></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12 v-show="valida">
                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                  </v-flex>                                    
                </v-layout> 
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
       
      </v-toolbar>
      <v-data-table :headers="headers" :items="peridoescolares" :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>            
          </td>
          <td>{{ props.item.anio_escolar }}</td>
          <td>{{ props.item.fecha_inicio }}</td>
          <td>{{ props.item.fecha_final }}</td>
          <td>{{ props.item.nombre  }}</td>
          <td>{{ props.item.porcentaje  }}</td>
        </template>
        <template v-slot:no-data>
          <v-btn color="danger" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
  import axios from "axios";
  export default {             
      data(){
          return{
              peridoescolares:[],
              anioescolares:[],
              idanio_escolar: '',
              dialog: false,
              headers: [
                  { text: 'Opciones', value: 'opciones', sortable: false },                  
                  { text: 'Año escolar', value: 'anio_escolar' },
                  { text: 'Fecha Inicio', value: 'fecha_inicio', sortable: false },
                  { text: 'Fecha Final', value: 'fecha_final', sortable: false },
                  { text: 'Nombre', value: 'nombre', sortable: false },
                  { text: 'Porcentaje', value: 'porcentaje', sortable: false }                  
              ],
              search: '',              
              editedIndex: -1,             
              id: '',
              nombre: '',
              fecha_inicio: new Date().toISOString().substr(0, 10),
              fecha_final: new Date().toISOString().substr(0, 10),
              anio: this.formatTomarAnio(new Date().toISOString().substr(0, 10)),
              porcentaje: '',
              valida: 0,
              validaMensaje: [],
              adModal: 0,
              adAccion: 0,
              adNombre: '',
              adId: ''
          }
      },
      computed: {
          formTitle () {
              return this.editedIndex === -1 ? 'Nuevo Periodo Escolar' : 'Editar Periodo Escolar'
          },
          computedTomarAnio () {
            return this.formatTomarAnio(this.anio)
          },
          computedFechaMinima(){
            return this.fechaMinima()            
          },
          computedFechaMaxima(){
            return this.fechaMaxima(this.anio)
          }         
      },

      watch: {
          dialog (val) {
              val || this.close()
          }
      },

      created () {          
          this.listar();
          this.select();
      },
      methods:{          
          listar(){  
            let me=this; 
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header};         
            axios.get('api/Periodoescolares/Listar', configuration).then(function(response){               
               me.peridoescolares = response.data;
               console.log(response.data);
            }).catch(function(error){
                console.log(error);
            });      
          },          

          editItem (item) {
              this.id = item.idperiodo;
              this.idanio_escolar = item.idanio_escolar;              
              this.fecha_inicio = item.fecha_inicio;
              this.fecha_final = item.fecha_final;
              this.nombre = item.nombre;
              this.porcentaje = item.porcentaje;
              this.editedIndex = 1;  
              this.dialog = true
          },

           select(){  
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header}; 
            var anioescolarArray = [];         
            axios.get('api/Anioescolares/Select', configuration).then(function(response){               
               anioescolarArray = response.data;
               console.log(anioescolarArray);
               anioescolarArray.map(function(x){
                   me.anioescolares.push({ text: x.nombre, value: x.idanio_escolar })
               });
            }).catch(function(error){
                console.log(error);
            });      
          },
          
          close () {
              this.dialog = false;             
              this.limpiar();
          },

          limpiar(){
              this.id="";
              this.idanio_escolar="";              
              this.fecha_inicio="";
              this.fecha_final="";
              this.nombre="";
              this.porcentaje,
              this.editedIndex=-1;
          },

          guardar () {
              if(this.validar()){
                return;    
              }
              let header = {"Authorization" : "Bearer " + this.$store.state.token};
              let configuration = {headers : header};  
              if (this.editedIndex > -1) {
                  //codigo para editar                  
                   let me = this;
                   axios.put('api/Periodoescolares/Actualizar',{
                   'idperido': me.id, 
                   'idanio_escolar': me.idanio_escolar,                  
                   'fecha_inicio': me.fecha_inicio,
                   'fecha_final': me.fecha_final,
                   'nombre': me.nombre,
                   'porcentaje': me.porcentaje                   
                 },configuration).then(function(response){
                    me.close();
                    me.listar();
                    me.limpiar();                    
                 }).catch(function(error){
                    console.log(error);
                 });

              } else {
                 //codigo para guardar
                 let me = this;
                 axios.post('api/Periodoescolares/Crear',{                   
                   'idanio_escolar': me.idanio_escolar,
                   'fecha_inicio': me.fecha_inicio,
                   'fecha_final': me.fecha_final,
                   'nombre': me.nombre,
                   'porcentaje': me.porcentaje
                 },configuration).then(function(response){
                    me.close();
                    me.listar();
                    me.limpiar();                    
                 }).catch(function(error){
                    console.log(error);
                 });
              }            
          },
          
          validar(){
              this.valida=0;
              this.validaMensaje=[];
              if(this.nombre.length < 3 || this.nombre.length > 200){
                  this.validaMensaje.push("El nombre debe tener mas de 3 caracteres y menos de 200 caracateres")
              }
              if(this.validaMensaje.length){
                  this.valida = 1;
              }
              return this.valida;
          },

          formatTomarAnio(date){            
            if (!date) return null
            const [year, month, day] = date.split('-')
            return year
          },         

          fechaMaxima(){                    
            //return "2019-12-31"
            return `${this.anio}-${"12"}-${"31"}`
          },

          fechaMinima(){
            //return "2019-01-31"
            return `${this.anio}-${"01"}-${"01"}`
          }
      }
  }
</script>



