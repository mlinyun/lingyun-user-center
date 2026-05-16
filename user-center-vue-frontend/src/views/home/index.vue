<script setup lang="ts">
/**
 * 首页.
 */
import { useProgress } from "@bprogress/vue";
import { healthCheck } from "@/api/main";

defineOptions({ name: "HomeView" });

const { start, stop, pause, resume } = useProgress();

const checkService = async () => {
    try {
        const response = await healthCheck();
        console.log("服务检查结果:", response);
    } catch (error) {
        console.error("服务检查失败:", error);
    }
};
</script>

<template>
    <div id="home-view">
        <h1>欢迎来到首页</h1>
        <a-space>
            <a-button type="primary" @click="start(0.3, 1000)">开始</a-button>
            <a-button @click="stop">停止</a-button>
            <a-button @click="pause">暂停</a-button>
            <a-button @click="resume">继续</a-button>
        </a-space>
        <a-space style="margin-top: 20px">
            <a-button type="primary" danger ghost @click="checkService">服务检查</a-button>
        </a-space>
    </div>
</template>

<style scoped>
#home-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 50px;
}
</style>
