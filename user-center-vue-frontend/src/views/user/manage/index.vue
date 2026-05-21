<script setup lang="ts">
/**
 * 用户管理页面.
 */
defineOptions({ name: "UserManage" });
</script>

<template>
    <a-layout id="user-manage">
        <a-layout-content class="manage-content">
            <div>用户管理页面</div>
        </a-layout-content>
    </a-layout>
</template>

<style scoped>
#user-manage {
    height: 100%;
    background: rgb(255 255 255 / 80%);
}
</style>
