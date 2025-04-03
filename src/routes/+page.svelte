<script lang="ts">
  import { getCourseFromNumber, getCoursesMap } from "$lib/idb";
  import { searchNumberFromName } from "$lib/search";
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

  const search = async () => {
    result = [];
    number = { shown: 0, searched: 0 };
    searchProcesses.forEach((p) => {
      clearTimeout(p);
    });
    searchProcesses = [];

    if (query === "") {
      return;
    }

    const course = await getCourseFromNumber(db, query);
    if (course) {
      result.push({
        number: course.number,
        name: course.name,
        classroom: course.classroom
      });
      number = { shown: 1, searched: 1 };
    }

    const courseNumbers = searchNumberFromName(coursesMap, query);
    number.searched = courseNumbers.length;

    courseNumbers.forEach((courseNumber) => {
      const c = coursesMap.get(courseNumber);
      if (c === undefined) {
        throw new Error("見つかりません");
      }
      const timeoutId = setTimeout(() => {
        result.push({
          number: courseNumber,
          name: c.name,
          classroom: c.classroom
        });
        number.shown += 1;
      });
      searchProcesses.push(timeoutId);
    });
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
      {/if}
    </p>
  </div>
  <p>
    他にも{number.searched}件の授業が見つかりました（{number.shown}件を表示中）
  </p>
  <table>
    <thead>
      <tr>
        <th scope="col">科目番号</th>
        <th scope="col">科目名</th>
        <th scope="col">教室</th>
      </tr>
    </thead>
    <tbody>
      {#each result as course (course.number)}
        {#if course}
          <tr>
            <td class="course-number"
              ><a
                href="https://kdb.tsukuba.ac.jp/syllabi/2025/{course.number}/jpn"
                target="_blank"
                rel="noopener">{course.number}</a
              ></td
            >
            <td class="course-name">{course.name}</td>
            <td class="classroom">{course.classroom}</td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
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

  table {
    width: 100%;
    th {
      text-align: left;
    }
    tbody {
      .classroom {
        font-size: 1.125rem;
      }
    }
  }
</style>
