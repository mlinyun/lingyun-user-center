<script setup lang="ts">
/**
 * 用户设置页面.
 */
defineOptions({ name: "UserSettings" });
</script>

<template>
    <a-layout id="user-settings">
        <a-layout-content class="settings-content">
            <div>用户设置页面</div>
        </a-layout-content>
    </a-layout>
</template>

<style scoped>
#user-settings {
    height: 100%;
    background: rgb(255 255 255 / 80%);
}
</style>
