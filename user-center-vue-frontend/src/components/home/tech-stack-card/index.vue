<script setup lang="ts">
/**
 * 技术栈卡片组件
 */
defineOptions({ name: "TechStackCard" });

defineProps<{
    title: string;
    technologies: string[];
    color: string;
}>();
</script>

<template>
    <a-card :bordered="true" :style="{ borderLeft: `4px solid ${color}` }" id="tech-stack-card" hoverable>
        <a-typography-title :level="5" class="stack-title">
            {{ title }}
        </a-typography-title>
        <div class="technologies">
            <a-tag v-for="tech in technologies" :key="tech">
                {{ tech }}
            </a-tag>
        </div>
    </a-card>
</template>

<style scoped>
#tech-stack-card {
    background: transparent;
    border-radius: 8px;
    transition: all 0.3s ease;
}

#tech-stack-card:hover {
    box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
}

#tech-stack-card :deep(.ant-card-body) {
    padding: 20px;
}

.stack-title {
    margin-bottom: 16px !important;
}

.technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>
