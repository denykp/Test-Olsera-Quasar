<template>
  <div style="position: relative">
    <!-- {{ listPosts }} -->
    <q-card>
      <q-card-section>
        <div
          v-for="(item, index) in state.listPosts"
          :key="index"
          class="list-berita"
        >
          <div>
            <span class="title cursor-pointer" @click="readData(item)">
              {{ item.title }}
            </span>
            <div>{{ item.body }}</div>
          </div>
          <div class="flex">
            <q-icon
              name="edit"
              size="18px"
              class="cursor-pointer"
              @click="editPost(item)"
              style="margin-right: 5px"
            />
            <q-icon
              name="close"
              size="22px"
              class="cursor-pointer"
              @click="deleteClicked(item.id)"
            />
          </div>
        </div>
      </q-card-section>
      <q-inner-loading
        :showing="loadingData"
        label="Please wait..."
        label-style="font-size: 1.1em"
      />
    </q-card>

    <q-dialog v-model="state.openReadDialog" @before-hide="modalClosed">
      <ReadPost />
    </q-dialog>

    <q-dialog v-model="state.openModifyDialog" @before-hide="modalClosed">
      <EditPost />
    </q-dialog>

    <q-dialog v-model="state.openModifyDialog" @before-hide="modalClosed">
      <EditPost />
    </q-dialog>

    <q-dialog
      v-model="state.openDeleteDialog"
      @before-hide="modalClosed"
      persistent
    >
      <q-card>
        <div style="padding: 20px">
          <q-card-section class="row items-center">
            <span>Apakah anda yakin ingin menghapus data ini?</span>
          </q-card-section>
          <div class="flex justify-end" style="margin-top: 30px">
            <q-btn
              style="margin-right: 10px"
              label="Cancel"
              @click="state.openDeleteDialog = false"
            />
            <q-btn
              label="Hapus"
              :loading="loadingDelete"
              color="red"
              @click="deletePost"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <div class="floating-add">
      <q-icon name="add" size="30px" class="cursor-pointer" @click="addPost" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { api } from "src/boot/axios";
import ReadPost from "src/components/ReadPost.vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import EditPost from "src/components/ModifyPost.vue";
import { useQuasar } from "quasar";

const store = useStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const loadingData = ref(false);
const loadingDelete = ref(false);

const state = reactive({
  listPosts: [],
  deletePost: "",
  openReadDialog: false,
  openModifyDialog: false,
  openDeleteDialog: false,
});

const userData = computed(() => store.state.user.userData);

onMounted(() => {
  console.log("route", route.path);
  loadData();
  if (route.params.postId && !route.params.edit) {
    state.openReadDialog = true;
  }
  if (
    (route.params.postId && route.params.edit) ||
    route.path === "/admin/create"
  ) {
    state.openModifyDialog = true;
  }
});

watch(
  () => route.path,
  () => {
    console.log("route", route);
    if (route.params.postId && !route.params.edit) {
      state.openReadDialog = true;
    }
    if (
      (route.params.postId && route.params.edit) ||
      route.path === "/admin/create"
    ) {
      state.openModifyDialog = true;
    }
  }
);

async function loadData() {
  try {
    loadingData.value = true;
    const { data } = await api.get(`/posts?userId=${userData.value.id}`);
    console.log("data", data);
    if (data) {
      state.listPosts = data;
    }
    loadingData.value = false;
  } catch (error) {
    loadingData.value = false;
    console.log(error);
  }
}

function readData(item) {
  console.log("read data", item);
  router.push(`/admin/posts/${item.id}`);
}

function modalClosed() {
  router.push("/admin");
}

function editPost(item) {
  router.push(`/admin/posts/${item.id}/edit`);
}

function addPost() {
  router.push(`/admin/create`);
}

function deleteClicked(id) {
  state.deletePost = id;
  state.openDeleteDialog = true;
}

async function deletePost() {
  try {
    loadingDelete.value = true;
    await api.delete(`/posts/${state.deletePost}`);
    $q.notify({
      message: "Data berhasil dihapus",
      position: "center-right",
      color: "primary",
    });
    loadingDelete.value = false;
    state.openDeleteDialog = false;
  } catch (error) {
    loadingDelete.value = false;
    console.log(error);
    $q.notify({
      message: "Oops... Something went wrong...",
      position: "center-right",
      color: "red",
    });
  }
}
</script>

<style lang="scss" scoped>
.list-berita {
  border: 1px solid grey;
  margin: 20px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 18px;
  }
}
.floating-add {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: var(--q-primary);
  color: white;
  border-radius: 100%;
  padding: 10px;
}
</style>