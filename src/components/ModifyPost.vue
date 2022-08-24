<template>
  <q-card>
    <div
      class="flex justify-between items-center bg-primary text-white"
      style="padding: 10px 20px"
    >
      <div style="font-size: 20px; font-weight: bold">
        {{ isEdit ? "Edit" : "Create" }} Post
      </div>
      <div>
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
    </div>
    <div class="modal-dialog">
      <div>
        <q-input
          ref="titleRef"
          v-model="formField.title"
          label="Title"
          :rules="[(val) => !!val || 'Field is required']"
          outlined
        />
        <q-input
          ref="bodyRef"
          v-model="formField.body"
          label="Body"
          style="margin-top: 10px"
          :rules="[(val) => !!val || 'Field is required']"
          outlined
          type="textarea"
        />
      </div>
      <div class="flex justify-end" style="margin-top: 30px">
        <q-btn style="margin-right: 10px" label="Cancel" v-close-popup />
        <q-btn
          label="Save"
          :loading="loadingSave"
          color="primary"
          @click="save"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { api } from "src/boot/axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

const router = useRouter();
const route = useRoute();
const store = useStore();
const $q = useQuasar();

const userData = computed(() => store.state.user.userData);

const titleRef = ref(null);
const bodyRef = ref(null);

const isEdit = ref(false);
const loadingSave = ref(false);

const formField = reactive({
  title: "",
  body: "",
});

onMounted(() => {
  if (route.params.postId && route.params.edit) {
    isEdit.value = true;
    loadPost();
  }
});

async function loadPost() {
  try {
    const { data } = await api.get(`/posts/${route.params.postId}`);
    console.log("data", data);
    if (data) {
      Object.keys(formField).forEach((key) => {
        formField[key] = data[key];
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function save() {
  try {
    loadingSave.value = true;
    titleRef.value.validate();
    bodyRef.value.validate();

    if (!(titleRef.value.hasError || bodyRef.value.hasError)) {
      await api({
        url: route.params.postId ? `/posts/${route.params.postId}` : "/posts",
        method: isEdit.value ? "PUT" : "POST",
        data: {
          id: route.params.postId || undefined,
          title: formField.title,
          body: formField.body,
          userId: userData.value.id,
        },
      });
      $q.notify({
        message: "Data berhasil disimpan",
        position: "right",
        color: "primary",
      });
      loadingSave.value = false;
      router.push("/admin");
    }
  } catch (error) {
    console.log(error);
    loadingSave.value = false;
    $q.notify({
      message: "Oops... Something went wrong...",
      position: "right",
      color: "red",
    });
  }
}
</script>

<style lang="scss" scoped>
.modal-dialog {
  padding: 20px;
  position: relative;
  width: 500px;
}
</style>