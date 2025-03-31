<script lang="ts">
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  type Props = {
    text: string;
    value: number;
    isError: boolean;
  };
  let { text, value, isError }: Props = $props();

  let tween = new Tween(0, {
    duration: 400,
    easing: cubicOut
  });

  $effect(() => {
    console.log(value);
    console.log("target", tween.target);
    console.log("current", tween.current);
    tween.target = value;
  });
</script>

<div class="progress_wrapper">
  <progress id="progress-file" class:error={isError} value={tween.current}
    >{Math.round(tween.current * 1000) / 10} %
  </progress>
  <label for="progress-file" class:error_text={isError}>{text}</label>
</div>

<style>
  label {
    color: var(--color-text);

    &.error_text {
      color: rgb(255, 0, 0);
    }
  }

  .progress_wrapper {
    width: 100%;
    margin: 1rem 0;
  }

  progress {
    height: 1rem;
    width: 100%;

    appearance: none;
    -webkit-appearance: none;
    box-shadow: none;
  }

  progress,
  progress::-webkit-progress-bar {
    background-color: #eee;
    border-radius: 0.5rem;
  }

  progress::-webkit-progress-value,
  progress::-moz-progress-bar {
    background-color: rgb(0, 160, 0);
  }
  progress.error::-webkit-progress-value,
  progress.error::-moz-progress-bar {
    background-color: rgb(255, 0, 0);
  }
</style>
