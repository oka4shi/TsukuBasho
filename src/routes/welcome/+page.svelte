<script lang="ts">
  import FileInput from "$lib/components/FileInput.svelte";
  import Progress from "$lib/components/Progress.svelte";
  import { registerFiles, progress } from "./script.svelte";

  let file = $state<File | null>(null);

  const excludingList = new Map([
    ["大学院科目を除外する", "0"],
    ["学際サイエンス・デザイン専門学群（マレーシア校）の授業を除外する", "U"],
    ["地球規模課題学位プログラム（学士）の授業を除外する", "VB"],
    ["外国人留学生等向けの日本語授業を除外する", "X"]
  ]);

  const defaultExludingKeys = Array.from(excludingList.values());
  let excludingCourses = $state(defaultExludingKeys);
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

  <FileInput bind:file />

  <Progress {...$progress} />

  <div class="excluding-courses">
    {#each excludingList.keys() as item (item)}
      {@const inputId = `exluding-course-${excludingList.get(item)}`}
      <div>
        <input
          type="checkbox"
          id={inputId}
          name="exluding-courses"
          value={excludingList.get(item)}
          bind:group={excludingCourses}
        />
        <label for={inputId}>{item}</label>
      </div>
    {/each}
  </div>

  <button
    type="button"
    class="register"
    disabled={file === null}
    onclick={() => {
      registerFiles(file, excludingCourses);
    }}>取り込む</button
  >
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .register {
    font-size: 1.5rem;
    font-weight: bold;
    background-color: var(--color-theme-1);
    color: white;
    padding: 0.5em 1em;
    cursor: pointer;
    margin: 1rem;
  }

  .register:hover:not(:disabled) {
    opacity: 0.8;
  }

  .register:disabled {
    background-color: var(--color-text-gray);
    cursor: not-allowed;
  }
</style>
