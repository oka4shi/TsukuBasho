<script lang="ts">
  import { PUBLIC_IDB_NAME } from "$env/static/public";
  import { getCoursesMap, searchIdb } from "$lib/idb";
  import { completeNumber, searchNumberFromName } from "$lib/search";
  import { openDB, type IDBPDatabase } from "idb";
  import type { TsukuBashoDB } from "$lib/idb";
  import type { CoursesMap } from "$lib/types";
  import { onMount } from "svelte";

  let query = $state("");
  let results: { number: string; name: string; classroom: string }[][] = $state(
    [[]]
  );
  let number = $state({ shown: 0, searched: 0 });
  let dbExist = $state<boolean | null>(null);

  const dbName = PUBLIC_IDB_NAME || "TsukuBasho";

  let db: IDBPDatabase<TsukuBashoDB>;
  let coursesMap: CoursesMap;

  let searchProcesses: number[] = [];

  onMount(async () => {
    const database = await searchIdb(dbName);
    if (database) {
      dbExist = true;
      db = await openDB<TsukuBashoDB>(dbName);
      coursesMap = await getCoursesMap(db);
    } else {
      dbExist = false;
    }
  });

  const addResultToDOM = (coursesNumbers: string[]) => {
    const chunk = 10;

    const chunks: typeof results = [
      ...Array(Math.ceil(coursesNumbers.length / chunk))
    ].map(() => []);

    coursesNumbers.forEach((courseNumber, i) => {
      const c = coursesMap.get(courseNumber);
      if (c === undefined) {
        throw new Error("見つかりません");
      }

      // 最初のchunk件までは即時に投入、それ以降はchunk件ずつ順番に追加していく（見える範囲のちらつきを防止しつつ操作が固まらないように）
      if (i < chunk) {
        results[0].push({
          number: courseNumber,
          name: c.name,
          classroom: c.classroom
        });
        number.shown += 1;
      } else {
        chunks[Math.floor(i / chunk)].push({
          number: courseNumber,
          name: c.name,
          classroom: c.classroom
        });
      }
    });

    chunks.forEach((c) => {
      const timeoutId = setTimeout(() => {
        results[0].push(...c);
        number.shown += c.length;
      });
      searchProcesses.push(timeoutId);
    });
  };
  const search = async () => {
    // 結果のDOM追加を中止
    searchProcesses.forEach((p) => {
      clearTimeout(p);
    });
    searchProcesses = [];

    // 空白の場合検索しない
    if (query === "") {
      results = [[]];
      number = { shown: 0, searched: 0 };
      //return;
    }

    // 科目番号で検索
    const courseNumbersResult = completeNumber(coursesMap, query);
    // 科目名で検索
    const courseNamesResult = searchNumberFromName(coursesMap, query);

    const combinedResult = Array.from(
      new Set([...courseNumbersResult, ...courseNamesResult])
    );

    // 内容をいったんリセット
    results = [[]];
    number = {
      shown: 0,
      searched: combinedResult.length
    };
    addResultToDOM(combinedResult);
  };
</script>

<h1>TsukuBasho（ベータ版）</h1>

<p>はじめての場合は、まず<a href="/welcome">データの登録</a>を行ってください</p>

<main>
  <div class="top">
    {#if dbExist === null}
      <p>データベースを読み込んでいます……</p>
    {/if}
    {#if dbExist}
      <form>
        <label for="search">科目番号か科目名で検索</label>
        <div class="search-box">
          <input
            type="search"
            id="search"
            bind:value={query}
            oninput={search}
          /><button
            type="button"
            aria-label="検索"
            title="検索"
            onclick={search}><img src="/search.svg" alt="" /></button
          >
        </div>
      </form>
    {:else if dbExist !== null}
      <p>登録したデータが見つかりません。</p>
      <p>
        はじめての場合やデータのリセットを行った場合は、まず<a href="/welcome"
          >データの登録</a
        >を行ってください
      </p>
    {/if}
  </div>
  <div class="courses">
    {#if dbExist}
      <p>
        {number.searched === 0
          ? "授業が見つかりませんでした"
          : `${number.searched}件の授業が見つかりました（${number.shown}件を表示中）`}
      </p>
      {#each results as result (result)}
        <div class="courses">
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
      {/each}
    {/if}
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

  .search-box {
    position: relative;
    height: 2.75rem;

    input[type="search"] {
      height: 100%;
      width: calc(100% - 2rem);
      max-width: 25rem;
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .card {
    border: 1px solid #ddd;
    padding: 0.5em;
    margin-block: 1em;
    border-radius: 0.5em;
    box-shadow: 0.25rem 0.25rem 0.5rem lightgray;

    width: 100%;
    max-width: 50rem;

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
