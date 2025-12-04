import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js';

export const domain = "localhost:3000";
export const http_proto = "http://"


createApp(App).use(router).mount('#app')


