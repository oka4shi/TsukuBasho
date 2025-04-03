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

<div>
  <form>
    <input type="search" bind:value={query} oninput={search} />
    <button type="button" onclick={search}>検索</button>
  </form>
  <p>
    {#if result && result[0]}
      <span>{result[0].number}</span>
      <span>{result[0].name}</span>
      <span>の教室は</span>
      <span class="classroom">{result[0].classroom}</span>
      <span>です！</span>
    {/if}
  </p>
  <p>
    他にも{number.searched}件の授業が見つかりました（{number.shown}件を表示中）
  </p>
  <table>
    <tbody>
      {#each result as course (course.number)}
        {#if course}
          <tr>
            <td>{course.number}</td>
            <td>{course.name}</td>
            <td>{course.classroom}</td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>

<style>
  .classroom {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
  }
</style>
