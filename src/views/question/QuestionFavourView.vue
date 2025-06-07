<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
  QuestionFavourControllerService,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";
import { IconStar } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  try {
    // 获取当前用户收藏的题目列表
    const res =
      await QuestionFavourControllerService.listMyFavourQuestionByPageUsingPost(
        searchParams.value
      );
    if (res.code === 0) {
      // 因为是收藏列表，所有题目的favourNum应该都大于0
      dataList.value = res.data.records.map((record: Question) => {
        // 确保favourNum字段有值
        if (!record.favourNum) {
          record.favourNum = 1;
        }
        return record;
      });
      total.value = res.data.total;
    } else {
      Message.error("加载失败：" + res.message);
    }
  } catch (error) {
    console.error("获取收藏题目失败", error);
    Message.error("获取收藏题目失败，请稍后重试");
  }
};

// 切换收藏状态
const toggleFavour = async (question: Question) => {
  try {
    const res = await QuestionFavourControllerService.doQuestionFavourUsingPost(
      {
        questionId: question.id,
      }
    );
    if (res.code === 0) {
      // 取消收藏成功后，重新加载数据
      await loadData();
      Message.success("已取消收藏");
    } else {
      Message.error("操作失败：" + res.message);
    }
  } catch (error) {
    console.error("收藏操作失败", error);
    Message.error("操作失败，请稍后重试");
  }
};

onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    slotName: "optional",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
  loadData();
};

// 跳转到做题页面
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

// 获取标签颜色
const getTagColor = (tag: string) => {
  if (tag === "简单") return "green";
  if (tag === "中等") return "orange";
  if (tag === "困难" || tag === "难") return "red";
  return "green"; // 默认颜色
};
</script>

<template>
  <div id="questionFavourView">
    <!-- 收藏内容区域 -->
    <div class="favour-content">
      <!-- 收藏头部 -->
      <div class="favour-header">
        <div class="favour-title">
          <img src="@/assets/favour1.png" alt="收藏" class="favour-icon" />
          <h2>我的收藏</h2>
        </div>
      </div>

      <!-- 题目列表 -->
      <a-table
        :columns="columns"
        :data="dataList"
        :pagination="{
          pageSize: searchParams.pageSize,
          current: searchParams.current,
          showTotal: true,
          total,
        }"
        @page-change="onPageChange"
      >
        <template #tags="{ record }">
          <a-space wrap>
            <a-tag
              v-for="(tag, index) of record.tags"
              :key="index"
              :color="getTagColor(tag)"
              >{{ tag }}
            </a-tag>
          </a-space>
        </template>
        <template #acceptedRate="{ record }">
          <div class="progress-container">
            <div class="custom-progress">
              <div
                class="progress-green"
                :style="{
                  width:
                    record.submitNum && record.acceptedNum > 0
                      ? `${(record.acceptedNum / record.submitNum) * 100}%`
                      : '0%',
                }"
              ></div>
            </div>
            <span class="progress-text">
              {{
                record.submitNum
                  ? `${((record.acceptedNum / record.submitNum) * 100).toFixed(
                      1
                    )}%`
                  : "0%"
              }}
            </span>
          </div>
        </template>
        <template #createTime="{ record }">
          {{ moment(record.createTime).format("YYYY-MM-DD") }}
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button type="primary" @click="toQuestionPage(record)"
              >做题
            </a-button>
            <IconStar
              class="star-icon"
              :style="{
                color: record.favourNum > 0 ? '#FFD700' : '#4E5969',
                cursor: 'pointer',
              }"
              @click="toggleFavour(record)"
              :fill="record.favourNum > 0 ? '#FFD700' : 'none'"
            />
          </a-space>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
#questionFavourView {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
}

.nav-tabs {
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e6eb;
  padding-bottom: 16px;
}

.favour-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.favour-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.favour-title {
  display: flex;
  align-items: center;
}

.favour-icon {
  width: 36px;
  height: 36px;
  margin-right: 12px;
}

.favour-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.my-created-btn {
  color: #165dff;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.custom-progress {
  width: 120px;
  height: 18px;
  background-color: #f2f3f5;
  border-radius: 9px;
  overflow: hidden;
  position: relative;
}

.progress-green {
  height: 100%;
  background-color: #00b42a;
  border-radius: 9px 0 0 9px;
  transition: width 0.3s ease;
}

.progress-text {
  white-space: nowrap;
  font-size: 13px;
  color: var(--color-text-2);
}

/* 收藏按钮样式 */
.star-icon {
  font-size: 24px;
  transition: all 0.3s ease;
}

.star-icon:hover {
  transform: scale(1.1);
}
</style>
