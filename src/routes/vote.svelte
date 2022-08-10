<script>
    import Clip from "../components/Clip.svelte";
    import LikeButton from "../components/LikeButton.svelte";
    import firebaseConfig from "../util/firebase-config";
    import { onMount } from "svelte";
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc } from "firebase/firestore";
    import { getStorage, ref, getDownloadURL } from "firebase/storage";
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage(app);

    let id1;
    let id2;
    let url1, url2;
    let title1, title2;
    let ratio1, ratio2;
    let seen;
    let numVids;

    function idToKey(id1, id2) {
        return id1*10000+id2;
    }

    function setSeen() {
        seen.push(idToKey(id1, id2));
    }

    function setValidIds() {
        if (seen.length >= (numVids*(numVids-1))/2) {
            alert("You've seen every video combination! You can't vote any more.");
            id1 = null;
            id2 = null;
            close();
        } else {
            do {
                id1 = Math.floor(Math.random() * numVids)+1;
                id2 = Math.floor(Math.random() * (numVids-1))+1;
                if (id2 === id1) id2 = numVids;
            } while (seen.includes(idToKey(id1, id2)) || seen.includes(idToKey(id2, id1)));
        }
    }

    async function rerollVideos() {
        setValidIds();
        if (id1 != null) {
            const docData1 = await (await getDoc(doc(db, "videos", id1.toString()))).data();
            title1 = docData1.title;
            ratio1 = docData1.width / docData1.height;
            const gsRef1 = ref(storage, docData1.gsPath);
            // Get the download URL
            getDownloadURL(gsRef1)
                .then((url) => {
                    url1 = url;
                })
                .catch((error) => {
                    console.log(`Error: ${error.code}`);
                });
            const docData2 = await (await getDoc(doc(db, "videos", id2.toString()))).data();
            title2 = docData2.title;
            ratio2 = docData2.width / docData2.height;
            const gsRef2 = ref(storage, docData2.gsPath);
            // Get the download URL
            getDownloadURL(gsRef2)
                .then((url) => {
                    url2 = url;
                })
                .catch((error) => {
                    console.log(`Error: ${error.code}`);
                });
        }
    }

    onMount(async () => {
        seen = await (await getDoc(doc(db, 'users', localStorage.getItem('userid')))).data().seen;
        numVids = await (await getDoc(doc(db, 'meta', 'videos'))).data().amount;
        rerollVideos();
    });

    let leftHover = false;
    let rightHover = false;

</script>

<div class="container flex flex-row min-w-full gap-0 h-screen overflow-hidden">
    <div on:mouseleave={() => {leftHover = false}} on:mouseenter={() => leftHover = true} 
        class="max-h-screen flex-auto w-1/6 hover:w-5/6 bg-indigo-500 flex justify-center transition-all ease duration-250 delay-75">
        {#if url1}
            <div>
                <div class="flex justify-center m-4">
                    <h1 class="text-4xl h-8 break-all">{title1}</h1>
                </div>
                <Clip showControls={!rightHover} src={url1} ratio={ratio1} size='3/4'/>
                <div class="flex justify-center m-6">
                    <LikeButton {db} id={id1} otherId={id2} {setSeen} {rerollVideos}/>
                </div>
            </div>
        {/if}
    </div>
    <div on:mouseleave={() => {rightHover = false}} on:mouseenter={() => rightHover = true} 
        class="max-h-screen flex-auto w-1/6 hover:w-5/6 bg-cyan-500 flex justify-center transition-all ease duration-250 delay-75">
        {#if url2}
            <div>
                <div class="flex justify-center m-4">
                    <h1 class="text-4xl h-8 break-all">{title2}</h1>
                </div>
                <Clip showControls={!leftHover} src={url2} ratio={ratio2} size='3/4'/>
                <div class="flex justify-center m-6">
                    <LikeButton {db} id={id2} otherId={id1} {setSeen} {rerollVideos}/>
                </div>
            </div>
        {/if}
    </div>
</div>
