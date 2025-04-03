<script lang="ts">
  import { getCoursesMap } from "$lib/idb";
  import { completeNumber, searchNumberFromName } from "$lib/search";
  import { openDB, type IDBPDatabase } from "idb";
  import type { TsukuBashoDB } from "$lib/idb";
  import type { CoursesMap } from "$lib/types";
  import { onMount } from "svelte";

  let query = $state("");
  let result: { number: string; name: string; classroom: string }[] = $state(
    []
  );
  let number = $state({ shown: 0, searched: 0 });

  const dbName = "TsukuBasho";

  let db: IDBPDatabase<TsukuBashoDB>;
  let coursesMap: CoursesMap;

  let searchProcesses: number[] = [];

  onMount(async () => {
    db = await openDB<TsukuBashoDB>(dbName);
    coursesMap = await getCoursesMap(db);
  });

  const addResultToDOM = (courseNumber: string, i: number) => {
    const c = coursesMap.get(courseNumber);
    if (c === undefined) {
      throw new Error("見つかりません");
    }
    const limit = 20;
    if (i < limit) {
      // 最初のlimit件までは即時に投入、それ以降は順番に追加していく（見える範囲のちらつきを防止しつつ操作が固まらないように）
      result.push({
        number: courseNumber,
        name: c.name,
        classroom: c.classroom
      });
      number.shown += 1;
    } else {
      const timeoutId = setTimeout(() => {
        result.push({
          number: courseNumber,
          name: c.name,
          classroom: c.classroom
        });
        number.shown += 1;
      });
      searchProcesses.push(timeoutId);
    }
  };
  const search = async () => {
    // 結果のDOM追加を中止
    searchProcesses.forEach((p) => {
      clearTimeout(p);
    });
    searchProcesses = [];

    // 空白の場合検索しない
    if (query === "") {
      result = [];
      number = { shown: 0, searched: 0 };
      return;
    }

    // 科目番号で検索
    const courseNumbers = completeNumber(coursesMap, query);
    // 科目名で検索
    const courseNumbers1 = searchNumberFromName(coursesMap, query);

    // 内容をいったんリセット
    result = [];
    number = {
      shown: 0,
      searched: courseNumbers.length + courseNumbers1.length
    };
    courseNumbers.forEach(addResultToDOM);
    courseNumbers1.forEach(addResultToDOM);
  };
</script>

<h1>TsukuBasho（ベータ版）</h1>

<p>はじめての場合は、まず<a href="/welcome">データの登録</a>を行ってください</p>

<main>
  <div class="top">
    <form>
      <label for="search">科目番号か科目名で検索</label>
      <div class="search-box">
        <input
          type="search"
          id="search"
          bind:value={query}
          oninput={search}
        /><button type="button" aria-label="検索" title="検索" onclick={search}
          ><img src="/search.svg" alt="" /></button
        >
      </div>
    </form>
    <p class="overview">
      {#if result && result[0]}
        <span>{result[0].number}</span>
        <span>{result[0].name}</span>
        <span>の教室は</span>
        <span class="classroom">{result[0].classroom}</span>
        <span>です！</span>
      {:else}
        授業がみつかりません
      {/if}
    </p>
  </div>
  <div class="courses">
    <p>
      他にも{number.searched}件の授業が見つかりました（{number.shown}件を表示中）
    </p>
    {#each result as course (course.number)}
      {#if course}
        <div class="card">
          <p>
            <span class="course-number"
              ><a
                href="https://kdb.tsukuba.ac.jp/syllabi/2025/{course.number}/jpn"
                target="_blank"
                rel="noopener">{course.number}</a
              ></span
            >
            <span class="course-name">{course.name}</span>
          </p>
          <p class="classroom">
            {#if course.classroom}
              <span>{course.classroom}</span>
            {:else}
              <span class="notfound">情報なし</span>
            {/if}
          </p>
        </div>
      {/if}
    {/each}
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    width: min(62.5rem, 100dvw);
    background-color: var(--color-bg-white);
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0.25rem 0.25rem 0.5rem lightgray;
  }

  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .overview {
    height: 5rem;
    .classroom {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
    }
  }

  .search-box {
    position: relative;
    height: 2.75rem;

    input[type="search"] {
      height: 100%;
      width: 25rem;
      padding: 0.375em 0.5em;
      font-size: 1.25rem;
      line-height: 1.2;
      border-radius: 0.5em 0 0 0.5em;
      border: 1px solid #aaa;
      border-right: none;
    }

    button {
      position: absolute;
      top: 0;
      height: 100%;
      width: 2rem;
      margin: 0;
      border-radius: 0 0.5em 0.5em 0;
      border: 1px solid #aaa;
      border-left: none;
      cursor: pointer;
    }
  }

  .courses {
    margin-inline: 5rem;
  }
  .card {
    border: 1px solid #ddd;
    padding: 0.5em;
    margin-block: 1em;
    border-radius: 0.5em;
    box-shadow: 0.25rem 0.25rem 0.5rem lightgray;

    &:hover {
      background-color: #f5f5f5;
    }

    p {
      margin-block: 0.5em;
    }

    .classroom {
      font-size: 1.5rem;
      font-weight: bold;
      margin-inline-start: 1em;

      .notfound {
        color: var(--color-text-lightgray);
        font-size: 1.5rem;
        font-weight: normal;
      }
    }
  }
</style>
