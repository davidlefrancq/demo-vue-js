import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)


import { JobsService } from '@/services/JobsService';
app.use(createPinia())
app.use(router)

app.mount('#app')

// Initialize the JobsService singleton and load jobs at app startup
const jobsService = JobsService.getInstance();
jobsService.loadJobs().then(() => {
  jobsService.hydrate();
});
