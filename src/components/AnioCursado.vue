<template >   
  <v-container grid-list-md text-xs-center class="pa-4 white"> 
    <v-layout row  wrap>
      <v-flex xs6 sm6 md6>       
            <v-select
              :items="anioescolares"
              v-model="idanio_escolar"
              @change="listarAnioCursado"
              label="Anio escolar"
            ></v-select>
      </v-flex> 
      <v-flex xs6 sm6 md6> 
            <v-select            
              :items="cursos"
              v-model="idcurso"
              @change="listarAnioCursado"
              label="Curso"
            ></v-select>
      </v-flex>    
      <v-flex xs12 sm12 md12>      
        <v-toolbar flat color="white">        
          <v-toolbar-title>Matricular</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn v-show="mostrarBotonAsignar" color="primary" dark class="mb-2" v-on="on">Matricular</v-btn>
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
                        :items="estudiantes"
                        v-model="idestudiante"
                        label="Estudiante"
                      ></v-select>
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
        </v-toolbar>
        <v-data-table :headers="headers" :items="aniocursados" :search="search" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-md-left">
              <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>            
            </td>
            <td class="text-md-left">{{ props.item.estudiante }}</td>            
            <td class="text-md-left">
              <div v-if="props.item.estado == 'Matriculado'">
                <span class="blue--text">{{ props.item.estado }}</span>
              </div>
              <div v-else>
                <span class="red--text">Inactivo</span>
              </div>                         
            </td>                                     
          </template>
          <template v-slot:no-data>
            <v-btn color="danger" @click="listarAnioCursado">Resetear</v-btn>
          </template>
        </v-data-table>
      </v-flex>

    </v-layout> 
      
    </v-container>
</template>
<script>
  import axios from "axios";
  export default {             
      data(){
          return{
              aniocursados:[],
              anioescolares: [],
              idanio_escolar: '',
              cursos: [],
              idcurso: '',
              dialog: false,
              headers: [
                  { text: 'Opciones', value: 'opciones', sortable: false },                 
                  { text: 'Estudiante', value: 'estudiante' },                  
                  { text: 'Estado', value: 'estado', sortable: false }                 
              ],
              search: '',              
              editedIndex: -1,             
              id: '',             
              idestudiante: '',
              estudiantes: [], 
              validaMatricula: false,             
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
              return this.editedIndex === -1 ? 'Nueva Matricula' : 'Editar Matricula'
          },

          mostrarBotonAsignar(){
            var mostrar = true;
            if(this.idanio_escolar.length == 0 || this.idcurso.length == 0){
              mostrar = false;
            }
            return mostrar;
          }          
      },

      watch: {
          dialog (val) {
              val || this.close()
          }
      },

      created () {          
          this.listarAnioEscolar();
          this.listarCursos();
          this.SelectEstudiantes();
      },
      methods:{ 
          listarAnioEscolar(){
            let me=this;
            let header = { "Authorization" : "Bearer " + this.$store.state.token };
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

          listarCursos(){
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header}; 
            var cursosArray = [];         
            axios.get('api/Cursos/Select', configuration).then(function(response){               
               cursosArray = response.data;
               console.log(cursosArray);
               cursosArray.map(function(x){
                   me.cursos.push({ text: x.nombre, value: x.idcurso })
               });
            }).catch(function(error){
                console.log(error);
            });      
          },

          listarAnioCursado(){
            if(this.idcurso > 0){
              let me=this;            
              let header = {"Authorization" : "Bearer " + this.$store.state.token};
              let configuration = {headers : header};
              axios.post('api/Aniocursados/Listar',{
                'idanio_escolar': me.idanio_escolar,
                'idcurso': me.idcurso
              }, configuration).then(function(response){
                me.aniocursados = response.data
              }).catch(function(error){
                  console.log(error);
              });
            }
          },

          SelectEstudiantes(){
            let me=this;
            let header = {"Authorization" : "Bearer " + this.$store.state.token};
            let configuration = {headers : header}; 
            var estudiantesArray = [];         
            axios.get('api/Usuarios/SelectEstudiantes', configuration).then(function(response){               
               estudiantesArray = response.data;
               console.log(estudiantesArray);
               estudiantesArray.map(function(x){
                   me.estudiantes.push({ text: x.nombre, value: x.idestudiante })
               });
            }).catch(function(error){
                console.log(error);
            });      
          },
                    
          editItem (item) {
              this.id = item.id;
              this.iddocente = item.iddocente;            
              
              this.editedIndex = 1;  
              this.dialog = true
          }, 

          close () {
              this.dialog = false;
              this.valida = 0;             
              this.limpiar();
          },

          limpiar(){
              this.id="";
              this.iddocente="";
                          
              this.editedIndex=-1;
          },

         async guardar () {
              await this.validar()
              console.log("Valida: "+this.valida)
              if(this.valida === 1){
                return;
                console.console("El validar esta en true")    
              }
              let header = {"Authorization" : "Bearer " + this.$store.state.token};
              let configuration = {headers : header};
              if (this.editedIndex > -1) {
                  //codigo para editar                  
                   let me = this;                                  
                   axios.put('api/Cursoxmateriaxdocentes/Actualizar',{
                   'id': me.id,
                   'iddocente': me.iddocente,
                   'intensidad_horaria': me.intensidad_horaria                  
                 },configuration).then(function(response){
                    me.close();
                    me.listarMateriaDocentexCursoxAnioescolar();
                    me.limpiar();                                      
                 }).catch(function(error){
                    console.log(error);
                 });

              } else {
                 //codigo para guardar
                 let me = this;                
                 axios.post('api/Aniocursados/Crear',{
                   'idcurso': me.idcurso,                   
                   'idestudiante': me.idestudiante,
                   'idanio_escolar': me.idanio_escolar                   
                 },configuration).then(function(response){
                    me.close();
                    me.listarAnioCursado();
                    me.limpiar();                    
                 }).catch(function(error){
                    console.log(error);
                 });
              }            
          },     
          
        async estaMatriculado(){
               //buscar si el estudiante se encuentra matriculado en el año escolar                 
                 let me = this;   
                 let header = {"Authorization" : "Bearer " + this.$store.state.token};
                 let configuration = {headers : header};
                 try{                    
                    let prueba = await axios.post('api/Aniocursados/Estamatriculado',{
                      'idanio_escolar': me.idanio_escolar,
                      'idestudiante': me.idestudiante                  
                    },configuration);
                    return prueba;
                 }catch(error){
                   console.log(error);
                 }
          },
          
          async validar(){              
              let me = this;
              me.valida = 0;              
              me.validaMensaje = [];
              try {
               
               let prueba = await me.estaMatriculado();               
               if(prueba.status === 200){
                   me.validaMensaje.push("-> el estudiante ya se encuentra matriculado");                   
               }
                 
              } catch (error) {
                 console.log(error); 
              }
              
              if(me.idestudiante == null || me.idestudiante.length == 0){
                me.validaMensaje.push("-> Debe Seleccionar un estudiante");
              }   

              if(me.validaMensaje.length){
                  me.valida = 1;                
              }
              //return me.valida;
          }          
      }
  }
</script>



