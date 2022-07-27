<script>
    import LikeSvg from "../assets/LikeSVG.svelte";
    import LikeFilledSvg from "../assets/LikeFilledSVG.svelte";
    import firebaseConfig from "../util/firebase-config";
    import { initializeApp } from "firebase/app";
    import { getFirestore, increment, updateDoc, doc } from "firebase/firestore";

    export let id;

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let likeIcon = LikeSvg;
    let clicked = false;

    async function onClick() {
        clicked = true;
        likeIcon = LikeFilledSvg;
        await updateDoc(doc(db, "videos", id), {
            likes: increment(1)
        })
        await updateDoc(doc(db, "users", localStorage.getItem('userid')), {
            votes: increment(1)
        })
    }
</script>

<button on:click={onClick} disabled={clicked}><svelte:component this={likeIcon}/></button>