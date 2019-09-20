<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Estudiantes</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                      <v-select
                      :items="documentos"
                      v-model="tipo_documento"
                      label="Tipo Documento"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="num_documento" label="Numero Documento"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field  v-model="primer_nombre " label="Primer Nombre"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field  v-model="segundo_nombre " label="Segundo Nombre"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field  v-model="primer_apellido " label="Primer Apellido  "></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field  v-model="segundo_apellido " label="Segundo Apellido"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field  v-model="correo_electronico " label="Email"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm6 md6>
                    <v-text-field  v-model="celular " label="Celular"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>                    
                    <v-text-field  v-model="direccion " label="Direccion  "></v-text-field>
                  </v-flex>                 
                   <v-flex xs12 sm6 md6> 
                    <v-text-field type="password" v-model="password" label="password"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6 v-show="valida">
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
      <v-data-table :headers="headers" :items="usuarios " :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td>
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <template v-if="props.item.condicion">
                <v-icon small @click="activarDesactivarMostrar(2,props.item)">block</v-icon>
            </template>
            <template v-else>
                <v-icon small @click="activarDesactivarMostrar(1,props.item)">check</v-icon>
            </template>
          </td> 
          <td>{{ props.item.tipo_documento }}</td>
          <td>{{ props.item.num_documento }}</td>
          <td>{{ props.item.primer_nombre }}</td>
          <td>{{ props.item.segundo_nombre }}</td>
          <td>{{ props.item.primer_apellido }}</td>
          <td>{{ props.item.segundo_apellido }}</td>
          <td>{{ props.item.correo_electronico }}</td>
          <td>{{ props.item.celular }}</td>
          <td>{{ props.item.direccion }}</td>          
          <td>
            <div v-if="props.item.condicion">
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
              usuarios:[],
              dialog: false,
              headers: [
                  { text: 'Opciones', value: 'opciones', sortable: false },                   
                  { text: 'Tipo Documento', value: 'tipo_documento' },
                  { text: 'Número Documento', value: 'num_documento', sortable: false },
                  { text: 'Pimer Nombre', value: 'primer_nombre' }, 
                  { text: 'Segundo Nombre', value: 'segundo_nombre' },
                  { text: 'Primer Apellido', value: 'primer_apellido' }, 
                  { text: 'Segundo Apellido', value: 'segundo_apellido' }, 
                  { text: 'Email', value: 'correo_electronico', sortable: false },                                
                  { text: 'Celular', value: 'celular', sortable: false },
                  { text: 'Direccion', value: 'direccion', sortable: false },
                  { text: 'Estado', value: 'condicion', sortable: false }               
              ],
              search: '',              
              editedIndex: -1,             
              id: '',
              idrol: '',              
              tipo_documento: '',
              documentos: ['CEDULA','TARJETA IDENTIDAD'],
              num_documento: '',
              primer_nombre: '',
              segundo_nombre: '',
              primer_apellido: '',
              segundo_apellido: '',
              correo_electronico: '',
              celular: '',
              direccion: '',
              password: '',
              ant_password: '',
              act_password: false,
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
              return this.editedIndex === -1 ? 'Nuevo Estudiante' : 'Editar Estudiante'
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
            let me = this;   
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = { headers : header };       
            axios.get('api/Usuarios/ListarEstudiantes',configuration).then(function(response){               
               me.usuarios = response.data;
            }).catch(function(error){
                console.log(error);
            });      
          },
          
           editItem (item) {
              this.id = item.idusuario;
              this.idrol = item.idrol;                
              this.tipo_documento = item.tipo_documento ;
              this.num_documento = item.num_documento;
              this.primer_nombre = item.primer_nombre;
              this.segundo_nombre = item.segundo_nombre;
              this.primer_apellido = item.primer_apellido;
              this.segundo_apellido = item.segundo_apellido;
              this.correo_electronico = item.correo_electronico;
              this.celular = item.celular;
              this.direccion = item.direccion;            
              this.ant_password = item.password_hash;
              this.password = item.password_hash;
              this.editedIndex = 1;  
              this.dialog = true
          },


          select(){  
            let me = this; 
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header};
            var rolesArray = [];         
            axios.get('api/Roles/Select',configuration).then(function(response){               
               rolesArray = response.data;               
               rolesArray.map(function(x){
                 console.log(rolesArray);
                  if(x.nombre == "Estudiante"){                    
                    me.idrol = x.idrol                    
                  }                   
               });
            }).catch(function(error){
                console.log(error);
            });      
          },

          activarDesactivarMostrar(accion,item) {
              this.adModal=1;
              this.adNombre = item.primer_nombre + " " + item.primer_apellido;
              this.adId = item.idusuario;
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
                axios.put('api/Usuarios/Activar/' + this.adId,{},configuration).then(function(response){
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
                axios.put('api/Usuarios/Desactivar/' + this.adId,{},configuration).then(function(response){
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
              this.idrol="";             
              this.tipo_documento= "";
              this.num_documento= "";
              this.primer_nombre= "";
              this.segundo_nombre= "";
              this.primer_apellido= "";
              this.segundo_apellido= "";
              this.correo_electronico= "";
              this.celular= "";
              this.direccion= "";              
              this.password ="";
              this.ant_password = "";
              this.act_password = false;
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
                   if(me.password != me.ant_password){
                     me.act_password = true;
                   }                   
                   axios.put('api/Usuarios/Actualizar',{
                   'idusuario': me.id,
                   'idrol': me.idrol,
                   'tipo_documento': me.tipo_documento,
                   'num_documento': me.num_documento,
                   'primer_nombre': me.primer_nombre,
                   'segundo_nombre': me.segundo_nombre,
                   'primer_apellido': me.primer_apellido,
                   'segundo_apellido': me.segundo_apellido,
                   'correo_electronico': me.correo_electronico,
                   'celular': me.celular,
                   'direccion': me.direccion,                   
                   'password': me.password,
                   'act_password': me.act_password
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
                 axios.post('api/Usuarios/Crear',{
                   'idusuario': me.id,
                   'idrol': me.idrol,
                   'tipo_documento': me.tipo_documento,
                   'num_documento': me.num_documento,
                   'primer_nombre': me.primer_nombre,
                   'segundo_nombre': me.segundo_nombre,
                   'primer_apellido': me.primer_apellido,
                   'segundo_apellido': me.segundo_apellido,
                   'correo_electronico': me.correo_electronico,
                   'celular': me.celular,
                   'direccion': me.direccion,                   
                   'password': me.password                   
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
              if(this.primer_nombre.length < 3 || this.primer_nombre.length > 100){
                  this.validaMensaje.push("El nombre debe tener mas de 3 caracteres y menos de 100 caracateres.")
              }

              if(this.segundo_apellido.length < 3 || this.segundo_apellido.length > 100){
                  this.validaMensaje.push("El nombre debe tener mas de 3 caracteres y menos de 100 caracateres.")
              }

              if(!this.idrol){
                this.validaMensaje.push("Seleccione un rol.");
              }

              if(!this.tipo_documento || this.tipo_documento==0){
                this.validaMensaje.push("Seleccione un tipo documento.");
              } 
              
              if(!this.celular || this.celular==0){
                this.validaMensaje.push("Seleccione un tipo documento.");
              }        

              if(!this.password || this.password==0){
                this.validaMensaje.push("Ingrese un password al usuario.");
              }

              if(this.validaMensaje.length){
                  this.valida = 1;
              }
              return this.valida;
          }
      }
  }
</script>



