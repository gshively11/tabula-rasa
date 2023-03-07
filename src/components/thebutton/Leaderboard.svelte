<script>
  import { leaders } from '../../nanostores/the-button.ts'
</script>

<div class="border-solid border-2 p-5 pt-0 rounded-lg dark:border-slate-300 border-slate-800">
  <h2
    class="text-xl dark:bg-purple-800 bg-purple-300 text-center mb-3 rounded-lg -mt-3 w-60 mx-auto dark:text-slate-300"
  >
    Top 10 Button Pushers
  </h2>
  <div class="grid grid-cols-5 gap-2 tracking-wide auto-cols-auto">
    {#each $leaders as entry, i}
      <span class="pr-3 text-right font-bold text-lg col-span-2" id="score-{entry.username}">
        {entry.clickCount}
      </span>
      <span class="text-left text-md pt-0.5 col-span-3">
        {#if i === 0}
          🥇
        {/if}
        {#if i === 1}
          🥈
        {/if}
        {#if i === 2}
          🥉
        {/if}
        {entry.username}
      </span>
    {/each}
  </div>
</div>
