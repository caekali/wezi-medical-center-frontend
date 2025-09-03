<template>
  <AuthenticatedLayout>
    <UserProfile />
  </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/components/AuthenticatedLayout.vue'
import UserProfile from '@/components/UserProfile.vue'
</script>