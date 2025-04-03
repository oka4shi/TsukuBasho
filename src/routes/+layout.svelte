<script lang="ts">
  import "./styles.css";

  let { children } = $props();
</script>

<div class="app">
  {@render children()}

  <footer>
    <p>筑波大学教室確認支援システム TsukuBasho - 2025 おかし</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
