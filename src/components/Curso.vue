<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Cursos</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Curso</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>                                               
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                      <v-select
                      :items="niveles"
                      v-model="nivel"
                      label="Nivel"
                    ></v-select>
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
        <v-dialog v-model="adModal" max-width="290px">
            <v-card>
              <v-card-title class="headline" v-if="adAccion==1">¿Activar Item?</v-card-title>
              <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Item?</v-card-title>
              <v-card-text>
                Esta a punto de 
                <span v-if="adAccion==1">Activar</span>
                <span v-if="adAccion==2">Desactivar</span>
                el Item {{ adNombre }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat="flat" @click="activarDesactivarCerrar">Cancelar</v-btn>
                <v-btn v-if="adAccion==1" color="blue darken-1" flat="flat" @click="activar">Activar</v-btn>
                <v-btn v-if="adAccion==2" color="red darken-1" flat="flat" @click="desactivar">Desactivar</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table :headers="headers" :items="cursos" :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <template v-if="props.item.estado">
                <v-icon small @click="activarDesactivarMostrar(2,props.item)">block</v-icon>
            </template>
            <template v-else>
                <v-icon small @click="activarDesactivarMostrar(1,props.item)">check</v-icon>
            </template>
          </td>         
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.nivel }}</td>         
          <td>
            <div v-if="props.item.estado">
                <span class="blue--text">Activo</span>
            </div>
            <div v-else>
                <span class="red--text">Inactivo</span>
            </div>                       
          </td>                  
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
              cursos:[],
              dialog: false,
              headers: [    
                  { text: 'Opciones', value: 'opciones', sortable: false },
                  { text: 'Nombre', value: 'nombre'},
                  { text: 'Nivel', value: 'nivel' },                
                  { text: 'Estado', value: 'condicion', sortable: false }
              ],
              search: '',              
              editedIndex: -1,             
              id: '',
              nombre:'',
              niveles:[1,2,3,4,5,6,7,8,9,10,11],
              nivel:'',
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
              return this.editedIndex === -1 ? 'Nuevo Curso' : 'Editar Curso'
          }
      },

      watch: {
          dialog (val) {
              val || this.close()
          }
      },

      created () {          
          this.listar();          
      },
      methods:{          
          listar(){  
            let me=this;     
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header};      
            axios.get('api/Cursos/Listar',configuration).then(function(response){               
               me.cursos = response.data;
            }).catch(function(error){
                console.log(error);
            });      
          },
          
           editItem (item) {
              this.id = item.idcurso;
              this.nombre = item.nombre;
              this.nivel = item.nivel;
              this.editedIndex = 1;  
              this.dialog = true
          },

          activarDesactivarMostrar(accion,item) {
              this.adModal=1;
              this.adNombre = item.nombre;
              this.adId = item.idcurso;
              if(accion == 1){
                  this.adAccion = 1;
              }
              else if(accion == 2){
                  this.adAccion = 2;
              }
              else{
                  this.adAccion = 0;
              }
          },

          activar(){
             let me = this;
             let header = {"Authorization" : "Bearer " + this.$store.state.token};
             let configuration = {headers : header};
                axios.put('api/Cursos/Activar/' + this.adId,{}, configuration).then(function(response){
                    me.adModal = 0;
                    me.adAccion = 0;
                    me.adNombre = "";
                    me.adId = "";
                    me.listar();                   
                }).catch(function(error){
                    console.log(error);
                });
          },

          desactivar(){
              let me = this;
              let header = {"Authorization" : "Bearer " + this.$store.state.token};
              let configuration = {headers : header};
                axios.put('api/Cursos/Desactivar/' + this.adId,{}, configuration).then(function(response){
                    me.adModal = 0;
                    me.adAccion = 0;
                    me.adNombre = "";
                    me.adId = "";
                    me.listar();                   
                }).catch(function(error){
                    console.log(error);
                });
          },

          activarDesactivarCerrar(){
            this.adModal = 0;
          },

          close () {
              this.dialog = false;             
              this.limpiar();
          },

          limpiar(){
              this.id="";
              this.idcurso="";              
              this.nombre="";
              this.nivel="";
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
                   axios.put('api/Cursos/Actualizar',{
                   'idcurso': me.id,                   
                   'nombre': me.nombre,
                   'nivel': me.nivel                  
                 }, configuration).then(function(response){
                    me.close();
                    me.listar();
                    me.limpiar();                    
                 }).catch(function(error){
                    console.log(error);
                 });

              } else {
                 //codigo para guardar
                 let me = this;
                 axios.post('api/Cursos/Crear',{                   
                   'nombre': me.nombre,
                   'nivel': me.nivel
                 }, configuration).then(function(response){
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

              if(this.nombre.length < 3 || this.nombre.length > 50){
                  this.validaMensaje.push("El nombre debe tener mas de 3 caracteres y menos de 100 caracateres.")
              }

              if(this.validaMensaje.length){
                  this.valida = 1;
              }
              return this.valida;
          }
      }
  }
</script>



