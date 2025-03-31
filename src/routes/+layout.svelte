<script lang="ts">
  import "./styles.css";

  let { children } = $props();
</script>

<div class="app">
  <main>
    {@render children()}
  </main>

  <footer>
    <p>筑波大学教室確認支援システム TsukuBasho - 2025 おかし</p>
  </footer>
</div>
