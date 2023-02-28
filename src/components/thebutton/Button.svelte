<script>
  import { userScore, clicks } from '~/nanostores/the-button.ts'

  export let loggedIn

  function handleClick(e) {
    if (!e.isTrusted) {
      return false
    }
    if (e.detail === 0) {
      return false
    }
    clicks.set([...clicks.get(), { timestamp: Math.round(e.timeStamp) }])
  }
</script>

<div class="flex flex-col">
  {#if loggedIn}
    <div class="mx-auto pb-5">
      <span class="pr-2">Your Score:</span>
      <span class="font-bold">{$userScore}</span>
    </div>
    <button class="thebutton text-white select-none" on:click={handleClick}>
      <span class="thebutton-shadow" />
      <span class="thebutton-edge" />
      <span class="thebutton-front font-bold px-36 py-36 border-1 border-red-900">
        The
        <br />
        Button
      </span>
    </button>
  {:else}
    <a class="btn btn-primary w-full sm:w-auto sm:mt-10 select-none" href="/signup/">
      Sign up to play!
    </a>
  {/if}
</div>

<style>
  /**
 * thebutton styling inspired by https://www.joshwcomeau.com/animation/3d-button/
 */
  .thebutton {
    position: relative;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
    transition: filter 250ms;
  }
  .thebutton-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    background: hsl(0deg 0% 50% / 0.25);
    transform: translateY(12px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }
  .thebutton-edge {
    position: absolute;
    top: 4px;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    background: linear-gradient(
      to left,
      hsl(340deg 100% 16%) 0%,
      hsl(340deg 100% 32%) 8%,
      hsl(340deg 100% 32%) 92%,
      hsl(340deg 100% 16%) 100%
    );
  }
  .thebutton-front {
    display: block;
    position: relative;
    border-radius: 9999px;
    font-size: 1.25rem;
    background: hsl(345deg 100% 47%);
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }
  .thebutton:hover {
    filter: brightness(110%);
  }
  .thebutton:hover .thebutton-front {
    transform: translateY(-10px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }
  .thebutton:active .thebutton-front {
    transform: translateY(-2px);
    transition: transform 34ms;
  }
  .thebutton:hover .thebutton-shadow {
    transform: translateY(18px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }
  .thebutton:active .thebutton-shadow {
    transform: translateY(10px);
    transition: transform 34ms;
  }
  .thebutton:focus:not(:focus-visible) {
    outline: none;
  }
</style>
