<script>
    import { onMount } from "svelte";
    import firebaseConfig from "../util/firebase-config";
    import { initializeApp } from "firebase/app";
    import { getFirestore, getDocs, collection } from "firebase/firestore";
    import LoadingSvg from "../assets/LoadingSVG.svelte";

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let videos;

    onMount(async () => {
        const videoCollection = await getDocs(collection(db, "videos"));
        videos = videoCollection.docs.map((doc) => {return doc.data()}).sort((vid1, vid2) => vid2.likes-vid1.likes);
    })
</script>

<div class="w-screen min-h-screen flex justify-center">
    <div class="bg-white p-12 my-12">
        <h1 class="text-4xl text-black text-center pb-8">Leaderboard</h1>
        {#if videos}
        <table class="table-fixed">
            <thead>
                <tr>
                    <th class="w-20">LIKES</th>
                    <th>CLIP NAME</th>
                </tr>
            </thead>
            <tbody>
                {#each videos as vid}
                    <tr>
                        <td class="text-center">{vid.likes}</td>
                        <td class="max-w-2xl"><a href="/video/{vid.id}">{vid.title}</a></td>
                    </tr>
                {/each}
            </tbody>
        </table>
        {:else}
            <div class="flex justify-center">
                <LoadingSvg/>
            </div>
        {/if}
    </div>
</div>
