<template>
  <q-card class="modal-dialog">
    <div class="close-icon bg-white">
      <q-btn icon="close" flat round dense v-close-popup />
    </div>
    <div style="border: 1px solid gray">
      <q-card>
        <q-card-section>
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <div>
              <div class="title">{{ postData.title }}</div>
              <div class="body">{{ postData.body }}</div>
            </div>
          </transition>
        </q-card-section>
        <q-inner-loading
          :showing="loadingPost"
          label="Please wait..."
          label-style="font-size: 1.1em"
        />
      </q-card>
      <q-card>
        <q-card-section>
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <div>
              <div>
                <span style="font-weight: bold; font-size: 18px"
                  >Comments:</span
                >
                <div
                  v-for="(item, index) in listComment"
                  :key="index"
                  style="padding: 10px 10px 0 10px"
                >
                  <hr />
                  <div class="comment-header">
                    {{ item.name }}&nbsp;({{ item.email }})
                  </div>
                  <div style="font-size: 12px">{{ item.body }}</div>
                </div>
              </div>
            </div>
          </transition>
        </q-card-section>
        <q-inner-loading
          :showing="loadingComment"
          label="Loading comments..."
          label-style="font-size: 1.1em"
        />
      </q-card>
    </div>
  </q-card>
</template>

<script setup>
import { api } from "src/boot/axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const postData = ref({});
const listComment = ref([]);
const loadingPost = ref(false);
const loadingComment = ref(false);

onMounted(async () => {
  await loadPost();
  await loadComment();
});

async function loadPost() {
  try {
    loadingPost.value = true;
    const { data } = await api.get(`/posts/${route.params.postId}`);
    console.log("data", data);
    if (data) {
      postData.value = data;
    }
    loadingPost.value = false;
  } catch (error) {
    loadingPost.value = false;
    console.log(error);
  }
}

async function loadComment() {
  try {
    loadingComment.value = true;
    const { data } = await api.get(`/comments?postId=${route.params.postId}`);
    if (data) {
      listComment.value = data;
    }
    loadingComment.value = false;
  } catch (error) {
    loadingComment.value = false;
    console.log(error);
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: bold;
}
.body {
  margin-top: 10px;
}
.comment-header {
  font-weight: bold;
  font-size: 16px;
}

.modal-dialog {
  padding: 20px;
  position: relative;
}
.close-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
}
</style>