<template>
  <q-card>
    <div class="login-form">
      <div>
        <q-input
          ref="idRef"
          v-model="formField.id"
          label="Id"
          :rules="[(val) => !!val || 'Field is required']"
        />
        <q-input
          ref="emailRef"
          v-model="formField.email"
          label="Email"
          style="margin-top: 20px"
          :rules="[(val) => !!val || 'Field is required']"
        />
      </div>
      <div class="text-red">{{ errorMessage }}</div>
      <div class="flex justify-end" style="margin-top: 30px">
        <q-btn style="margin-right: 10px" label="Cancel" @click="close" />
        <q-btn
          label="Login"
          :loading="loadingLogin"
          color="primary"
          @click="login"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { api } from "src/boot/axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const emit = defineEmits(["success", "cancel"]);

const store = useStore();
const router = useRouter();

const loadingLogin = ref(false);

const formField = reactive({
  id: "",
  email: "",
});

const errorMessage = ref(undefined);

const idRef = ref(null);
const emailRef = ref(null);

async function login() {
  try {
    loadingLogin.value = true;
    errorMessage.value = "";
    idRef.value.validate();
    emailRef.value.validate();

    if (!(idRef.value.hasError || emailRef.value.hasError)) {
      const { data } = await api.get(`/users/${formField.id}`);
      if (data) {
        if (data.email === formField.email) {
          store.dispatch("user/updateUser", data);
          emit("success");
          loadingLogin.value = false;
          router.push("/admin");
        } else {
          errorMessage.value = "Invalid Email";
        }
      }
    }
    loadingLogin.value = false;
  } catch (error) {
    console.log(error);
    loadingLogin.value = false;
  }
}

function close() {
  emit("cancel");
  router.push("/");
}
</script>

<style lang="scss" scoped>
.login-form {
  padding: 20px;
  width: 300px;
}
</style>