<template>
  <div>
    <q-infinite-scroll @load="loadData" :offset="250">
      <div
        v-for="(item, index) in state.listData"
        :key="index"
        class="list-berita"
      >
        <div>
          <span class="title cursor-pointer" @click="readData(item)">
            {{ item.title }}
          </span>
          <div>{{ item.body }}</div>
        </div>
        <div class="flex items-center">
          <q-icon
            name="favorite"
            size="18px"
            :color="item.like ? 'red' : ''"
            class="cursor-pointer"
            @click="like(item)"
          />
        </div>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>

    <q-dialog v-model="state.openReadDialog" @before-hide="readClosed">
      <ReadPost />
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "src/boot/axios";
import ReadPost from "src/components/ReadPost.vue";

const router = useRouter();
const route = useRoute();

const state = reactive({
  listData: [],
  listLike: [],
  selectedData: {},
  openReadDialog: false,
});

onMounted(() => {
  // loadData();
  state.listLike = JSON.parse(localStorage.getItem("listLike") || "[]");
  if (route.params.postId) {
    state.openReadDialog = true;
  }
});

async function loadData(index, done) {
  try {
    const { data } = await api.get(`/posts`, {
      params: {
        _page: index,
        _limit: 5,
      },
    });
    if (data) {
      const mapData = data.map((val) => ({
        ...val,
        like: state.listLike.includes(val.id),
      }));
      state.listData = state.listData.concat(mapData);
    }
    done();
  } catch (error) {
    console.log(error);
  }
}

function like(item) {
  if (item.like) {
    state.listLike.splice(state.listLike.indexOf(item.id), 1);
  } else {
    state.listLike.push(item.id);
  }
  item.like = !item.like;
  console.log(state.listLike);
  localStorage.setItem("listLike", JSON.stringify(state.listLike));
}

function readData(item) {
  // state.openReadDialog = true;
  // console.log(item.id);
  router.push(`/posts/${item.id}`);
}

function readClosed() {
  router.push("/");
}

watch(
  () => route.path,
  () => {
    console.log("route change", route.params);
    if (route.params.postId) {
      state.openReadDialog = true;
    }
  }
);
</script>

<style lang="scss" scoped>
.list-berita {
  border: 1px solid grey;
  margin: 20px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  .title {
    font-size: 18px;
  }
}
</style>