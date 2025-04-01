<script lang="ts">
  import type { ChangeEventHandler, DragEventHandler } from "svelte/elements";
  import Progress from "./Progress.svelte";

  const progress = {
    value: 0,
    text: "",
    isError: false
  };

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

  const uploadFiles = async () => {
    if (!filesDOM.files) {
      return;
    }

    const files = [...filesDOM.files];

    if (files && files.length > 0) {
      progress.text = "アップロートURLを取得しています";
      progress.value = 0;

      progress.text = "画像のアップロードが完了しました";
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

<button type="submit" disabled={!isSetFiles} onclick={uploadFiles}
  >取り込む</button
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
