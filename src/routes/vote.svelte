<script>
    import Clip from "../components/Clip.svelte";
    import LikeButton from "../components/LikeButton.svelte";
    import firebaseConfig from "../util/firebase-config";
    import { onMount } from "svelte";
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc } from "firebase/firestore";
    import RefreshSvg from "../assets/RefreshSVG.svelte";
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let leftHover = false;
    let rightHover = false;
    let id1, id2;
    let url1, url2;
    let title1, title2;
    let ratio1, ratio2;
    $: hasWatched1 = false;
    $: hasWatched2 = false;
    $: bothWatched = hasWatched1 && hasWatched2;
    let seen;
    let watched;
    let numVids;
    let unique1 = {};
    let unique2 = {};

    function idToKey(id1, id2) {
        return id1*10000+id2;
    }

    function setSeen() {
        seen.push(idToKey(id1, id2));
        localStorage.setItem('seen', JSON.stringify(seen));
        if (!watched.includes(id1)) watched.push(id1);
        if (!watched.includes(id2)) watched.push(id2);
        localStorage.setItem('watched', JSON.stringify(watched));
        hasWatched1 = false;
        hasWatched2 = false;
    }

    function setValidIds() {
        if (seen === null || seen.length >= (numVids*(numVids-1))/2) {
            alert("You've seen every video combination! You can't vote any more.");
            close();
        } else {
            do {
                id1 = Math.floor(Math.random() * numVids)+1;
                id2 = Math.floor(Math.random() * (numVids-1))+1;
                if (id2 === id1) id2 = numVids;
            } while (seen.includes(idToKey(id1, id2)) || seen.includes(idToKey(id2, id1)));
            if (watched.includes(id1)) hasWatched1 = true;
            if (watched.includes(id2)) hasWatched2 = true;
        }
    }

    async function rerollVideos() {
        id1 = null;
        id2 = null;
        setValidIds();
        if (id1 != null) {
            const docData1 = await (await getDoc(doc(db, "videos", id1.toString()))).data();
            title1 = docData1.title;
            ratio1 = docData1.ratio;
            url1 = docData1.url;
            const docData2 = await (await getDoc(doc(db, "videos", id2.toString()))).data();
            title2 = docData2.title;
            ratio2 = docData2.ratio;
            url2 = docData2.url;
        }
    }

    onMount(async () => {
        seen = JSON.parse(localStorage.getItem('seen'));
        watched = JSON.parse(localStorage.getItem('watched'));
        numVids = await (await getDoc(doc(db, 'meta', 'videos'))).data().amount;
        rerollVideos();
    });

    function refreshVideo(id) {
        if (id === 1) {
            unique1 = {};
        } else {
            unique2 = {};
        }
    }

</script>

<div class="container flex flex-row min-w-full gap-0 h-screen">
    <div on:mouseleave={() => {leftHover = false}} on:mouseenter={() => leftHover = true} 
        class="h-screen max-h-screen flex-auto w-1/6 hover:w-5/6 bg-indigo-500 transition-all ease duration-250 delay-75">
        {#if id1 && url1}
            <div class="h-screen max-h-screen flex flex-col">
                <h1 class="flex-initial text-4xl h-8 break-words text-center">{title1}</h1>
                <div class="grow flex justify-center items-center">
                    <div style="max-width: 80%;">
                        {#key unique1}
                            <Clip showControls={!rightHover} src={url1} ratio={ratio1} size='3/4' bind:hasWatched={hasWatched1}/>
                        {/key}
                    </div>
                </div>
                <div class="flex-initial flex justify-center mb-4">
                    <button on:click={() => {refreshVideo(1)}} 
                        class="transititext-primary text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 
                        active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        data-te-toggle="tooltip"
                        title="Reload the video">
                        <RefreshSvg/>
                    </button>
                </div>
                <div class="flex-initial flex justify-center mb-4">
                    <LikeButton {db} id={id1} otherId={id2} {setSeen} {rerollVideos} {bothWatched}/>
                </div>
            </div>
        {/if}
    </div>
    <div on:mouseleave={() => {rightHover = false}} on:mouseenter={() => rightHover = true} 
        class="max-h-screen flex-auto w-1/6 hover:w-5/6 bg-cyan-500 flex flex-col justify-center transition-all ease duration-250 delay-75">
        {#if id2 && url2}
            <div class="h-screen flex flex-col">
                <h1 class="flex-initial text-4xl h-8 break-words text-center">{title2}</h1>
                <div class="grow flex justify-center items-center">
                    <div style="max-width: 80%;">
                        {#key unique2}
                            <Clip showControls={!leftHover} src={url2} ratio={ratio2} size='3/4' bind:hasWatched={hasWatched2}/>
                        {/key}
                    </div>
                </div>
                <div class="flex-initial flex justify-center mb-4">
                    <button on:click={() => {refreshVideo(2)}}
                        class="transititext-primary text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 
                        active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        data-te-toggle="tooltip"
                        title="Reload the video">
                        <RefreshSvg/>
                    </button>
                </div>
                <div class="flex-initial flex justify-center mb-4">
                    <LikeButton {db} id={id2} otherId={id1} {setSeen} {rerollVideos} {bothWatched}/>
                </div>
            </div>
        {/if}
    </div>
</div>


