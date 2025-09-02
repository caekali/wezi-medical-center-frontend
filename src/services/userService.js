import api from "@/plugins/axios";

export const getUsers = () => api.get("/users");
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);


// const users = ref([]);

// onMounted(async () => {
//   const res = await getUsers();
//   users.value = res.data;
// });