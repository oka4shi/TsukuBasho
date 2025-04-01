<script lang="ts">
  import type { ChangeEventHandler, DragEventHandler } from "svelte/elements";
  import Progress from "./Progress.svelte";
  import { parseXlsxFile } from "../parseFile";
  import { deleteIdb } from "../idb";

  let progress = $state({
    value: 0,
    text: "",
    isError: false
  });

  let isSetFiles = $state(false);

  let filesDOM: HTMLInputElement;
  let isDragged = $state(false);

  const getFiles: DragEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    isDragged = false;
    if (
      filesDOM.files &&
      event.dataTransfer &&
      event.dataTransfer.files.length > 0
    ) {
      filesDOM.files = event.dataTransfer.files;
      isSetFiles = true;
    } else {
      isSetFiles = false;
    }
  };

  const changeFileState: ChangeEventHandler<HTMLInputElement> = () => {
    isSetFiles = filesDOM.files && filesDOM.files.length > 0 ? true : false;
  };

  const registerFiles = async () => {
    if (!filesDOM.files) {
      return;
    }

    const files = filesDOM.files;

    if (files && files.length === 1) {
      progress.text = "ファイルを変換しています……";
      progress.value = 0.1;

      const file = await files[0].arrayBuffer();
      progress.value = 0.5;

      progress.text = "Excelファイルからインポートしています……";
      parseXlsxFile(file);

      progress.text = "登録が完了しました！";
      progress.value = 1;
    } else {
      progress.text = "ファイルがありません";
      progress.value = 1;
      progress.isError = true;
    }
  };
</script>

<button
  type="button"
  class="drop_area"
  class:dragged_background={isDragged}
  ondragover={(e) => {
    e.preventDefault();
    isDragged = true;
  }}
  ondragleave={() => {
    isDragged = false;
  }}
  ondrop={getFiles}
  onclick={() => {
    filesDOM.click();
  }}
>
  <div>
    <span>ここにファイルをドロップ</span>
    <span>もしくはタップしてファイルを選択</span>
  </div>
</button>

<input
  type="file"
  id="userfile"
  accept=".xlsx"
  onchange={changeFileState}
  bind:this={filesDOM}
/>

<button type="button" disabled={!isSetFiles} onclick={registerFiles}
  >取り込む</button
>

<button
  type="button"
  onclick={() => {
    deleteIdb("TsukuBasho");
  }}>リセットする</button
>

<Progress {...progress} />

<style>
  input {
    display: none;
  }

  .drop_area {
    /* reset the default button styles */
    padding: 0;
    border: none;
    outline: none;
    font: inherit;
    color: inherit;
    background: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    height: 10em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    border: 1px dotted #808080;

    & span {
      color: var(--color-text-gray);
      text-align: center;
    }
  }

  .dragged_background {
    background-color: rgba(30, 180, 255, 0.25);
  }
</style>
