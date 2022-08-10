<script>
    import admins from '../util/admins';
    import firebaseConfig from "../util/firebase-config";
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
    import { onMount } from 'svelte';


    export let user;
    $: requests = [];

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    onMount(async () => {
        requests = await (await getDoc(doc(db, "meta", "videos"))).data().requests;
    });

    async function approveRequest(i, id, title) {
        await updateDoc(doc(db, "videos", id), {
            title: title
        });
        removeRequest(i, id, title);
    }

    async function removeRequest(i, id, title) {
        await updateDoc(doc(db, "meta", "videos"), {
            requests: arrayRemove({id: id, title: title})
        })
        requests.splice(i, 1);
        requests = requests;
    }

</script>

{#if admins.includes(user)}
    <div class="w-screen min-h-screen flex justify-center">
        <div class="bg-white my-8 p-8 flex flex-col gap-8">
            <h1 class="text-3xl underline">Clip Title Requests</h1>
            {#each requests as {id, title}, i}
                <div class="flex items-center gap-4">
                    <a href="/video/{id}" class="text-2xl">{title}</a>
                    <button on:click={() => removeRequest(i, id, title)} class="button rounded-full bg-red-600 p-2"><p class="text-white">Deny</p></button>
                    <button on:click={() => approveRequest(i, id, title)} class="button rounded-full bg-green-600 p-2"><p class="text-white">Approve</p></button>
                </div>
            {/each}
        </div>
    </div>
{:else}
    <div class="w-screen h-screen grid place-content-center">
        <div class="bg-white text-4xl p-8">Unauthorized. Contact me on discord if you want to help with moderation.</div>
    </div>
{/if}
