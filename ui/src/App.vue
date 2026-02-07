<template>
  <div class="shop-container">
    <h1>🛒 Shop Master</h1>

    <div class="input-group">
      <input
        v-model="newTask"
        @keyup.enter="addItem"
        placeholder="What do you need to buy?"
      />
      <button @click="addItem" :disabled="!newTask.trim()">Add Item</button>
    </div>

    <div v-if="loading">Loading items...</div>
    <ul v-else>
      <li
        v-for="item in items"
        :key="item.id"
        :class="item.status.toLowerCase().replace(' ', '-')"
      >
        <div class="item-info">
          <span class="id-badge">#{{ item.id }}</span>
          <span class="task-text">{{ item.task }}</span>
          <span class="status-tag">{{ item.status }}</span>
        </div>

        <div class="actions">
          <button
            v-if="item.status !== 'Complete'"
            @click="updateStatus(item.id, 'Complete')"
            class="btn-done"
          >
            ✓
          </button>
          <button @click="deleteItem(item.id)" class="btn-delete">🗑</button>
        </div>
      </li>
    </ul>

    <p v-if="items.length === 0 && !loading" class="empty-msg">
      Your shopping list is empty!
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const items = ref([]);
const newTask = ref('');
const loading = ref(true);

// In production, Nginx proxies /api to the backend
const API_URL = '/api';

const fetchItems = async () => {
  try {
    const res = await fetch(`${API_URL}/items`);
    items.value = await res.json();
  } catch (e) {
    console.error('Failed to fetch', e);
  } finally {
    loading.value = false;
  }
};

const addItem = async () => {
  if (!newTask.value.trim()) return;
  await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: newTask.value }),
  });
  newTask.value = '';
  await fetchItems();
};

const updateStatus = async (id, status) => {
  await fetch(`${API_URL}/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  await fetchItems();
};

const deleteItem = async (id) => {
  await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
  await fetchItems();
};

onMounted(fetchItems);
</script>

<style scoped>
.shop-container {
  max-width: 500px;
  margin: 2rem auto;
  font-family: sans-serif;
}
.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
}
input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
  margin-bottom: 5px;
}
.complete {
  opacity: 0.6;
  text-decoration: line-through;
}
.id-badge {
  font-size: 0.8rem;
  color: #888;
  margin-right: 10px;
}
.status-tag {
  font-size: 0.7rem;
  background: #ddd;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 10px;
}
.btn-done {
  background: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.btn-delete {
  background: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 5px;
}
</style>
