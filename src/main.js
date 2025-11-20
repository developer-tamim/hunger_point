import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import './index.css'

/* ----------  Font Awesome  ---------- */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/*  Solid  */
import {
  faUser, faPlus, faEdit, faTrash, faSignOutAlt, faCog,
  faUtensils, faList, faMoneyBillWave, faBook, faEllipsisV,
  faBellConcierge, faReceipt, faShekelSign, faClockRotateLeft, faHouse, faTrashCan
} from '@fortawesome/free-solid-svg-icons'

/*  Regular  */
import {
  faUser as farUser, faTrashCan as farTrashCan   // <-- import each icon you need
} from '@fortawesome/free-regular-svg-icons'

/*  Add BOTH to library  */
library.add(
  // solid
  faUser, faPlus, faEdit, faTrash, faSignOutAlt, faCog,
  faUtensils, faList, faMoneyBillWave, faBook, faEllipsisV,
  faBellConcierge, faReceipt, faShekelSign, faClockRotateLeft, faHouse, faTrashCan,

  // regular (must be aliased so solid & regular can coexist)
  farUser, farTrashCan
)

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)

// Register once
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')