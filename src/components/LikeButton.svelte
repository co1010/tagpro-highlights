<script>
    import LikeFilledSvg from "../assets/LikeFilledSVG.svelte";
    import { increment, updateDoc, doc, arrayUnion } from "firebase/firestore";

    // Get db passed to component
    export let db;
    export let id;
    export let otherId;
    export let setSeen;
    export let rerollVideos;
    export let bothWatched;

    let likeIcon = LikeFilledSvg;
    let clicked = false;

    async function onClick() {
        // also set both video combos to seen and reload the videos
        clicked = true;
        if (!bothWatched) {
            alert('You need to watch at least half of both videos in order to vote');
        } else {
            await updateDoc(doc(db, "videos", id.toString()), {
                likes: increment(1)
            });
            await updateDoc(doc(db, "users", localStorage.getItem('tphuserid')), {
                votes: increment(1),
                seen: arrayUnion(id*10000+otherId)
            });
            setSeen();
            rerollVideos();
        }
        clicked = false;
    }
</script>

<button class="border-black bg-white/10 border-2 hover:border-4 hover:bg-white/30 focus:border-4 focus:bg-white/30 p-3" on:click={onClick} disabled={clicked}>
    <p class="text-2xl">
        <LikeFilledSvg/>
        Like
    </p>
</button>