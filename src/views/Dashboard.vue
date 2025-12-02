<template>
  <Layout>
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <p class="text-sm text-gray-500">
            Overview of today’s activity — no charts, just clean stats & lists
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <ActionButton
            to="/orders"
            class="text-white bg-orange-600 hover:bg-orange-700"
            text="New Order"
          />
          <ActionButton to="/expenses" text="Add Expense" />
        </div>
      </div>

      <!-- Active Announcement -->
      <div v-if="activeAnnouncement" class="bg-orange-50 border-l-4 border-orange-500 px-4 py-3 rounded-md">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-sm font-semibold">Active Announcement</div>
            <div class="text-lg font-bold mt-1">{{ activeAnnouncement.title }}</div>
            <div class="text-sm text-gray-700 mt-1">{{ activeAnnouncement.body }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ new Date(activeAnnouncement.createdAt).toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <!-- KPI ROW -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Sales (Today)"
          :value="`$${Number(salesToday || 0).toFixed(2)}`"
          icon="💰"
          color="bg-green-50 text-green-700"
          caption="Total sales for today"
        />
        <KpiCard
          title="Orders (Today)"
          :value="orderStore.todayOrders.length"
          icon="📋"
          color="bg-blue-50 text-blue-700"
          caption="# of orders placed"
        />
        <KpiCard
          title="Expenses (Today)"
          :value="`$${Number(expensesToday || 0).toFixed(2)}`"
          icon="💸"
          color="bg-red-50 text-red-700"
          caption="Total expenses today"
        />
        <KpiCard
          title="Net Profit"
          :value="`$${Number(netProfit || 0).toFixed(2)}`"
          icon="📈"
          color="bg-purple-50 text-purple-700"
          caption="Sales minus expenses"
        />
      </div>

      <!-- MAIN ROW -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Orders list -->
        <Card title="Recent Orders" linkText="View All" linkTo="/orders">
          <div v-if="recentOrders.length === 0" class="text-sm text-gray-500">
            No orders yet.
          </div>
          <div v-else class="space-y-2">
            <RowCard
              v-for="o in recentOrders"
              :key="o.id"
              :title="`#${o.id}`"
              :subtitle="
                o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')
              "
              :rightText="`$${Number(o.total || 0).toFixed(2)}`"
              rightColor="text-green-600"
            />
          </div>
        </Card>

        <!-- Recent Expenses list -->
        <Card title="Recent Expenses" linkText="View All" linkTo="/expenses">
          <div v-if="recentExpenses.length === 0" class="text-sm text-gray-500">
            No expenses yet.
          </div>
          <div v-else class="space-y-2">
            <RowCard
              v-for="e in recentExpenses"
              :key="e.id"
              :title="e.category"
              :subtitle="e.description"
              :rightText="`$${Number(e.amount || 0).toFixed(2)}`"
              rightColor="text-red-600"
            />
          </div>
        </Card>

        <!-- Quick actions and Top Items column -->
        <div class="space-y-6">
          <Card title="Quick Actions">
            <div class="grid grid-cols-1 gap-2">
              <ActionButton to="/orders" icon="📋" text="Create Order" />
              <ActionButton to="/recipes" icon="📖" text="New Recipe" />
              <ActionButton to="/settings" icon="⚙️" text="Settings" />
            </div>
          </Card>

          <Card title="Top Items Today">
            <div v-if="topItems.length === 0" class="text-sm text-gray-500">
              No sales yet.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(item, idx) in topItems"
                :key="item.name"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center font-medium"
                  >
                    {{ idx + 1 }}
                  </div>
                  <div>
                    <div class="text-sm font-medium">{{ item.name }}</div>
                    <div class="text-xs text-gray-500">{{ item.qty }} sold</div>
                  </div>
                </div>
                <Badge
                  :text="`${item.qty} sold`"
                  color="bg-orange-100 text-orange-700"
                />
              </div>
            </div>
          </Card>
          <!-- <Card title="Announcements">
            <div v-if="announcements.length === 0" class="text-sm text-gray-500">No announcements</div>
            <div v-else class="space-y-3">
              <div v-for="ann in announcements" :key="ann.id" class="p-2 border rounded-lg bg-white">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="font-medium">{{ ann.title }} <small v-if="ann.pinned" class="text-xs text-orange-600">(Pinned)</small></div>
                    <div class="text-xs text-gray-500">{{ new Date(ann.createdAt).toLocaleString() }}</div>
                    <p class="text-sm text-gray-700 mt-1">{{ ann.body }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card> -->
        </div>
      </div>

      <!-- Bottom row: Items, alerts or other widgets -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Notes & Announcements">
          <div class="text-sm text-gray-500">No announcements</div>
          <Card>
            <div v-if="announcements.length === 0" class="text-sm text-gray-500">No announcements</div>
            <div v-else class="space-y-3">
              <div v-for="ann in announcements" :key="ann.id" class="p-2 border rounded-lg bg-white">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="font-medium">{{ ann.title }} <small v-if="ann.pinned" class="text-xs text-orange-600">(Pinned)</small></div>
                    <div class="text-xs text-gray-500">{{ new Date(ann.createdAt).toLocaleString() }}</div>
                    <p class="text-sm text-gray-700 mt-1">{{ ann.body }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Card>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { computed } from "vue";
import Layout from "../components/layout/Layout.vue";
import KpiCard from "../components/ui/KpiCard.vue";
import Card from "../components/ui/Card.vue";
import RowCard from "../components/ui/RowCard.vue";
import ActionButton from "../components/ui/ActionButton.vue";
import { useAnnouncementStore } from "../stores/announcementStore";
import Badge from "../components/ui/Badge.vue";
import { useOrderStore } from "../stores/orderStore";
import { useExpenseStore } from "../stores/expenseStore";

const orderStore = useOrderStore();
const expenseStore = useExpenseStore();

const salesToday = computed(() => orderStore.totalSalesToday);
const expensesToday = computed(() =>
  expenseStore.todayExpenses.reduce((s, e) => s + e.amount, 0)
);
const netProfit = computed(
  () => Number(salesToday.value || 0) - Number(expensesToday.value || 0)
);

const recentOrders = computed(() => [...orderStore.todayOrders].slice(0, 5));
const recentExpenses = computed(() =>
  [...expenseStore.todayExpenses].slice(0, 5)
);

const topItems = computed(() => {
  const map = new Map();
  orderStore.todayOrders.forEach((o) =>
    (o.items || []).forEach((i) =>
      map.set(i.name, (map.get(i.name) || 0) + (i.quantity || 0))
    )
  );
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));
});

const announcementStore = useAnnouncementStore();
const announcements = computed(() => {
  // pinned first, then most recent
  return [...announcementStore.announcements].sort((a, b) => {
    if ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) !== 0) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
});
const activeAnnouncement = computed(() => announcementStore.announcements.find(a => a.active) || null)
</script>
