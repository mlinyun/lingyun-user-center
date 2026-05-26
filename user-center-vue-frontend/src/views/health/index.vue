<script setup lang="ts">
/**
 * 健康检查页面.
 */
import { ref } from "vue";
import { healthCheck } from "@/api/main.ts";
import {
    ApiOutlined,
    SyncOutlined,
    DashboardOutlined,
    CloudServerOutlined,
    FieldTimeOutlined,
} from "@ant-design/icons-vue";
import { BusinessCode } from "@/constants";

defineOptions({ name: "HealthCheck" });

const loading = ref(false);
const status = ref<"info" | "success" | "error" | "warning">("info");
const message = ref("系统已就绪，等待全面诊断指令。");
const subMessage = ref("请点击下方按钮，获取服务端实时运行反馈与健康状况。");
const lastCheckTime = ref("-");

const handleCheck = async () => {
    loading.value = true;
    status.value = "info";
    message.value = "正在检测系统健康状态...";
    subMessage.value = "正在与后端服务建立连接，并获取各模块运行反馈...";
    lastCheckTime.value = "-";

    try {
        const [res] = await Promise.all([healthCheck(), new Promise((resolve) => setTimeout(resolve, 800))]);
        const { data } = res;

        // 根据响应中的状态码设置判断，支持 BusinessCode 类似的成功码 (这里容错处理0、200和success字段)
        if (data.code === BusinessCode.SUCCESS || data.success) {
            status.value = "success";
            message.value = "系统健康状态良好";
            subMessage.value = data.data || "后端服务连接正常，各项核心指标稳定运行。";
        } else {
            status.value = "warning";
            message.value = "服务返回异常告警";
            subMessage.value = data.message || "能连接服务端，但未获得通过状态，请检查日志。";
        }
    } catch (error) {
        status.value = "error";
        message.value = "网络连接故障";
        subMessage.value = (error as Error).message || "无法连接到后端服务器，请检查网络链路！";
    } finally {
        loading.value = false;
        const now = new Date();
        lastCheckTime.value = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    }
};
</script>

<template>
    <a-layout class="health-check-layout">
        <a-space direction="vertical" size="large" style="width: 100%">
            <!-- 头部说明（保持与管理页类似设计，融入 Antd Pro 风格） -->
            <a-card :bordered="false" class="overview-card">
                <div class="overview-header">
                    <a-space size="middle">
                        <DashboardOutlined class="overview-icon" />
                        <div>
                            <h2 class="overview-title">系统健康检查</h2>
                            <p class="overview-subtitle">集中监控并诊断系统前后端通信、模块运行等实时健康状态</p>
                        </div>
                    </a-space>
                </div>
            </a-card>

            <!-- 诊断结果面板 -->
            <a-card :bordered="true" class="health-card">
                <a-result :status="status" :title="message" :sub-title="subMessage">
                    <template #icon v-if="loading">
                        <SyncOutlined spin style="color: #1677ff" />
                    </template>

                    <!-- 属性面板描述 -->
                    <div class="desc-box">
                        <a-descriptions bordered :column="{ xxl: 3, xl: 3, lg: 3, md: 1, sm: 1, xs: 1 }">
                            <a-descriptions-item label="监控对象">
                                <a-space>
                                    <CloudServerOutlined />
                                    <span>User Center Backend</span>
                                </a-space>
                            </a-descriptions-item>
                            <a-descriptions-item label="拨测路径">
                                <a-space>
                                    <ApiOutlined />
                                    <span>GET /health</span>
                                </a-space>
                            </a-descriptions-item>
                            <a-descriptions-item label="最后更新">
                                <a-space>
                                    <FieldTimeOutlined />
                                    <span>{{ lastCheckTime }}</span>
                                </a-space>
                            </a-descriptions-item>
                        </a-descriptions>
                    </div>

                    <template #extra>
                        <a-button type="primary" :loading="loading" @click="handleCheck" size="large">
                            {{ loading ? "正在全面诊断..." : "重新发起诊断" }}
                        </a-button>
                    </template>
                </a-result>
            </a-card>
        </a-space>
    </a-layout>
</template>

<style scoped>
.health-check-layout {
    height: 100%;
    background: transparent;
}

.overview-card {
    background: linear-gradient(135deg, rgb(22 119 255 / 12%) 0%, rgb(47 84 235 / 8%) 100%);
    border-radius: 12px;
}

.overview-header {
    display: flex;
    align-items: center;
}

.overview-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: rgb(0 0 0 / 85%);
}

.overview-subtitle {
    margin: 4px 0 0;
    color: rgb(0 0 0 / 45%);
}

.overview-icon {
    font-size: 32px;
    color: #1677ff;
}

.health-card {
    padding: 24px 0;
    border-radius: 8px;
}

.desc-box {
    max-width: 900px;
    padding: 24px 16px;
    margin: 0 auto;
    text-align: left;
    background-color: #fafafa;
    border-radius: 8px;
}
</style>
