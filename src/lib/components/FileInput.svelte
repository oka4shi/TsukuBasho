<script lang="ts">
  import type { ChangeEventHandler, DragEventHandler } from "svelte/elements";
  import Progress from "./Progress.svelte";
  import { parseXlsxFile } from "../parseFile";

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
      progress = {
        text: "ファイルを変換しています……",
        value: 0.1,
        isError: false
      };
      const file = await files[0].arrayBuffer();

      progress = {
        text: "Excelファイルからデータをインポートしています……",
        value: 0.5,
        isError: false
      };
      try {
        await parseXlsxFile(file);

        progress = {
          text: "登録が完了しました！",
          value: 1,
          isError: false
        };
      } catch (error) {
        console.error(error);
        progress = {
          text: "登録中にエラーが発生しました！",
          value: 1,
          isError: true
        };
      }
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
  <p class="description">
    <span>ここにファイルをドロップ</span>
    <span>もしくはタップしてファイルを選択</span>
  </p>
</button>

<input
  type="file"
  id="userfile"
  accept=".xlsx"
  onchange={changeFileState}
  bind:this={filesDOM}
/>

<Progress {...progress} />

<button
  type="button"
  class="register"
  disabled={!isSetFiles}
  onclick={registerFiles}>取り込む</button
>

<style>
  button {
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

  input {
    display: none;
  }

  .drop_area {
    height: 10em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0.5em;

    border: 3px dotted #808080;

    .description {
      padding: 1em;

      span {
        color: var(--color-text-gray);
        text-align: center;
      }
    }
  }

  .dragged_background {
    background-color: rgba(30, 180, 255, 0.25);
  }
</style>
