<script>
    import CheckSvg from "../assets/CheckSVG.svg";
    import CloseSvg from "../assets/CloseSVG.svelte";
    import EditSvg from "../assets/EditSVG.svelte";

    export let title = '';

    let newTitle = title;
    let editting = true;

    const imgUrl = new URL('./img.png', import.meta.url).href

    function edit() {
        editting = true;
    }

</script>

<div class="h-8 text-center border">
    {#if editting}
        <input class="text-4xl bg-transparent border-2 border-black rounded-lg pl-2" type="text" bind:value={newTitle}>
        <button on:click={() => console.log("x")}><CloseSvg/></button>
        <button on:click={() => console.log("check")}><img src={CheckSvg} alt="check"/></button>
    {:else}
        <h1 class="text-4xl h-8 break-words">{title} <button on:click={edit}><EditSvg/></button></h1>
    {/if}
</div>