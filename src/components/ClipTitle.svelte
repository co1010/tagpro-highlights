<script>
    import { arrayUnion, doc, updateDoc } from "firebase/firestore";
    import EditSvg from "../assets/EditSVG.svelte";

    export let id;
    export let title = '';
    export let db;

    let newTitle = title;
    let editting = false;

    async function submitRequest() {
        editting = false;
        await updateDoc(
            doc(db, "meta", "videos"), 
            {requests: arrayUnion({
                "id": id,
                "title": newTitle
            })}
        )
            .then(alert("Title change request successfully submitted. A moderator will review your request and if it's better than the current title it will be changed."))
    }

</script>

<div class="h-8 flex justify-center">
    {#if editting}
        <input class="text-4xl bg-transparent rounded-lg p-4 border" type="text" bind:value={newTitle} maxlength="69">
    {:else}
        <h1 class="text-4xl h-8 break-words">{title} <button on:click={() => {editting = true;}} class="align-bottom"><EditSvg/></button></h1>
    {/if}
    <div class="">
        {#if editting}
            <button on:click={() => {editting = false;}}><span class="text-2xl align-top pl-2">❌</span></button>
            <button on:click={submitRequest}><span class="text-2xl align-top">✔️</span></button>
        {/if}
    </div>
</div>