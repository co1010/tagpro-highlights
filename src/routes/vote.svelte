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

    let id1 = "1";
    let id2 = "2";
    let url1, url2;
    let title1, title2;
    let ratio1, ratio2;

    onMount(async () => {
        const docData1 = await (await getDoc(doc(db, "videos", id1))).data();
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
        const docData2 = await (await getDoc(doc(db, "videos", id2))).data();
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
    );

    let leftHover = false;
    let rightHover = false;

</script>

<div class="container flex flex-row min-w-full gap-0 h-screen overflow-hidden">
    <div on:mouseleave={() => {leftHover = false}} on:mouseenter={() => leftHover = true} 
        class="max-h-screen flex-auto w-1/6 hover:w-5/6 bg-indigo-500 flex justify-center transition-all ease duration-250 delay-75">
        {#if url1}
            <div>
                <div class="flex justify-center">
                    <h1 class="text-2xl h-8">{title1}</h1>
                </div>
                <Clip showControls={!rightHover} src={url1} ratio={ratio1}/>
                <div class="flex justify-center m-8">
                    <LikeButton id={id1}/>
                </div>
            </div>
        {/if}
    </div>
    <div on:mouseleave={() => {rightHover = false}} on:mouseenter={() => rightHover = true} 
        class="max-h-screen flex-auto w-1/6 hover:w-5/6 bg-cyan-500 flex justify-center transition-all ease duration-250 delay-75">
        {#if url2}
            <div>
                <div class="flex justify-center">
                    <h1 class="text-2xl h-8">{title2}</h1>
                </div>
                <Clip showControls={!leftHover} src={url2} ratio={ratio2}/>
                <div class="flex justify-center m-8">
                    <LikeButton id={id2}/>
                </div>
            </div>
        {/if}
    </div>
</div>
