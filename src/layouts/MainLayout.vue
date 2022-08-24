<template>
  <q-layout view="lHh Lpr lFf" class="default-font">
    <q-header elevated class="header">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title style="font-weight: 600"> Homepage </q-toolbar-title>

        <div>
          <q-icon
            name="favorite"
            size="24px"
            tag="a"
            class="cursor-pointer"
            @click="router.push('/liked-posts')"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="state.leftDrawerOpen" show-if-above bordered>
      <q-list separator>
        <q-item-label header> Menu </q-item-label>
        <q-item
          v-for="(item, index) in listMenu"
          :key="index"
          clickable
          tag="a"
          @click="menuClick(item.path)"
        >
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="state.openLoginDialog" persistent>
      <LoginForm
        @success="loginSuccess"
        @cancel="state.openLoginDialog = false"
      />
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoginForm from "src/components/LoginForm.vue";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

const userData = computed(() => store.state.user.userData);

const state = reactive({
  leftDrawerOpen: false,
  openLoginDialog: false,
});

const listMenu = ref([
  {
    label: "Homepage",
    path: "/",
  },
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Liked Post",
    path: "/liked-posts",
  },
]);

onMounted(() => {
  console.log("user", userData.value.id);
  if (route.path === "/login") {
    state.openLoginDialog = true;
  }
  if (userData.value.id) {
    listMenu.value.push({
      label: "Logout",
      path: "/logout",
    });
  }
});

watch(
  () => route.path,
  () => {
    if (route.path === "/login") {
      state.openLoginDialog = true;
    }
  }
);

function toggleLeftDrawer() {
  state.leftDrawerOpen = !state.leftDrawerOpen;
}

function menuClick(path) {
  if (path === "/admin" && !userData.value.id) {
    router.push("/login");
  } else if (path === "/logout") {
    store.dispatch("user/revokeUser");
    listMenu.value.splice(3, 1);
    router.push("/");
  } else {
    router.push(path);
  }
}

function loginSuccess() {
  state.openLoginDialog = false;
  listMenu.value.push({
    label: "Logout",
    path: "/logout",
  });
}
</script>

<style lang="scss">
.header {
  font-size: 18px !important;
  font-weight: 600 !important;
}
</style>