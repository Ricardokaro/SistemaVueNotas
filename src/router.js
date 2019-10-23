import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Anioescolar from './components/Anioescolar.vue'
import PeriodoEscolar from './components/PeriodoEscolar.vue'
import Curso from './components/Curso.vue'
import Rol from './components/Rol.vue'
import Usuario from './components/Usuario.vue'
import AsignarDocenteCursoMateria from './components/AsignarDocenteCursoMateria.vue' 
import AnioCursado from './components/AnioCursado.vue'  
import Login from './components/Login.vue'
import store from './store'
import RegistrarDocente from './components/RegistrarDocente.vue'
import RegistrarEstudiante from './components/RegistrarEstudiante.vue'
import Area from './components/Area.vue'
import Materia from './components/Materia.vue'
import RegistrarCalificacion from './components/RegistrarCalificacion.vue'
import InformeCalificacion from './components/InformeCalificacion.vue'
import AsignarDirectorGrupo from './components/AsignarDirectorGrupo.vue'
import InformeCalificacionDirector from './components/InformeCalificacionDirector.vue'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        administrador: true,
        docente: true,
        estudiante: true
      }
    },   
    {
      path: '/anioescolares',
      name: 'anioescolares',     
      component:Anioescolar,
      meta: {
        administrador: true        
      }
    },
    {
      path: '/periodoescolares',
      name: 'periodoescolares',     
      component:PeriodoEscolar,
      meta: {
        administrador: true        
      }
    },
    {
      path: '/cursos',
      name: 'cursos',     
      component:Curso,
      meta: {
        administrador: true        
      }
    },
    {
      path: '/areas',
      name: 'areas',     
      component:Area,
      meta: {
        administrador: true        
      }
    },
    {
      path: '/materias',
      name: 'materias',     
      component:Materia,
      meta: {
        administrador: true        
      }
    },
    {
      path: '/registrardocente', 
      name: 'registrardocente',     
      component:RegistrarDocente,
      meta: {
        administrador: true        
      }
    },
    {
      path: '/asignardirectorgrupo', 
      name: 'asignardirectorgrupo',     
      component:AsignarDirectorGrupo,
      meta: {
        administrador: true        
      }
    },
    {
      path: '/registrarestudiante', 
      name: 'registrarestudiante',     
      component: RegistrarEstudiante,
      meta: {
        administrador: true        
      }
    },   
    {
      path: '/roles',
      name: 'roles',     
      component:Rol,
      meta: {
        administrador: true   
      }
    },
    {
      path: '/usuarios',
      name: 'usuarios',     
      component:Usuario,  
      meta: {
        administrador: true        
      }
    },   
    {
      path: '/asignardocentecursomaterias',
      name: 'asignardocentecursomaterias',     
      component: AsignarDocenteCursoMateria,
      meta: {
        administrador: true        
      }
    },
    {
      path: '/aniocursados',
      name: 'aniocursados',     
      component: AnioCursado,
      meta: {
        administrador: true        
      }
    },
    {
      path: '/registrarcalificaciones',
      name: 'registrarcalificaciones',     
      component: RegistrarCalificacion,
      meta: {
        docente: true        
      }
    },
    {
      path: '/informecalificaciones',
      name: 'informecalificaciones',     
      component: InformeCalificacion,
      meta: {
        docente: true        
      }
    },
    {
      path: '/informedirectores',
      name: 'informedirectores',     
      component: InformeCalificacionDirector,
      meta: {
        docente: true        
      }
    },
    {
      path: '/login',
      name: 'login',     
      component:Login,
      meta: {
        libre: true
      }
    }
  ]
})

router.beforeEach((to, from, next)=>{
  if(to.matched.some(record => record.meta.libre)){
    next()
  }else if(store.state.usuario && store.state.usuario.rol == 'Administrador'){
    if(to.matched.some(record => record.meta.administrador)){
      next()
    }
  }else if(store.state.usuario && store.state.usuario.rol == 'Docente'){
    if(to.matched.some(record => record.meta.docente)){
      next()
    }
  }else if(store.state.usuario && store.state.usuario.rol == 'Estudiante'){
    if(to.matched.some(record => record.meta.estudiante)){
      next()
    }
  }else{
    next({
      name: 'login'
    })
  }
})

export default router