<script lang="ts">
  import FileInput from "$lib/components/FileInput.svelte";
</script>

<h1>TsukuBasho（ベータ版）</h1>

<h2>初回のデータ登録を行ってください</h2>
<main>
  <p>
    大学公式の資料
    <a
      href="https://www.tsukuba.ac.jp/education/pdf/how-to-check-the-classrooms-to-be-used-for-courses.pdf"
      >「授業で使用する教室の確認方法」</a
    >を参考にダウンロードしたExcelファイルを登録してください
  </p>
  <p>
    なお、データは完全に端末の中で処理され、インターネットにアップロードされることは一切ありません
  </p>

  <FileInput />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
