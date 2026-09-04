import { createRouter, createWebHistory } from "vue-router";
import Workspace from "../views/Workspace.vue";

const routes = [
  {
    path: "/",
    component: Workspace,
  },
  {
    path: "/:pathMatch(.*)*",
    component: Workspace,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;