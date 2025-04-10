<script lang="ts">
  import { deleteIdb } from "$lib/idb";
  import { PUBLIC_IDB_NAME } from "$env/static/public";
</script>

<h1>設定</h1>
<p>各種設定が行えます</p>

<h2>データをリセットする</h2>
<p>登録したデータを削除します。この操作は取り消せませんので、ご注意ください</p>
<button
  type="button"
  onclick={() => {
    deleteIdb(PUBLIC_IDB_NAME || "TsukuBasho");
  }}>リセット</button
>
