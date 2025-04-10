<script lang="ts">
  import type { ChangeEventHandler, DragEventHandler } from "svelte/elements";

  type Props = {
    file: File | null;
  };
  let { file = $bindable(null) }: Props = $props();

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
    } else {
      file = null;
    }
  };

  const changeFileState: ChangeEventHandler<HTMLInputElement> = () => {
    file =
      filesDOM.files && filesDOM.files.length > 0 ? filesDOM.files[0] : null;
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
