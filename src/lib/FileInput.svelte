<script lang="ts">
  import Progress from "./Progress.svelte";

  const progress = {
    value: 0,
    text: "",
    isError: false
  };

  let filesDOM: HTMLInputElement;
  let isDragged = false;

  const getFiles = (event: DragEvent) => {
    isDragged = false;
    if (
      filesDOM.files &&
      event.dataTransfer &&
      event.dataTransfer.files.length > 0
    ) {
      filesDOM.files = event.dataTransfer.files;
    }
  };

  const toString = (n: number | string | undefined) => {
    if (n === undefined) {
      return n;
    } else {
      return String(n);
    }
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
  on:dragover|preventDefault={() => {
    isDragged = true;
  }}
  on:dragleave={() => {
    isDragged = false;
  }}
  on:drop|preventDefault={getFiles}
  on:click={() => {
    filesDOM.click();
  }}
>
  <div>
    <span>ここにファイルをドロップ</span>
    <span>もしくはタップしてファイルを選択</span>
  </div>
</button>

<input type="file" id="userfile" accept=".xlsx" bind:this={filesDOM} />

<button type="submit" disabled={!filesDOM?.value} on:click={uploadFiles}
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
