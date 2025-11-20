import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import './index.css' // Tailwind CSS

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUser, faPlus, faEdit, faTrash, faSignOutAlt, faCog, 
  faUtensils, faList, faMoneyBillWave, faBook, faEllipsisV, faBellConcierge, faReceipt, faShekelSign, faClockRotateLeft, faHouse
} from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(
  faUser, faPlus, faEdit, faTrash, faSignOutAlt, faCog,
  faUtensils, faList, faMoneyBillWave, faBook, faEllipsisV, faBellConcierge, faReceipt, faShekelSign, faClockRotateLeft, faHouse
)


const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')