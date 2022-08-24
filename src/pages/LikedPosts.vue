<template>
  <div>
    <q-card>
      <q-card-section>
        <div v-for="(item, index) in filtered" :key="index" class="list-berita">
          <div>
            <span class="title cursor-pointer" @click="readData(item)">
              {{ item.title }}
            </span>
            <div>{{ item.body }}</div>
          </div>
        </div>
      </q-card-section>
      <q-inner-loading
        :showing="loadingData"
        label="Please wait..."
        label-style="font-size: 1.1em"
      />
    </q-card>
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { computed, onMounted, ref } from "vue";

const listData = ref([]);
const listLike = ref([]);

const loadingData = ref(false);

const filtered = computed(() =>
  listData.value.filter((item) => listLike.value.includes(item.id))
);

onMounted(() => {
  listLike.value = JSON.parse(localStorage.getItem("listLike") || "[]");
  loadData();
});

async function loadData() {
  try {
    loadingData.value = true;
    const { data } = await api.get(`/posts`);
    // console.log("data", data);
    if (data) {
      listData.value = data;
    }
    loadingData.value = false;
  } catch (error) {
    loadingData.value = false;
    console.log(error);
  }
}
</script>

<style lang="scss" scoped>
.list-berita {
  border: 1px solid grey;
  margin: 20px;
  padding: 10px;
  .title {
    font-size: 18px;
  }
}
</style>