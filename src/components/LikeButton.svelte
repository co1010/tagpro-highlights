<script>
    import LikeFilledSvg from "../assets/LikeFilledSVG.svelte";
    import { increment, updateDoc, doc, arrayUnion } from "firebase/firestore";

    // Get db passed to component
    export let db;
    export let id;
    export let otherId;
    export let setSeen;
    export let rerollVideos;

    let likeIcon = LikeFilledSvg;
    let clicked = false;

    async function onClick() {
        // also set both video combos to seen and reload the videos
        clicked = true;
        await updateDoc(doc(db, "videos", id.toString()), {
            likes: increment(1)
        });
        await updateDoc(doc(db, "users", localStorage.getItem('userid')), {
            votes: increment(1),
            seen: arrayUnion(id*10000+otherId)
        });
        setSeen();
        rerollVideos();
        clicked = false;
    }
</script>

<button class="border-black bg-white/10 border-2 hover:border-4 hover:bg-white/30 focus:border-4 focus:bg-white/30 p-3" on:click={onClick} disabled={clicked}>
    <p class="text-2xl">
        <LikeFilledSvg/>
        Like
    </p>
</button>