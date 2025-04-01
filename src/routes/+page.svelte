<script lang="ts">
  import {
    getCourseFromNumber,
    searchCoursesFromName,
    getCoursesMap
  } from "$lib/idb";
  import { openDB, type IDBPDatabase } from "idb";
  import type { Course, TsukuBashoDB } from "$lib/idb";
  import { onMount } from "svelte";

  let query = "";

  let result: (Course | undefined)[] = [];

  const dbName = "TsukuBasho";

  let db: IDBPDatabase<TsukuBashoDB>;
  let coursesMap: Map<string, string>;

  onMount(async () => {
    db = await openDB<TsukuBashoDB>(dbName);
    coursesMap = await getCoursesMap(db);
  });

  const search = async () => {
    result = [];
    const course = await getCourseFromNumber(db, query);

    const courses = await searchCoursesFromName(db, coursesMap, query);

    if (course) {
      result.push(course);
    }
    if (courses) {
      result = result.concat(courses);
    }
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
    {#if result[0]}
      <span>{result[0].number}</span>
      <span>{result[0].name}</span>
      <span>の教室は</span>
      <span class="classroom">{result[0].classroom}</span>
      <span>です！</span>
    {/if}
  </p>
  <table>
    <tbody>
      {#each result as course}
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
