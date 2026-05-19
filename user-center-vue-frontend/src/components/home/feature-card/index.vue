<script setup lang="ts">
/**
 * 功能特性卡片组件
 */
defineOptions({ name: "FeatureCard" });

defineProps<{
    icon: Component;
    title: string;
    desc: string;
    tags?: string[];
}>();
</script>

<template>
    <a-card :bordered="true" id="feature-card" hoverable>
        <div class="feature-icon">
            <component :is="icon" />
        </div>
        <a-typography-title :level="4" class="feature-title">
            {{ title }}
        </a-typography-title>
        <a-typography-paragraph class="feature-desc" type="secondary">
            {{ desc }}
        </a-typography-paragraph>
        <div v-if="tags && tags.length > 0" class="feature-tags">
            <a-tag v-for="tag in tags" :key="tag" color="blue">
                {{ tag }}
            </a-tag>
        </div>
    </a-card>
</template>

<style scoped>
#feature-card {
    height: 100%;
    background: transparent;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.feature-card :deep(.ant-card-body) {
    padding: 24px;
}

.feature-card:hover {
    box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
}

.feature-icon {
    margin-bottom: 16px;
    font-size: 32px;
}

.feature-title {
    margin-bottom: 12px !important;
}

.feature-desc {
    min-height: 66px;
    margin-bottom: 16px;
}

.feature-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>
